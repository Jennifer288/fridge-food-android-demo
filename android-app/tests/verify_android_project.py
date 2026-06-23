from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ANDROID = ROOT / "android-app"
APP = ANDROID / "app"
ASSET_DEMO = APP / "src/main/assets/fridge-food-android-demo"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def assert_exists(path: Path) -> None:
    assert path.exists(), f"Missing required file: {path.relative_to(ROOT)}"


def main() -> None:
    required_files = [
        ANDROID / "settings.gradle",
        ANDROID / "build.gradle",
        ANDROID / "gradle.properties",
        ANDROID / "gradlew",
        ANDROID / "gradlew.bat",
        ANDROID / "gradle/wrapper/gradle-wrapper.properties",
        ANDROID / "gradle/wrapper/gradle-wrapper.jar",
        APP / "build.gradle",
        APP / "src/main/AndroidManifest.xml",
        APP / "src/main/java/com/jennifer/fridgefood/MainActivity.java",
        APP / "src/main/res/values/strings.xml",
        ASSET_DEMO / "index.html",
        ASSET_DEMO / "style.css",
        ASSET_DEMO / "script.js",
        ASSET_DEMO / "assets/fridge-demo.png",
        ROOT / ".github/workflows/build-android-apk.yml",
        ROOT / "README.md",
    ]
    for path in required_files:
        assert_exists(path)

    app_build = read(APP / "build.gradle")
    assert 'namespace "com.jennifer.fridgefood"' in app_build
    assert "applicationId \"com.jennifer.fridgefood\"" in app_build
    assert "minSdk 23" in app_build

    manifest = read(APP / "src/main/AndroidManifest.xml")
    assert 'android:label="@string/app_name"' in manifest
    assert "android.permission.CAMERA" not in manifest
    assert "android.permission.INTERNET" not in manifest

    activity = read(APP / "src/main/java/com/jennifer/fridgefood/MainActivity.java")
    assert "new WebView(this)" in activity
    assert "setJavaScriptEnabled(true)" in activity
    assert "file:///android_asset/fridge-food-android-demo/index.html" in activity

    strings = read(APP / "src/main/res/values/strings.xml")
    assert "食材保鲜管家" in strings

    workflow = read(ROOT / ".github/workflows/build-android-apk.yml")
    assert "Build Android APK" in workflow
    assert "./gradlew assembleDebug" in workflow
    assert "app/build/outputs/apk/debug/app-debug.apk" in workflow

    readme = read(ROOT / "README.md")
    assert "https://jennifer288.github.io/fridge-food-android-demo/" in readme
    assert "android-app/app/build/outputs/apk/debug/app-debug.apk" in readme
    assert "Android WebView" in readme

    print("android project structure verified")


if __name__ == "__main__":
    main()
