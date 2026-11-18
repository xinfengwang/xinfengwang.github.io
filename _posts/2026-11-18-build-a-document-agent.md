---
layout: post
title: "从零写一个文档 Agent：工具、状态和验收"
subtitle: "用一份测试环境发版清单，把检索、工具参数校验、引用检查和第一组回归用例跑通。"
date: 2026-11-18 20:00:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "09"
category: Tech
tags: [Agent, Tool-Use, RAG, Workflow, Evaluation]
content_kind: 工程方法
audience: "写过 JavaScript、想自己实现第一条 Agent 工作流的读者。"
prerequisite: "能用 Node.js 运行 JavaScript，了解函数和对象。"
description: "一个可在本地运行的文档 Agent 教学例子，包含只读检索、访问范围、状态流转、引用校验和回归断言。"
exercise: "添加一份内容更接近问题但版本过期的文档，验证清单仍引用正确版本。"
---

“测试环境怎么发版？给我列一份检查清单。”这句话很适合拿来写第一个 Agent。输入有一点模糊，输出却容易检查。可以拿着清单逐条核对：引用的是测试环境手册吗？手册里有这一步吗？文档找不到的时候，程序会怎么做？

第一版给用户一份草稿，只读文档。实现分三步：程序确认环境和权限，模型参与检索或整理，程序检查输出。下面先用两个普通函数模拟模型答复，可以离线调试完整流程。改用真实模型时，工具边界和测试可以直接复用。

## 开工前，先列出什么算做完

| 输入 | 预期结果 |
| --- | --- |
| 已确认测试环境，用户有权限 | 返回带文档版本和出处的步骤 |
| 用户只说“帮我发版” | 先问是哪个环境 |
| 用户没有文档访问权限 | 返回缺少可用资料，无草稿 |
| 检索结果里只有旧版手册 | 返回缺少可用资料，无草稿 |
| 草稿引用了本轮未召回的段落 | 校验失败，交付停止 |

这个版本把环境当作已经确认的任务字段。实际界面可以让用户选择环境，或者由模型从问题中抽取后请用户确认。用户身份和组权限由应用从会话里取得。

## 把工具、状态和验收接起来

把下面的代码存为 `agent.mjs`，用 `node agent.mjs` 运行。示例数据有一份当前测试手册、一份旧手册和一份生产手册。每个片段包含一个来源 ID、环境、版本和所属访问组。

```javascript
import assert from "node:assert/strict";

const docs = [
  { id: "test-v2#checks", env: "test", version: "v2", group: "dev",
    current: true, text: "发版前运行冒烟测试。" },
  { id: "test-v2#record", env: "test", version: "v2", group: "dev",
    current: true, text: "发版后记录构建编号。" },
  { id: "test-v1#checks", env: "test", version: "v1", group: "dev",
    current: false, text: "发版后再运行冒烟测试。" },
  { id: "prod-v4#checks", env: "prod", version: "v4", group: "ops",
    current: true, text: "发版前由值班经理确认。" },
];

function searchDocs(query, env, groups) {
  return docs.filter(doc =>
    doc.current && doc.env === env && groups.includes(doc.group)
    && doc.text.includes(query)
  );
}

// 本地测试用的模型替身。工具调用和草稿分开返回。
const localModel = {
  chooseTool: ({ env }) => ({ name: "search_docs", query: "发版", env }),
  draft: ({ sources }) => sources.map(doc => ({
    sourceId: doc.id,
    step: doc.text,
  })),
};

function runTask({ question, env }, groups, model = localModel) {
  const trace = [];
  function finish(status, details = {}) {
    return { status, trace, ...details };
  }

  if (env !== "test" && env !== "prod") {
    return finish("needs_environment", { message: "要查哪个环境？" });
  }

  const call = model.chooseTool({ question, env });
  if (call?.name !== "search_docs" || call.env !== env
      || typeof call.query !== "string"
      || !call.query.trim() || call.query.length > 60) {
    return finish("invalid_tool_call");
  }

  const matches = searchDocs(call.query.trim(), env, groups);
  const sources = matches.map(({ id, version, text }) => ({ id, version, text }));
  trace.push({ stage: "search", sourceIds: sources.map(doc => doc.id) });
  if (!sources.length) {
    return finish("needs_evidence", { message: "没有找到可用的当前版本文档。" });
  }

  const steps = model.draft({ question, env, sources });
  const byId = new Map(sources.map(doc => [doc.id, doc]));
  const valid = Array.isArray(steps) && steps.length > 0 && steps.every(step => {
    const source = byId.get(step?.sourceId);
    return source && step.step === source.text;
  });
  trace.push({ stage: "validate", passed: valid });
  if (!valid) return finish("invalid_draft");

  return finish("ready_for_review", {
    env,
    steps: steps.map(({ sourceId, step }) => ({
      sourceId, version: byId.get(sourceId).version, step,
    })),
  });
}

const question = "测试环境怎么发版？给我列一份检查清单。";
const task = { question, env: "test" };
const result = runTask(task, ["dev"]);
assert.equal(result.status, "ready_for_review");
assert.deepEqual(result.steps.map(step => step.sourceId),
  ["test-v2#checks", "test-v2#record"]);
assert.equal(runTask({ question: "帮我发版" }, ["dev"]).status,
  "needs_environment");
assert.equal(runTask(task, ["guest"]).status, "needs_evidence");
assert.equal(runTask(task, ["dev"], {
  ...localModel,
  chooseTool: () => ({ name: "search_docs", query: "再运行", env: "test" }),
}).status, "needs_evidence");
assert.equal(runTask(task, ["dev"], {
  ...localModel,
  chooseTool: () => ({ name: "search_docs", query: "发版", env: "prod" }),
}).status, "invalid_tool_call");
assert.equal(runTask(task, ["dev"], {
  ...localModel,
  draft: () => [{ sourceId: "test-v1#checks", step: "发版后再运行冒烟测试。" }],
}).status, "invalid_draft");
assert.equal(runTask(task, ["dev"], {
  ...localModel,
  draft: () => [{ sourceId: "test-v2#checks", step: "可以跳过冒烟测试。" }],
}).status, "invalid_draft");
console.log(JSON.stringify(result, null, 2));
```

最后一行打印任务结果。找到资料时，`trace` 先出现 `search`，里面有这次实际命中的文档，再出现 `validate`。缺少环境时，程序在模型调用前就返回。调用越权或校验失败时，结果里也没有草稿。拿这几个状态接 UI，用户能看到是需要补充信息、缺少资料，还是草稿没有通过检查。

示例为了让断言清楚，要求每个步骤逐字对应一个证据片段。真实清单常常要合并多段材料或重写成行动项。可以改成每条带多个来源，程序检查引用范围，另做抽样评审确认改写后的意思仍然成立。还要检查关键步骤是否漏掉，因为单条引用正确也不能证明整份清单完整。

## 接上真正的模型以后，先看两份输入

第一次模型调用只需要用户问题、确认过的环境和可用工具定义。打开你所用模型的工具调用接口，把工具请求解析成示例里的 `name`、`query`、`env`。模型缺少工具调用、参数格式错了或选了别的环境，就按错误路径处理。第二次调用再把本轮检索片段交给模型，让它返回 `sourceId` 和步骤文本。两个调用都设置独立超时和任务总预算。接异步 SDK 时，把模型适配器和 `runTask` 改为异步，并添加对应的失败处理。

如果结果不好，先看具体卡在哪次调用。第一次搜“上线”找不到包含“发版”的文档，可以给查询增加同义词或尝试混合检索。第二次已经看到正确文档，但仍把“发版前”写成“发版后”，就该查上下文格式、草稿生成规则和验收。两种情况的用户反馈可能都是“答案不对”，修的地方完全不同。

更多细节见 [Function Calling](/2026/09/15/function-calling/) 和 [RAG 检索失败排查](/2026/09/15/rag-badcase-debugging/)。

## 加一个步骤，再补一条失败路径

试着在样例数据里加入一份过期手册，让它比当前版包含更多与问题相同的词。检查它依然不会进入检索结果。然后让搜索函数模拟两种异常：一次超时后恢复，以及持续不可用。给读取操作加总时限和有限重试，检查持续不可用时会返回单独的状态，方便 UI 提示用户稍后再试。

以后要让 Agent 保存草稿，给任务加一个待确认状态，让用户知道将保存的内容和位置。为同一逻辑写入保存操作编号，再模拟“保存成功但没有回执”。检查任务恢复时会先核对实际状态。能从这个故障继续往下做，才有理由把草稿保存交给别人试用。相关设计见 [工作流状态机](/2026/09/12/why-agent-workflow-needs-state-machine/) 和 [检查点与幂等](/2026/11/05/agent-checkpoint-idempotency/)。

## 哪些测试要带到上线前

先保留上面的断言，把模型或索引每次变化当成一次可比较的运行。再整理一组实际问法，覆盖口语、缺省环境、手册更新和不同用户组。每条留一份预期状态和允许引用的文档版本。只读试用时可以观察三件事：用户是不是拿到了可用清单、系统有多少次因为缺资料而停止、一次任务平均查几次文档。拿到稳定的基线以后，再决定该优化检索、模型调用还是流程分支。

[回到 Agent 开发指南](/agent-engineering/)继续看上线和维护步骤。想把这组手工用例扩成持续回归，可以接着读 [Agent Benchmark 怎么设计](/2026/09/15/agent-benchmark/)。
