# 食材保鲜管家 Android Demo

一个面向作品集展示的冰箱食材管理 App demo。界面模拟 Android 手机应用：用户点击拍照识别后，页面使用固定 demo 数据生成食材清单、新鲜度评分、临期提醒和食材详情。

大模型识别、真实相机、图片上传和推送通知都不在本 demo 范围内；这里用本地图片和固定数据模拟完整体验。

## 功能

- 冰箱拍照识别模拟流程
- `全部 / 肉蛋奶 / 蔬果 / 饮品 / 冷冻` 分类筛选
- 食材卡片展示新鲜度、剩余天数、储存区域和状态
- 今天、明天、已过期、新鲜度低的提醒列表
- 食材详情底部面板
- C 语言逻辑文件展示底层数据结构、状态判断和提醒 bit flag

## 本地运行

直接用浏览器打开：

```text
index.html
```

或在当前目录启动一个静态服务器：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 验证

运行 JavaScript 逻辑测试：

```bash
node tests/logic.test.js
```

检查 C 文件语法：

```bash
clang -fsyntax-only food_freshness_logic.c
```

## UI 与 C 逻辑映射

| App 界面 | JavaScript demo | C 语言逻辑 |
| --- | --- | --- |
| 点击拍照识别 | `startScanSimulation()` | `simulateFridgePhotoRecognition()` |
| 食材数据 | `createRecognizedFoods()` | `FoodInventory` / `FoodItem` |
| 分类筛选 | `filterFoodsByCategory()` | `filterFoodByCategory()` |
| 新鲜度状态 | `evaluateFreshnessState()` | `evaluateFreshnessState()` |
| 临期提醒数量 | `countUrgentReminders()` | `countUrgentReminders()` |
| 今天/明天/过期提醒 | `getReminderFlags()` | `REMINDER_*` bit flags |

## 讲解重点

1. 页面是可直接演示的 Android 风格 App 原型。
2. 食材识别结果是固定 demo 数据，用于模拟大模型识别后的结构化输出。
3. JavaScript 负责浏览器交互和渲染，C 文件展示嵌入式或 Native 层可以如何组织同类逻辑。
4. 新鲜度状态由分数和剩余天数共同决定：新鲜、尽快食用、风险、已过期。
5. 过期提醒使用 bit flag 表达，多个提醒可以同时存在，例如已过期 + 新鲜度偏低。
