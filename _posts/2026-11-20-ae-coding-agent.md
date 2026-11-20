---
layout: "post"
title: "Coding Agent：从仓库理解到候选补丁与独立验证"
description: "用维护类改动解释状态、工具边界、反馈循环和软件工程基准。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/coding-agent/"
engineering_topic: "frontier"
engineering_series: "research-coding"
engineering_id: "coding-agent"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"Coding Agent 的输入除了问题还有什么？","answer":"仓库基线、项目约定、允许改动范围、依赖环境、验证条件与用户可见目标。"},{"question":"为什么理解阶段需要阅读实际文件？","answer":"文件和行为证据可确认入口、状态流和调用者，降低按习惯编写无关补丁的风险。"},{"question":"现有测试通过能否证明目标实现？","answer":"现有测试覆盖的行为有限。要核对变更目标、正常入口、关键边界及真实 diff。"},{"question":"如何减少上下文缩减后的重复试错？","answer":"持久化目标、未解决问题、已确认文件、具体检查结果和差异范围。恢复时从事实记录与代码状态对照。"},{"question":"SWE-bench 对企业项目提供什么信息？","answer":"它提供已定义的仓库任务评测框架。不同仓库、权限、验证和部署环境仍需独立测量。"}]
engineering_reading: {"prerequisites":[{"title":"开发 Agent 团队","url":"/agent-engineering/cases/development-agent-team/"}],"next":[{"title":"Browser Agent 与 Computer Use","url":"/agent-engineering/frontier/browser-and-computer-use/"}]}
---

## 仓库里的事实需要独立核查

设维护任务为修复文章列表的空状态。Agent 先读取仓库规则，定位数据来源、模板与已有验证。接着修改最少必要文件，运行正常入口并检查 diff，最后形成带证据的候选补丁。构建完成、测试通过和实际发布使用不同验收记录。

```mermaid
flowchart TB
  A["任务与固定仓库基线"] --> B["读取调用者及约束"]
  B --> C["生成候选补丁"]
  C --> D["构建、交互与差异检查"]
  D -->|发现问题| C
  D -->|通过| E["交付变更与验证记录"]
```

## 工具、权限和审查的角色

阅读源码有助于建立理解，终端调用与编辑属于受约束操作。依赖安装、网络访问、仓库发布应各自按权限决定。审查者对照原始需求与实际修改，关注没触达正常入口、已有行为回归以及不必要的文件变动。长任务可将进度记录与代码制品一起保存。调用记录只选择有助复盘的信息。

## 看待当前证据

软件工程评测可用固定仓库任务、复现环境和自动验证比较候选系统。业务采用时补测项目特有任务、UI 或跨系统验收、错误恢复与给审查者节省的时间。评测名称、任务数据、依赖和结果条件应一起留存，便于理解指标的适用范围。

## 小结

编码能力只有落在真实项目入口、有限变更与独立验证上才具有交付价值。保留任务事实和可查补丁有助于跨运行恢复。

## 参考资料

- [SWE-bench：官方项目](https://www.swebench.com/)
- [Anthropic：Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
