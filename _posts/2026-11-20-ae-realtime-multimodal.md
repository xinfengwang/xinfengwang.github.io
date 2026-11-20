---
layout: "post"
title: "多模态实时 Agent：语音打断、事件对齐与延迟预算"
description: "以语音问答结合图片说明解释回合、流式生成、打断和实际播放状态。"
date: "2026-11-20 18:00:00 +0800"
category: "Tech"
permalink: "/agent-engineering/frontier/realtime-multimodal/"
engineering_topic: "frontier"
engineering_series: "multimodal"
engineering_id: "realtime-multimodal"
engineering_publish: true
content_kind: "技术教程"
tags: ["Agent Engineering"]
chapter_questions: [{"question":"感知流和对话回合有什么区别？","answer":"音频或图像以帧或事件到达，对话回合表达一次交互阶段。系统要按时间或事件 ID 将不同模态关联。"},{"question":"用户打断后为什么要处理播放缓存？","answer":"模型生成的内容可能还在排队播放。要停止旧音频，保留实际已播范围，避免下一轮假设用户听完。"},{"question":"首个音频包延迟包含什么？","answer":"通常包含回合判定、网络、模型处理以及播放缓冲。跨系统事件应按一致口径测量。"},{"question":"图片和语音指代不一致时怎么办？","answer":"记录图像版本和说话时间。若对象不确定，询问指代或复述已识别对象，防止从错图得出结论。"},{"question":"工具动作怎样与实时会话分开？","answer":"流式回合可被取消。工具动作仍需授权、回执与独立的状态，语音停止不证明动作撤回。"}]
engineering_reading: {"prerequisites":[{"title":"多模态 RAG","url":"/agent-engineering/rag/multimodal-rag/"},{"title":"流式接口","url":"/agent-engineering/production/streaming-agent-api/"}],"next":[{"title":"记忆演进","url":"/agent-engineering/frontier/agent-adaptation/"}]}
---

## 为什么实时速度并非只由模型决定

用户给出一张设备手册截图并问「这个灯是什么意思」。系统把图像版本、音频回合和回答关联起来。语音采集、回合检测、模型、输出缓冲和播放共同影响交互。可用分阶段识别与合成，或直接语音交互。选型关注可观察性、时延、业务词汇准确率和可控的打断。

```mermaid
flowchart TB
  A["音频和图像事件"] --> B["关联时间与对话回合"]
  B --> C["生成并流式播放"]
  C --> D{"收到用户打断？"}
  D -->|打断| E["停止旧播放并保存进度"]
  E --> B
  D -->|正常结束| F["提交本轮已确认记录"]
```

## 一次打断需要维护哪几份状态

模型已生成两句音频，用户只听完第一句便说「我是指右边」。客户端清理未播内容，发送必要的取消或截断事件，并保存实际播放位置。下一轮用新指代和当前图像重新决定内容。外部动作的状态与播放分离，独立核对授权和回执。高影响操作要有明确的确认界面或语义。

## 能力与验收

已有实时模型与 API 支持语音流和多模态输入。不同产品的事件语义、支持模式和延迟需按版本实测。建立固定用例覆盖打断重叠、静音、网络抖动和图像替换，分别观测首音频延迟、截断后残留播放、指代准确和完成率。

## 小结

实时体验来自正确的事件关联与播放控制。以实际听到和实际执行的两个状态分别验收。

## 参考资料

- [OpenAI：Realtime API](https://developers.openai.com/api/docs/guides/realtime)
