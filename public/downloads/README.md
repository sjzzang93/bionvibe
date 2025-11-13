# TV 설치 스케줄러 APK 다운로드

## 📱 APK 파일 위치
이 디렉토리는 안드로이드 APK 파일을 호스팅하는 곳입니다.

**예상 파일명**: `tv-installer.apk`

## 🔨 APK 빌드 방법

### 1. Android Studio 프로젝트 생성
```bash
# Android Studio에서 새 프로젝트 생성
# Empty Activity 선택
# Package name: com.bionvibe.tvinstaller
```

### 2. WebView 설정

**MainActivity.kt**:
```kotlin
package com.bionvibe.tvinstaller

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebSettings
import android.webkit.JavascriptInterface
import androidx.appcompat.app.AppCompatActivity
import android.content.Context
import android.content.SharedPreferences

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        // WebView 설정
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            loadWithOverviewMode = true
            useWideViewPort = true
        }

        // JavaScript 인터페이스 추가
        sharedPreferences = getSharedPreferences("InstallationScheduler", Context.MODE_PRIVATE)
        webView.addJavascriptInterface(AndroidStorage(sharedPreferences), "AndroidStorage")

        // 앱 로드
        webView.loadUrl("https://bionvibe.com/apps/installation-scheduler")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}

// JavaScript 인터페이스 클래스
class AndroidStorage(private val prefs: SharedPreferences) {
    @JavascriptInterface
    fun saveSchedules(data: String) {
        prefs.edit().putString("schedules", data).apply()
    }

    @JavascriptInterface
    fun loadSchedules(): String? {
        return prefs.getString("schedules", null)
    }
}
```

### 3. AndroidManifest.xml 설정
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.bionvibe.tvinstaller">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_CALENDAR" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="TV 설치 스케줄러"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 4. APK 빌드
```bash
# Android Studio에서
# Build > Build Bundle(s) / APK(s) > Build APK(s)

# 또는 Gradle 명령어로
./gradlew assembleDebug  # 디버그 버전
./gradlew assembleRelease  # 릴리스 버전 (서명 필요)
```

### 5. APK 파일 복사
빌드된 APK 파일을 이 디렉토리에 `tv-installer.apk` 이름으로 복사하세요.

```bash
cp app/build/outputs/apk/debug/app-debug.apk ./public/downloads/tv-installer.apk
```

## 📋 주요 기능

### JavaScript 인터페이스
- **AndroidStorage.saveSchedules(data)**: localStorage 데이터를 SharedPreferences에 저장
- **AndroidStorage.loadSchedules()**: SharedPreferences에서 데이터 복구
- **AndroidCalendar.requestCalendarEvents()**: 캘린더 읽기 (구현 필요)
- **receiveIncomingCall(name, phone)**: 전화 수신 정보 전달 (구현 필요)

### 데이터 영구 저장
- SharedPreferences를 사용하여 재부팅 후에도 데이터 유지
- 앱 삭제 전까지 데이터 보존

## 🔐 권한 설명
- **INTERNET**: 웹페이지 로드
- **READ_CALENDAR**: 캘린더 일정 가져오기
- **READ_PHONE_STATE**: 전화 수신 감지
- **READ_CONTACTS**: 연락처 정보 읽기

## 📱 테스트
1. APK를 안드로이드 기기에 설치
2. "알 수 없는 출처" 허용 필요
3. 설치 후 앱 실행
4. 일정 추가 후 앱 종료
5. 기기 재부팅 후 앱 실행
6. 데이터가 유지되는지 확인

## 📝 참고 문서
자세한 구현 방법은 `/ANDROID_INTEGRATION.md` 파일을 참조하세요.
