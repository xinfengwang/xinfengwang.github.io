---
layout: "post"
title: "Browser Agent 与 Computer Use：从观察界面到核查结果"
description: "比较 DOM、可访问性与视觉定位，并以已授权的只读目录核查说明验证边界。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/browser-and-computer-use/"
engineering_topic: "frontier"
engineering_series: "ui"
engineering_id: "browser-and-computer-use"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"什么时候优先使用直接 API？","answer":"应用存在经过授权且结果明确的接口时，API 通常更稳定，也更容易校验身份、状态和结果。"},{"question":"可访问性树与截图各保留什么？","answer":"语义树提供角色、名称与状态。截图提供几何位置和视觉线索，但通常缺少稳定对象标识。"},{"question":"界面变化后应如何执行？","answer":"重新读取当前状态，再依据需求定位。若焦点、账号或资源不明确，则暂停或回到可核对的起点。"},{"question":"动作成功是否能从点击返回判断？","answer":"点击只是工具动作。业务完成要通过页面刷新后的稳定状态或服务回执核对。"},{"question":"如何测试界面 Agent？","answer":"在受控页面验证响应式布局、延迟加载、重复对象、会话失效和预期结果，记录实际观察与复核。"}]
engineering_reading: {"prerequisites":[{"title":"环境交互","url":"/agent-engineering/capabilities/environment-interaction/"}],"next":[{"title":"长时运行 Agent","url":"/agent-engineering/frontier/long-running-agents/"}]}
---

## 浏览和操作桌面有不同的观测条件

在已授权的资料目录上核对两份政策的发布日期。浏览器可用 DOM 或可访问性树定位表格与链接，并读取语义。对于只返回画面的界面，模型从截图预测位置，再由工具操作。语义定位更适合有角色、标签和稳定状态的页面。视觉定位适合图形化控件，却更依赖分辨率、缩放和当前焦点。

```mermaid
flowchart TB
  A["读取界面及当前身份"] --> B["识别目标和可用控件"]
  B --> C["执行许可范围内的动作"]
  C --> D["重新观察并核对结果"]
  D --> E["保存证据或报告缺口"]
```

## 怎样让动作和观察一致

打开目录后发现有两个同名链接。用表格列标题、版本和日期区分，若视觉上不可区分则先读取周边证据或请用户澄清。点击后要检查目标页面版本，而非仅引用目录名。遇到身份或页面来源变化，先确认当前环境。外部内容只作为待核对信息。向外传输或执行写操作需要单独的应用流程和授权。

## 能力已可用，可靠性要按界面验证

浏览工具和视觉操作已有可用接口。业务可靠性仍受页面更新、登录失效、异步加载和环境隔离影响。使用同一任务对照结构化接口、浏览器语义与视觉操作的成功率、误点率、耗时和可解释程度。把只读查看与有副作用动作作为不同验收层。

## 小结

根据可观察信息选择接口。使用可验证定位、执行后的重新观察，以及独立的业务状态确认。

## 参考资料

- [Playwright：Locators](https://playwright.dev/docs/locators)
- [OpenAI：Computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use)
