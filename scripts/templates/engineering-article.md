---
layout: post
title: "用一个实际问题写出标题"
description: "读者会看到哪条执行轨迹与结果"
date: YYYY-MM-DD 12:00:00 +0800
category: Tech
engineering_topic: foundations
content_kind: 工程方法
tags: [Agent]
engineering_reading:
  prerequisites:
    - title: "前置知识的文章标题"
      url: /existing-prerequisite/
  next:
    - title: "下一篇文章的标题"
      url: /existing-next/
  related:
    - title: "相关专题的标题"
      url: /existing-related/
outline:
  - {id: problem, title: 背景与问题}
  - {id: concepts, title: 核心概念}
  - {id: principles, title: 底层原理}
  - {id: architecture, title: 系统架构}
  - {id: execution, title: 完整执行流程}
  - {id: implementation, title: 核心代码实现}
  - {id: tradeoffs, title: 技术方案对比}
  - {id: practice, title: 工程实践}
  - {id: next, title: 总结与延伸}
---

从一个真实可描述、可复现实验的执行失败开场。

## 背景与问题 {#problem}

写出输入、期望产物，以及之前为什么无法交付。

## 核心概念 {#concepts}

明确关键对象的职责、输入输出及它们的生命周期。

## 底层原理 {#principles}

解释关键机制，用可读的数据结构或状态规则表达。

## 系统架构 {#architecture}

放一张 Mermaid 架构图。说明每条关键边传了什么。

## 完整执行流程 {#execution}

列出成功轨迹和至少一个异常分支。

## 核心代码实现 {#implementation}

链接运行文件，写清运行命令、版本、预期结果与检查点。

## 技术方案对比 {#tradeoffs}

在同一任务和考核条件下比较方案。

## 工程实践 {#practice}

讲一个故障、定位证据、修复动作与重跑方式。

## 总结与延伸 {#next}

说明这篇为后续文章提供的一个明确前提。按需补参考资料。
