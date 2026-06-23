# Android WebView APK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real Android WebView app that packages the existing offline food freshness demo into a debug APK.

**Architecture:** Keep the current static web demo and GitHub Pages publication intact. Add `android-app/` as a standalone Gradle Android project whose `MainActivity` loads `file:///android_asset/fridge-food-android-demo/index.html` in a WebView with JavaScript enabled. Add a GitHub Actions workflow that builds `android-app` and uploads the debug APK artifact.

**Tech Stack:** Java, Android Gradle Plugin, Gradle wrapper, Android WebView, GitHub Actions.

---

## File Structure

- Create `android-app/settings.gradle`: Gradle project name and `:app` include.
- Create `android-app/build.gradle`: Android Gradle plugin declaration.
- Create `android-app/gradle.properties`: AndroidX/no-transitive defaults and JVM args.
- Create `android-app/gradlew`, `android-app/gradlew.bat`, `android-app/gradle/wrapper/gradle-wrapper.properties`, `android-app/gradle/wrapper/gradle-wrapper.jar`: Gradle wrapper for reproducible builds.
- Create `android-app/app/build.gradle`: Android app module config with package `com.jennifer.fridgefood`, minSdk 23, Java 17 compatibility.
- Create `android-app/app/src/main/AndroidManifest.xml`: app label `食材保鲜管家`, no internet/camera permissions, main launcher activity.
- Create `android-app/app/src/main/java/com/jennifer/fridgefood/MainActivity.java`: WebView-only activity loading local asset URL.
- Create `android-app/app/src/main/res/values/strings.xml`: app name.
- Create `android-app/app/src/main/res/values/colors.xml`: app color tokens.
- Create `android-app/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml`: simple adaptive icon.
- Create `android-app/app/src/main/res/drawable/ic_launcher_foreground.xml` and `ic_launcher_background.xml`: icon drawables.
- Copy web demo files to `android-app/app/src/main/assets/fridge-food-android-demo/`.
- Create `.github/workflows/build-android-apk.yml`: build debug APK and upload artifact.
- Modify `fridge-food-android-demo/README.md`: preserve Pages link and add Android APK build/install instructions.

## Tasks

### Task 1: Android Project Skeleton

- [ ] Create Gradle settings, root build file, module build file, manifest, Java activity, and resources.
- [ ] Keep the app minimal: Java `MainActivity`, no AndroidX dependency, no network/camera permissions.
- [ ] Configure WebView JavaScript, DOM storage, file access, transparent error fallback, and hardware back button support.

### Task 2: Offline Web Assets

- [ ] Copy `index.html`, `style.css`, `script.js`, `.nojekyll`, `assets/fridge-demo.png`, `README.md`, `food_freshness_logic.c`, and `tests/logic.test.js` into `android-app/app/src/main/assets/fridge-food-android-demo/`.
- [ ] Ensure relative paths in `index.html` still work from Android assets.

### Task 3: Gradle Wrapper

- [ ] Add Gradle wrapper files so `./gradlew assembleDebug` works without system Gradle.
- [ ] Use a wrapper/AGP pairing that GitHub Actions can build with Java 17.

### Task 4: GitHub Actions APK Workflow

- [ ] Add `.github/workflows/build-android-apk.yml`.
- [ ] Trigger on push to `main` and manual dispatch.
- [ ] Set up JDK 17.
- [ ] Run `./gradlew assembleDebug` from `android-app`.
- [ ] Upload `android-app/app/build/outputs/apk/debug/app-debug.apk` as artifact `fridge-food-android-debug-apk`.

### Task 5: README

- [ ] Preserve the GitHub Pages web demo link.
- [ ] Add Android Studio build instructions.
- [ ] Add CLI build command and expected APK path.
- [ ] Add phone install steps.
- [ ] Explain that this is an Android WebView app and `food_freshness_logic.c` remains an embedded/native logic showcase.

### Task 6: Verification

- [ ] Run existing web logic test: `node fridge-food-android-demo/tests/logic.test.js`.
- [ ] Run C syntax check: `clang -fsyntax-only fridge-food-android-demo/food_freshness_logic.c`.
- [ ] Verify Android project file structure with `find android-app -maxdepth 5 -type f`.
- [ ] Attempt `cd android-app && ./gradlew assembleDebug`.
- [ ] If local build cannot run because Android SDK is missing, record the exact failure and confirm the project is still complete for Android Studio/GitHub Actions.
