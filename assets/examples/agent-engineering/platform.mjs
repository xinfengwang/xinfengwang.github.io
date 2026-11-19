import assert from 'node:assert/strict';

const registry = new Map([['support', 'read_order'], ['research', 'read_document']]);
const access = new Map([
  ['tenant-a', new Set(['support', 'research'])],
  ['tenant-b', new Set(['support'])],
]);
const jobs = new Map();
const trace = [];

function key(tenant, user, requestKey) {
  return JSON.stringify([tenant, user, requestKey]);
}

function submit(session, agent, requestKey) {
  if (!registry.has(agent) || !access.get(session.tenant)?.has(agent)) return null;
  const id = key(session.tenant, session.user, requestKey);
  const existing = jobs.get(id);
  if (existing && existing.agent !== agent) return null;
  if (!existing) {
    jobs.set(id, { id, tenant: session.tenant, user: session.user, agent, status: 'queued' });
    trace.push({ jobId: id, event: 'queued' });
  }
  return id;
}

function statusFor(session, id) {
  const job = jobs.get(id);
  return job?.tenant === session.tenant && job.user === session.user ? job.status : null;
}

function work(id) {
  const job = jobs.get(id);
  if (!job || job.status !== 'queued') return job?.status;
  if (!access.get(job.tenant)?.has(job.agent)) {
    job.status = 'denied';
    trace.push({ jobId: job.id, event: 'authorization_denied' });
    return job.status;
  }
  const tool = registry.get(job.agent);
  const receipt = { scope: job.tenant, tool, reference: 'fixture:' + job.agent };
  job.status = 'complete';
  trace.push({ jobId: id, event: 'tool_completed', receipt });
  return job.status;
}

const alice = { tenant: 'tenant-a', user: 'alice' };
const bob = { tenant: 'tenant-b', user: 'bob' };
const first = submit(alice, 'support', 'request-1');
const second = submit(bob, 'support', 'request-1');
assert.notEqual(first, second);
assert.equal(submit(alice, 'support', 'request-1'), first);
assert.equal(submit(alice, 'research', 'request-1'), null);
assert.equal(jobs.size, 2);
assert.equal(statusFor(bob, first), null);
assert.equal(work(first), 'complete');
assert.equal(work(first), 'complete');
access.get(bob.tenant).delete('support');
assert.equal(work(second), 'denied');
assert.equal(trace.filter(span => span.event === 'tool_completed').length, 1);
assert.equal(trace.find(span => span.event === 'tool_completed').receipt.scope, alice.tenant);
console.table(trace);
