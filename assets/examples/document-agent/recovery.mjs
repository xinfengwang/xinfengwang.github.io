import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(import.meta.url);
const crashCode = 75;
const hash = text => createHash("sha256").update(text).digest("hex");

function open(dir) {
  const local = new DatabaseSync(join(dir, "agent.sqlite"), { timeout: 3000 });
  const remote = new DatabaseSync(join(dir, "draft-store.sqlite"), { timeout: 3000 });
  return { local, remote };
}

function init({ local, remote }) {
  local.exec(`
    CREATE TABLE job (
      id TEXT PRIMARY KEY, state TEXT NOT NULL, op_id TEXT NOT NULL UNIQUE,
      payload TEXT NOT NULL, approved_hash TEXT NOT NULL, receipt_version INTEGER
    );
  `);
  remote.exec(`
    CREATE TABLE draft (id TEXT PRIMARY KEY, version INTEGER NOT NULL, content TEXT NOT NULL);
    CREATE TABLE receipt (op_id TEXT PRIMARY KEY, payload_hash TEXT NOT NULL, version INTEGER NOT NULL);
    INSERT INTO draft VALUES ('release-checklist', 7, '上一版清单');
  `);
}

// The fixture stands in for a completed approval at the application boundary.
function approvedJob(local, id, baseVersion, content) {
  const payload = JSON.stringify({ target: "release-checklist", baseVersion, content });
  local.prepare("INSERT INTO job VALUES (?, 'approved', ?, ?, ?, NULL)")
    .run(id, randomUUID(), payload, hash(payload));
}

function readReceipt(remote, opId) {
  return remote.prepare("SELECT payload_hash, version FROM receipt WHERE op_id = ?").get(opId);
}

function applyDraft(remote, job) {
  remote.exec("BEGIN IMMEDIATE");
  try {
    const existing = readReceipt(remote, job.op_id);
    if (existing) {
      if (existing.payload_hash !== job.approved_hash) throw new Error("operation payload mismatch");
      remote.exec("COMMIT");
      return existing;
    }
    const { target, baseVersion, content } = JSON.parse(job.payload);
    const update = remote.prepare(
      "UPDATE draft SET version = version + 1, content = ? WHERE id = ? AND version = ?",
    ).run(content, target, baseVersion);
    if (update.changes !== 1) {
      remote.exec("ROLLBACK");
      return null;
    }
    const version = baseVersion + 1;
    remote.prepare("INSERT INTO receipt VALUES (?, ?, ?)")
      .run(job.op_id, job.approved_hash, version);
    remote.exec("COMMIT");
    return { payload_hash: job.approved_hash, version };
  } catch (error) {
    remote.exec("ROLLBACK");
    throw error;
  }
}

function worker({ local, remote }, id, crashAt) {
  const job = local.prepare("SELECT * FROM job WHERE id = ?").get(id);
  if (!job) throw new Error("unknown job");
  if (job.state !== "approved") return { status: job.state, via: "local" };
  if (hash(job.payload) !== job.approved_hash) {
    local.prepare("UPDATE job SET state = 'approval_invalid' WHERE id = ? AND state = 'approved'")
      .run(id);
    return { status: "approval_invalid", via: "local" };
  }

  const existing = readReceipt(remote, job.op_id);
  if (!existing && crashAt === "before-send") process.exit(crashCode);
  const receipt = existing ?? applyDraft(remote, job);
  if (receipt && !existing && crashAt === "after-commit") process.exit(crashCode);

  if (!receipt) {
    local.prepare("UPDATE job SET state = 'conflict' WHERE id = ? AND state = 'approved'").run(id);
    return { status: "conflict", via: "conditional_write" };
  }
  if (receipt.payload_hash !== job.approved_hash) throw new Error("receipt payload mismatch");
  local.prepare("UPDATE job SET state = 'saved', receipt_version = ? WHERE id = ? AND state = 'approved'")
    .run(receipt.version, id);
  return { status: "saved", via: existing ? "receipt" : "write", version: receipt.version };
}

function demo() {
  const dir = mkdtempSync(join(tmpdir(), "document-agent-"));
  const db = open(dir);
  try {
    init(db);
    approvedJob(db.local, "receipt-lost", 7, "冒烟测试通过后再安排发版");
    approvedJob(db.local, "before-send", 8, "发版后登记构建编号");
    approvedJob(db.local, "stale-target", 7, "已经过期的提案");
    approvedJob(db.local, "edited-after-approval", 9, "原先批准的内容");
    db.local.prepare("UPDATE job SET payload = ? WHERE id = ?")
      .run("changed outside the approval flow", "edited-after-approval");
  } finally {
    db.local.close();
    db.remote.close();
  }

  function child(id, crashAt, expectedExit = 0) {
    const args = [here, "worker", dir, id];
    if (crashAt) args.push(crashAt);
    const result = spawnSync(process.execPath, args, { encoding: "utf8" });
    assert.equal(result.status, expectedExit, result.error?.message ?? result.stderr);
    return result.stdout.trim() ? JSON.parse(result.stdout) : null;
  }

  child("receipt-lost", "after-commit", crashCode);
  const midway = open(dir);
  try {
    assert.equal(midway.local.prepare("SELECT state FROM job WHERE id = ?")
      .get("receipt-lost").state, "approved");
    assert.equal(midway.remote.prepare("SELECT version FROM draft").get().version, 8);
    assert.equal(midway.remote.prepare("SELECT count(*) AS n FROM receipt").get().n, 1);
  } finally {
    midway.local.close();
    midway.remote.close();
  }

  const recovered = child("receipt-lost");
  assert.deepEqual(recovered, { status: "saved", via: "receipt", version: 8 });
  assert.deepEqual(child("receipt-lost"), { status: "saved", via: "local" });
  child("before-send", "before-send", crashCode);
  const notSent = child("before-send");
  assert.deepEqual(notSent, { status: "saved", via: "write", version: 9 });
  const stale = child("stale-target");
  assert.equal(stale.status, "conflict");
  assert.equal(child("edited-after-approval").status, "approval_invalid");

  const verified = open(dir);
  try {
    const final = { version: verified.remote.prepare("SELECT version FROM draft").get().version,
      receipts: verified.remote.prepare("SELECT count(*) AS n FROM receipt").get().n };
    assert.deepEqual(final, { version: 9, receipts: 2 });
    console.log(JSON.stringify({ recovered, notSent, stale, final, dir }, null, 2));
  } finally {
    verified.local.close();
    verified.remote.close();
  }
}

if (process.argv[2] === "worker") {
  const [, , , dir, id, crashAt] = process.argv;
  const db = open(dir);
  try {
    console.log(JSON.stringify(worker(db, id, crashAt)));
  } finally {
    db.local.close();
    db.remote.close();
  }
} else {
  demo();
}
