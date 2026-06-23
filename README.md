# 食材保鲜管家

这是一个冰箱食材管理作品集 Demo，包含两个交付形态：

- Web Demo：可直接通过 GitHub Pages 打开。
- Android App：真正的 Android WebView 外壳，可构建 debug APK 安装到手机。

在线网页 Demo：

[https://jennifer288.github.io/fridge-food-android-demo/](https://jennifer288.github.io/fridge-food-android-demo/)

## 功能概览

- 冰箱拍照识别模拟流程
- `全部 / 肉蛋奶 / 蔬果 / 饮品 / 冷冻` 分类筛选
- 食材新鲜度、剩余天数、储存区域和状态展示
- 今天、明天、已过期、新鲜度低的提醒列表
- 食材详情底部面板
- `food_freshness_logic.c` 展示嵌入式/底层 C 逻辑组织方式

## Web Demo

网页源码位于：

```text
fridge-food-android-demo/
```

本地打开：

```bash
cd fridge-food-android-demo
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## Android WebView App

Android 工程位于：

```text
android-app/
```

App 信息：

- App 名称：`食材保鲜管家`
- Package name：`com.jennifer.fridgefood`
- minSdk：`23`
- 实现方式：Android WebView
- 本地入口：`file:///android_asset/fridge-food-android-demo/index.html`
- 不申请相机权限；“拍照识别”仍使用 demo 模拟数据
- 不依赖网络即可打开 App 主界面

WebView 加载的离线资源位于：

```text
android-app/app/src/main/assets/fridge-food-android-demo/
```

## 构建 APK

### 使用 Android Studio

1. 打开 Android Studio。
2. 选择 `Open`。
3. 打开本仓库中的 `android-app/` 目录。
4. 等待 Gradle Sync 完成。
5. 选择 `Build > Build Bundle(s) / APK(s) > Build APK(s)`。
6. 构建完成后，APK 位于：

```text
android-app/app/build/outputs/apk/debug/app-debug.apk
```

### 使用命令行

需要本机安装 Android SDK，并设置 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT`。

```bash
cd android-app
./gradlew assembleDebug
```

生成的 APK 路径：

```text
android-app/app/build/outputs/apk/debug/app-debug.apk
```

## GitHub Actions 下载 APK

仓库包含 workflow：

```text
.github/workflows/build-android-apk.yml
```

每次 push 到 `main` 后会自动运行 `Build Android APK`，构建 debug APK 并上传 artifact。

下载方式：

1. 打开仓库的 `Actions` 页面。
2. 选择最新的 `Build Android APK` run。
3. 在页面底部 `Artifacts` 区域下载：

```text
fridge-food-android-debug-apk
```

解压后可得到：

```text
app-debug.apk
```

## 安装到 Android 手机

### 方法一：手机直接安装

1. 从 GitHub Actions 下载 `fridge-food-android-debug-apk`。
2. 解压得到 `app-debug.apk`。
3. 把 APK 传到 Android 手机。
4. 在手机上打开 APK。
5. 如果系统提示，允许“安装未知来源应用”。
6. 安装完成后打开 `食材保鲜管家`。

### 方法二：ADB 安装

手机开启 USB 调试后运行：

```bash
adb install -r android-app/app/build/outputs/apk/debug/app-debug.apk
```

## C 逻辑说明

核心 C 展示文件：

```text
fridge-food-android-demo/food_freshness_logic.c
```

Android App 当前不编译这个 C 文件；它作为嵌入式/Native 层逻辑展示，用 `enum`、`struct`、bit flag 和纯函数表达食材识别结果、新鲜度状态、临期提醒和分类筛选。

## 验证

网页逻辑测试：

```bash
node fridge-food-android-demo/tests/logic.test.js
```

C 语法检查：

```bash
clang -fsyntax-only fridge-food-android-demo/food_freshness_logic.c
```

Android 项目结构检查：

```bash
python3 android-app/tests/verify_android_project.py
```

Android APK 构建：

```bash
cd android-app
./gradlew assembleDebug
```
