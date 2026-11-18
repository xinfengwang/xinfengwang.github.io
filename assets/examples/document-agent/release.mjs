import assert from "node:assert/strict";
import { documents, makeSearch, runTask } from "./agent.mjs";

const normalSnapshot = "handbook-17";
const trialSnapshot = "handbook-18-incomplete";
const snapshots = {
  [normalSnapshot]: documents,
  [trialSnapshot]: documents.filter(doc => doc.id !== "test-v2#build"),
};
const baseline = Object.freeze({ id: "release-17", model: "fixture-v1", tool: "search-v1",
  policy: "scope-v1", aliases: Object.freeze({}),
  index: Object.freeze({ default: normalSnapshot, beta: normalSnapshot }) });
const repairIndex = process.argv.includes("--fixed-index");
const candidate = Object.freeze({ ...baseline, id: repairIndex ? "release-18-fixed" : "release-18",
  aliases: Object.freeze({ "上线": "发版" }),
  index: Object.freeze({ default: normalSnapshot, beta: repairIndex ? normalSnapshot : trialSnapshot }) });

const testVisible = ["test-v2#smoke", "test-v2#build"];
const prodVisible = ["prod-v4#approval", "prod-v4#build"];
const test = { env: "test", groups: ["dev"], visibleIds: testVisible, workspace: "default" };
const cases = [
  { ...test, id: "release-default", slice: "test-release", question: "测试环境怎么发版？" },
  { ...test, id: "release-beta", slice: "test-release", question: "测试环境怎么发版？", workspace: "beta" },
  { ...test, id: "synonym", slice: "colloquial", question: "测试环境怎么上线？" },
  { id: "release-prod", slice: "prod-release", question: "生产怎么发版？", env: "prod",
    groups: ["ops"], visibleIds: prodVisible, workspace: "default" },
  { id: "denied", slice: "guard", question: "生产怎么发版？", env: "prod", groups: ["dev"],
    visibleIds: [], expectedStop: "needs_evidence", workspace: "beta" },
  { id: "clarify", slice: "guard", question: "帮我发版", groups: ["dev"], visibleIds: [],
    expectedStop: "needs_environment", workspace: "default" },
];

async function sample(row, release) {
  const snapshot = release.index[row.workspace];
  const result = await runTask(
    { env: row.env, question: row.question }, { groups: row.groups },
    { search: makeSearch(snapshots[snapshot], release.aliases) },
  );
  const evidence = [...new Set(result.trace.filter(span => span.stage === "search")
    .flatMap(span => span.sourceIds ?? []))];
  return {
    release: release.id, snapshot, status: result.status, evidence,
    citations: (result.steps ?? []).map(step => step.id),
  };
}

function report(pairs, criticalSlice) {
  const eligible = pairs.filter(pair => !pair.row.expectedStop);
  const critical = eligible.filter(pair => pair.row.slice === criticalSlice);
  const score = (items, side) => ({
    complete: items.filter(pair => pair[side].status === "ready_for_review"
      && JSON.stringify(pair[side].citations) === JSON.stringify(pair.row.visibleIds)).length,
    eligible: items.length,
  });
  const guardFailures = pairs.filter(({ row, after }) => (
    after.evidence.some(id => !row.visibleIds.includes(id))
    || after.citations.some(id => !row.visibleIds.includes(id))
    || (row.expectedStop && after.status !== row.expectedStop)
  )).map(({ row }) => row.id);
  const regressions = critical.filter(pair => score([pair], "before").complete
    > score([pair], "after").complete).map(({ row, before, after }) => ({
    caseId: row.id, before, after,
    firstDifference: JSON.stringify(before.evidence) === JSON.stringify(after.evidence)
      ? "outcome_or_citations" : "search_results",
  }));
  const decision = guardFailures.length ? "rollback_guard"
    : critical.length < 2 ? "hold_for_more_pairs"
    : regressions.length ? "rollback_critical_slice" : "keep_observing";
  return { overall: { before: score(eligible, "before"), after: score(eligible, "after") },
    critical: { slice: criticalSlice, before: score(critical, "before"),
      after: score(critical, "after") }, guardFailures, regressions, decision };
}

const pairs = await Promise.all(cases.map(async row => ({
  row, before: await sample(row, baseline), after: await sample(row, candidate),
})));
const result = report(pairs, "test-release");
assert.deepEqual(result.overall, {
  before: { complete: 3, eligible: 4 }, after: { complete: repairIndex ? 4 : 3, eligible: 4 },
});
assert.equal(result.critical.before.complete, 2);
assert.equal(result.critical.after.complete, repairIndex ? 2 : 1);
assert.deepEqual(result.guardFailures, []);
assert.equal(result.decision, repairIndex ? "keep_observing" : "rollback_critical_slice");
if (!repairIndex) {
  assert.equal(result.regressions[0].caseId, "release-beta");
  assert.equal(result.regressions[0].firstDifference, "search_results");
}

const retryProbe = cases.find(row => row.id === "release-beta");
const selected = result.decision === "keep_observing" ? candidate : baseline;
const probe = await sample(retryProbe, selected);
assert.equal(probe.status, "ready_for_review");
assert.deepEqual(probe.citations, testVisible);
console.log(JSON.stringify({ ...result, selectedRelease: selected.id, probe }, null, 2));
