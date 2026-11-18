import assert from "node:assert/strict";
import { documents, fixtureModel, runTask, sampleQuestion } from "./agent.mjs";

const appendix = {
  ...documents[0], id: "test-v2#appendix", topic: "background",
  text: "发版记录说明：发版后会归档。发版摘要用来查历史记录。发版记录补充团队背景。",
};
const index = [...documents, appendix];
const requiredTopics = ["smoke", "build"];
const bytesOf = hits => Buffer.byteLength(JSON.stringify({ hits }), "utf8");
const budget = process.argv[2] === undefined ? 360 : Number(process.argv[2]);
if (!Number.isSafeInteger(budget) || budget < bytesOf([])) {
  throw new Error("Pass a byte budget of at least " + bytesOf([]) + ".");
}

function instrumentedSearch({ onTrace, limit, budget, coverTopics }) {
  return (query, { env, groups }) => {
    const score = text => text.split(query).length - 1;
    const recalled = index
      .filter(doc => doc.env === env && doc.current && doc.groups.some(group => groups.includes(group)))
      .map(doc => ({ doc, score: score(doc.text) }))
      .filter(hit => hit.score > 0);
    const ranked = [...recalled].sort((a, b) => b.score - a.score || a.doc.id.localeCompare(b.doc.id))
      .slice(0, limit).map(hit => hit.doc);
    const priority = coverTopics
      ? requiredTopics.map(topic => ranked.find(doc => doc.topic === topic)).filter(Boolean)
      : [];
    const packingOrder = [...priority, ...ranked.filter(doc => !priority.includes(doc))];
    const packed = [];
    const excluded = [];
    for (const { id, version, topic, text } of packingOrder) {
      const hit = { id, version, topic, text };
      const nextBytes = bytesOf([...packed, hit]);
      if (nextBytes > budget) {
        excluded.push({ id, reason: "byte_budget", nextBytes });
      } else {
        packed.push(hit);
      }
    }
    onTrace({
      recalled: recalled.map(hit => hit.doc.id),
      ranked: ranked.map(doc => doc.id),
      packed: packed.map(hit => hit.id),
      excluded,
      outputBytes: bytesOf(packed),
      budget,
    });
    return packed;
  };
}

function firstMissingStage(id, event, selected) {
  if (!event.recalled.includes(id)) return "not_recalled";
  if (!event.ranked.includes(id)) return "ranked_out";
  if (!event.packed.includes(id)) return "budget_excluded";
  if (!selected.includes(id)) return "not_selected";
  return "delivered";
}

async function demo(name, options = {}) {
  const searchEvents = [];
  const submitted = [];
  const fixture = fixtureModel({ queries: [options.query ?? "发版"], chooseIds: hits => {
    const ids = hits.filter(hit => requiredTopics.includes(hit.topic)
      && (!options.omitSmoke || hit.topic !== "smoke")).map(hit => hit.id);
    submitted.push(...ids);
    return ids;
  } });
  const search = instrumentedSearch({
    limit: options.limit ?? 3, budget, coverTopics: options.coverTopics ?? false,
    onTrace: event => searchEvents.push(event),
  });
  const result = await runTask({ question: sampleQuestion, env: "test" }, { groups: ["dev"] }, {
    search, model: fixture,
  });
  const event = searchEvents[0];
  const returned = result.trace.find(span => span.stage === "search").sourceIds;
  assert.deepEqual(returned, event.packed);
  assert(event.outputBytes <= event.budget);
  assert(event.recalled.every(id => !id.startsWith("prod-") && !id.startsWith("test-v1")));
  return { name, status: result.status,
    smoke: firstMissingStage("test-v2#smoke", event, submitted), submitted, ...event };
}

const results = await Promise.all([
  demo("literal_miss", { query: "上线" }),
  demo("top_two", { limit: 2 }),
  demo("first_fit"),
  demo("model_omits_smoke", { coverTopics: true, omitSmoke: true }),
  demo("reserve_required_topics", { coverTopics: true }),
]);
if (budget === 360) {
  assert.deepEqual(results.map(row => row.smoke), [
    "not_recalled", "ranked_out", "budget_excluded", "not_selected", "delivered",
  ]);
  assert.deepEqual(results.map(row => row.status), [
    "needs_evidence", "needs_evidence", "needs_evidence", "needs_evidence", "ready_for_review",
  ]);
}
console.log(JSON.stringify(results, null, 2));
