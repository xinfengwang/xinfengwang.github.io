import assert from 'node:assert/strict';

const plan = ['A.coverage', 'A.cadence', 'B.coverage', 'B.cadence'];
const sources = [
  { id: 'a-scope-v1', topic: 'A.coverage', publisher: 'A', primary: true, claim: 'Regional' },
  { id: 'a-copy-v1', topic: 'A.coverage', publisher: 'A', primary: false, claim: 'Regional' },
  { id: 'a-cadence-v1', topic: 'A.cadence', publisher: 'A', primary: true, claim: 'Weekly' },
  { id: 'b-scope-v1', topic: 'B.coverage', publisher: 'B', primary: true, claim: 'Global' },
  { id: 'b-summary-v1', topic: 'B.cadence', publisher: 'Newsletter', primary: false, claim: 'Daily' },
];

function research(topic, inventory, minimumSources = 1) {
  const primary = inventory.filter(source => source.topic === topic && source.primary);
  const independent = new Set(primary.map(source => source.publisher));
  if (independent.size < minimumSources) return { topic, status: 'missing' };
  const claims = new Set(primary.map(source => source.claim));
  const citations = primary.map(source => source.id);
  if (claims.size > 1) return { topic, status: 'conflict', citations };
  return { topic, status: 'supported', claim: primary[0].claim, citations };
}

const before = plan.map(topic => research(topic, sources));
const revised = [...sources, {
  id: 'b-cadence-v2', topic: 'B.cadence', publisher: 'B', primary: true, claim: 'Daily',
}];
const after = plan.map(topic => research(topic, revised));

assert.equal(before.filter(row => row.status === 'supported').length, 3);
assert.equal(before[3].status, 'missing');
assert.equal(after.filter(row => row.status === 'supported').length, 4);
assert.deepEqual(after[3].citations, ['b-cadence-v2']);
assert.equal(research('A.coverage', [...sources, { ...sources[0], id: 'a-duplicate' }], 2).status, 'missing');
console.table(before);
console.table(after);
