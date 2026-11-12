---
layout: post
title: "雨夜便利店 SoraMart：从三维场景到可玩的交互原型"
subtitle: "一个 Vibe Coding / 创意编程方向的体验案例：让观察、行走、选购与模拟结账形成完整闭环。"
date: 2026-11-12 15:00:00 +0800
series: "三维交互与创意编程"
category: Projects
tags: [Vibe-Coding, Creative-Coding, Three.js, WebGL, Game-Prototype]
content_kind: 项目拆解
project_id: soramart
---

雨夜街角、亮着暖灯的便利店、路过的撑伞行人，是 SoraMart 的第一层体验。进店之后，角色可以沿通道行走，在货架前查看商品，把便当放进购物篮，再去收银台完成模拟结账。

这个作品补充了我在三维场景、视觉氛围和交互设计上的探索。适合把它作为 **Vibe Coding / 创意编程方向的小游戏原型**来阅读：重点是一个想法怎样落成可体验的作品。本篇根据公开版本拆解功能与代码结构；仓库未提供完整的人机协作记录，因此不对开发轮次、耗时或 AI 代码占比作推断。

[在线场景](https://ame-mart-rain-corner.sunnybrioche.chatgpt.site/) · [公开仓库](https://github.com/telawang91-dotcom/soramart-rainy-night) · [72 秒展示视频](https://github.com/telawang91-dotcom/soramart-rainy-night/blob/main/media/SoraMart-showcase.mp4)

![雨夜便利店的街角全景](https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/street-corner.jpg)

## 让场景里发生一件完整的事

这段体验的主线很短：

```text
旋转观察街角 → 点击进店 → 走到货架 → 查看并选购商品 → 收银台模拟付款 → 离店
```

街景负责吸引人停留，购物流程给人继续探索的理由。玩家既能点击地面移动，也能直接点击商品或货区，让角色走到对应位置后打开选购界面。

目前它更接近轻量的探索与购物模拟原型。公开版本围绕一次逛店展开，尚未呈现任务成长、经营经济或存档系统。作品展示可以突出完成度明确的这一小段体验。

## 三维画面与交互分别由哪些部分负责

公开版本使用 Three.js 0.147.0 与 OrbitControls，入口按顺序加载人物、场景、商品、行走和购物脚本。按文件拆开看，可以找到几组清晰的职责：

| 文件 | 主要职责 |
| --- | --- |
| `dist/scene.js` | 街角与店铺场景 |
| `dist/people.js` | 人物模型与行走姿态 |
| `dist/products.js` | 商品包装模型 |
| `dist/walk.js` | 可行走区域、路径搜索、角色移动与跟随视角 |
| `dist/shop.js` | 商品目录、选购界面、购物篮、结账与进出店切换 |

这是一套静态网页交付结构，仓库包含脚本和素材。理解它时，可以沿着“用户点击 → 角色移动 → 到达回调 → 界面变化”这条链路读代码。

## 点击之后，先走过去，再打开商品

`walk.js` 将货架与柜台的占地范围表示为障碍矩形，在网格上寻找可行走节点，并用队列进行八邻域广度优先搜索。斜向移动还会检查相邻的横向与纵向节点，避免从障碍物夹角穿过。

搜索后，代码通过直线可通行检查合并路径点，让角色尽量沿连续路径行走。这里实现的是网格 BFS 与路径简化；八邻域边没有按斜向距离加权，因此不能把结果直接表述为几何最短路径。

购物脚本把“查看商品”放进到达回调：点击商品后，先选择货架附近的站立位置，角色抵达并面向商品，才打开详情。这样的时序让角色行动与界面反馈对应起来。

![在货架前查看商品包装与人民币价格](https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/choose-products.jpg)

## 购物篮需要明确的状态与结算规则

`shop.js` 的 `shop` 对象保存店内外状态、当前货区、购物篮、选中商品、界面视图和小票。`view` 会在行走、浏览、商品详情、购物篮、结账与小票等视图间切换。

两个实现细节让这一流程更容易核对：

- 商品价格使用整数分保存，显示时再转成人民币金额；合计由单价与数量计算。
- `checkout()` 只在收银台、结账视图和非空购物篮三个条件同时满足时执行，生成小票后清空购物篮。

角色到达、购物状态与付款按钮的条件共同组成交互约束。这里的付款是前端模拟，商品与小票用于场景体验。

![收银台结账与购物小票](https://raw.githubusercontent.com/telawang91-dotcom/soramart-rainy-night/main/media/checkout.jpg)

## 把它用于 Vibe Coding 实践时，可以怎样验收

如果继续沿这个作品迭代，可以把自然语言需求收敛成几组可观察行为。下面是后续开发可采用的验收清单，并非对已有测试结果的描述。

| 关注点 | 具体观察 |
| --- | --- |
| 场景可读性 | 初次进入能否找到进店入口、商品与收银台 |
| 行走 | 点击货架附近时是否绕开障碍；连续点击后是否到达最新目标 |
| 商品预览 | 商品名称、包装、价格是否对应；拖动预览是否顺畅 |
| 购物状态 | 加入、放回和调整数量后，件数与合计是否一致 |
| 结账边界 | 空篮不能付款；重复点击付款不会重复生成同一笔消费 |
| 多端体验 | 窄屏按钮是否可操作；拖拽观察与点击行走是否容易区分 |

这些检查也能承接 [Coding Workflow]({{ '/2026/09/15/coding-workflow/' | relative_url }}) 中的工作方式：每次只推进一段体验，留下可复查的行为和画面，再进入下一轮修改。

## 运行与素材说明

下载仓库并安装 Python 后，在仓库根目录运行：

```sh
python -m http.server 8000 --directory dist
```

浏览器打开 `http://localhost:8000/`。在线场景的访问范围由托管端控制，本地运行方式见 [README](https://github.com/telawang91-dotcom/soramart-rainy-night/blob/main/README.md)。

README 说明食品包装展示贴图由 AI 生成，部分鲜食参考价来自公开商品页；展示图片截自实际场景录制，视频使用自动操作录制。Three.js 第三方许可随仓库提供。

本文的代码依据为公开的 [行走模块](https://github.com/telawang91-dotcom/soramart-rainy-night/blob/main/dist/walk.js)、[购物模块](https://github.com/telawang91-dotcom/soramart-rainy-night/blob/main/dist/shop.js) 与 [网页入口](https://github.com/telawang91-dotcom/soramart-rainy-night/blob/main/dist/index.html)。更多项目见 [Projects]({{ '/projects/#soramart' | relative_url }})。
