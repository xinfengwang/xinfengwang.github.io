---
layout: "post"
title: "具身智能与 Physical AI：感知、决策和控制怎样闭环"
description: "以模拟桌面整理任务区分高层任务模型、连续控制、反馈与仿真迁移。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/physical-agents/"
engineering_topic: "frontier"
engineering_series: "physical-ai"
engineering_id: "physical-agents"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"为什么目标识别正确仍可能任务失败？","answer":"位置、物体状态、传感误差和控制精度影响实际动作。需要通过闭环反馈确认环境变化。"},{"question":"高层计划与低层控制的时间尺度为什么不同？","answer":"高层描述子目标与顺序。低层需要按更快的频率读取状态和控制动作，交由具有对应时序约束的控制器。"},{"question":"为什么仿真通过不证明真实环境通过？","answer":"摩擦、光照、材质、传感器延迟和输入分布会变化。迁移需在相应受控环境验证。"},{"question":"能用语言模型输出当安全控制吗？","answer":"高层模型可以提出目标。动作许可、停机及物理状态边界应由独立的受控系统落实。"},{"question":"评估包含哪些结果？","answer":"记录成功、误识别、接管、异常停止、恢复与环境条件。只展示一次成功不支持可泛化结论。"}]
engineering_reading: {"prerequisites":[{"title":"环境交互","url":"/agent-engineering/capabilities/environment-interaction/"}],"next":[{"title":"Agent 运行时演进","url":"/agent-engineering/frontier/agent-runtime-evolution/"}]}
---

## 从观察到实际动作跨了多层

在一个模拟环境中，把标记为蓝色的盒子移动到空置货位。视觉感知估计物体和货位状态。高层任务模型选择目标与顺序。控制器根据局部状态执行短时动作并返回反馈。系统核对盒子是否实际到位。语言计划和感知均有不确定性，任何影响物理安全的约束应由相应的验证与控制组件实施。

```mermaid
flowchart TB
  A["传感器和模拟环境"] --> B["估计对象与状态"]
  B --> C["选择允许的任务子目标"]
  C --> D["受约束的控制器执行"]
  D --> E["反馈、校验和停止"]
  E --> B
```

## 仿真与真实环境之间有什么差异

仿真适合用可重复条件记录行为，例如挡住部分标记、改变位置、让货位不再可用。真实环境还会出现光照、时间同步与执行误差。验证应按任务和条件报告，模拟结果与真实结果分别记录。物理部署需要受控区域、相应安全系统与专业评估，不从模型演示跳过校验。

## 前沿证据怎样阅读

视觉语言动作模型的研究展示了部分语义任务迁移能力。训练场景、动作空间、机器人形态和任务定义限制证据范围。比较方法时检查固定基准、实际验证条件、异常与人类接管信息。家中开放环境与受控台面的成功率不能直接互换。

## 小结

具身系统把感知、任务决策、连续控制和反馈连接起来。仿真用于可重复研究，真实场景需要单独验证。

## 参考资料

- [OpenVLA：An Open-Source Vision-Language-Action Model](https://openvla.github.io/)
- [Google DeepMind：RT-2](https://deepmind.google/discover/blog/rt-2-new-model-translates-vision-and-language-into-action/)
