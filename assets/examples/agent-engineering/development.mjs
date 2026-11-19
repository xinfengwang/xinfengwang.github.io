import assert from 'node:assert/strict';

function defineRequirements() {
  return {
    examples: [[-1, 0], [0, 0], [4, 4], [9, 9], [12, 9]],
    minimum: 0,
    maximum: 9,
  };
}

function implement(spec, attempt) {
  const version = 'candidate-' + attempt;
  const cap = value => Math.min(spec.maximum, value);
  return {
    version,
    apply: attempt === 1 ? cap : value => Math.max(spec.minimum, cap(value)),
  };
}

function reviewArtifact(spec, artifact) {
  return {
    version: artifact.version,
    approved: artifact.apply(spec.minimum - 2) === spec.minimum
      && artifact.apply(spec.maximum + 2) === spec.maximum,
  };
}

function testArtifact(spec, artifact) {
  return {
    version: artifact.version,
    passed: spec.examples.every(([value, expected]) => artifact.apply(value) === expected),
    count: spec.examples.length,
  };
}

function supervise(test = testArtifact) {
  const spec = defineRequirements();
  const history = [];
  for (let attempt = 1; attempt <= 2; attempt++) {
    const artifact = implement(spec, attempt);
    const review = reviewArtifact(spec, artifact);
    const report = test(spec, artifact);
    const acceptable = review.approved && report.passed
      && review.version === artifact.version && report.version === artifact.version;
    history.push({ version: artifact.version, acceptable, testVersion: report.version });
    if (acceptable) return { status: 'complete', history };
  }
  return { status: 'blocked', history };
}

const result = supervise();
assert.equal(result.status, 'complete');
assert.deepEqual(result.history.map(step => step.acceptable), [false, true]);
const stale = supervise((spec, artifact) => ({ ...testArtifact(spec, artifact), version: 'previous' }));
assert.equal(stale.status, 'blocked');
console.table(result.history);
console.table(stale.history);
