import assert from "node:assert/strict";
import { documents, fixtureModel, makeSearch, runTask, sampleQuestion } from "./agent.mjs";

const currentTest = ["test-v2#smoke", "test-v2#build"];
const testScope = { env: "test", groups: ["dev"], expectedIds: currentTest, visibleIds: currentTest };
const cases = [
  { id: "test_release", slice: "happy", ...testScope, question: sampleQuestion,
    expected: "ready_for_review" },
  { id: "prod_release", slice: "happy", env: "prod", groups: ["ops"], question: "生产怎么发版",
    expected: "ready_for_review", visibleIds: ["prod-v4#approval", "prod-v4#build"],
    expectedIds: ["prod-v4#approval", "prod-v4#build"] },
  { id: "test_synonym", slice: "retrieval", ...testScope, question: "测试环境怎么上线",
    expected: "ready_for_review" },
  { id: "partial_checklist", slice: "validation", ...testScope, expectedIds: [],
    question: sampleQuestion, expected: "needs_evidence",
    model: { chooseIds: hits => [hits[0].id] } },
  { id: "invented_id", slice: "validation", ...testScope, expectedIds: [],
    question: sampleQuestion, expected: "invalid_draft",
    model: { chooseIds: () => ["test-v1#smoke"] } },
  { id: "prod_denied", slice: "scope", env: "prod", groups: ["dev"],
    question: "生产怎么发版", visibleIds: [], expected: "needs_evidence" },
  { id: "no_environment", slice: "scope", groups: ["dev"], question: "帮我发版",
    visibleIds: [], expected: "needs_environment", expectedRounds: 0 },
  { id: "conflicting_handbooks", slice: "retrieval", ...testScope, expectedIds: [],
    visibleIds: [...currentTest, "test-copy#smoke"], question: sampleQuestion,
    expected: "conflicting_evidence", index: [...documents, {
      ...documents[0], id: "test-copy#smoke", text: "测试环境在发版后才补做冒烟测试。",
    }] },
  { id: "repeat_tool", slice: "control", ...testScope, expectedIds: [],
    question: sampleQuestion, expected: "repeated_query",
    model: { queries: ["发版", "发版"] }, expectedRounds: 2 },
  { id: "search_down", slice: "control", ...testScope, expectedIds: [],
    question: sampleQuestion, visibleIds: [], expected: "search_unavailable", unavailable: true },
];

async function evaluate(config) {
  const rows = [];
  for (const test of cases) {
    const {
      id, slice, env, groups, question, expected, model, index, visibleIds,
      expectedIds = [], expectedRounds, unavailable,
    } = test;
    const search = unavailable
      ? () => { throw new Error("fixture read error"); }
      : makeSearch(index, config.aliases);
    const output = await runTask({ question, env }, { groups }, {
      model: fixtureModel(model), search,
    });
    const searches = output.trace.filter(event => event.stage === "search");
    const evidence = [...new Set(searches.flatMap(event => event.sourceIds ?? []))];
    const rounds = output.trace.filter(event => event.stage === "model").length;
    const citations = (output.steps ?? []).map(step => step.id);
    const unexpectedEvidence = evidence.filter(id => !visibleIds.includes(id));
    const expectedCitationOrder = JSON.stringify(citations) === JSON.stringify(expectedIds);
    const pass = output.status === expected && expectedCitationOrder && !unexpectedEvidence.length
      && (expectedRounds === undefined || rounds === expectedRounds);
    rows.push({
      id, slice, pass, expected, actual: output.status, evidence, citations,
      unexpectedEvidence, rounds,
    });
  }
  return rows;
}

const baseline = await evaluate({ aliases: {} });
const candidate = await evaluate({ aliases: { "上线": "发版" } });
const changes = candidate.flatMap((row, index) => {
  const previous = baseline[index];
  if (row.pass === previous.pass) return [];
  return [{ id: row.id, pass: row.pass, expected: row.expected,
    before: { status: previous.actual, evidence: previous.evidence },
    after: { status: row.actual, evidence: row.evidence } }];
});
const improved = changes.filter(row => row.pass);
const regressed = changes.filter(row => !row.pass);
const blocked = candidate.filter(row => !row.pass);
console.log(JSON.stringify({
  baseline: baseline.filter(row => row.pass).length + "/" + cases.length,
  candidate: candidate.filter(row => row.pass).length + "/" + cases.length,
  improved, regressed, blocked,
}, null, 2));
assert.equal(regressed.length, 0, "Existing cases must not regress.");
assert.equal(blocked.length, 0, "Candidate did not meet the fixture gate.");
