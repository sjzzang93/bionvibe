# 안드로이드 전화 수신 연동 가이드

TV 설치 스케줄러 앱에서 안드로이드 전화 수신 기능을 연동하는 방법입니다.

## 기능 설명

전화가 걸려오면 발신자 정보(이름, 전화번호)를 웹앱으로 전달하여 자동으로 예약 폼에 입력할 수 있습니다.

## 안드로이드 연동 방법

### 방법 1: JavaScript 함수 직접 호출 (권장)

WebView에서 JavaScript를 활성화하고, 전화 수신 시 다음 함수를 호출하세요:

```kotlin
// Kotlin 예제
webView.evaluateJavascript(
    "window.receiveIncomingCall('${customerName}', '${phoneNumber}')",
    null
)
```

```java
// Java 예제
webView.evaluateJavascript(
    String.format("window.receiveIncomingCall('%s', '%s')", customerName, phoneNumber),
    null
);
```

### 방법 2: Custom Event 발송

```kotlin
// Kotlin 예제
val eventData = """
    {
        "name": "$customerName",
        "phone": "$phoneNumber"
    }
""".trimIndent()

webView.evaluateJavascript(
    """
    window.dispatchEvent(
        new CustomEvent('androidIncomingCall', {
            detail: $eventData
        })
    )
    """.trimIndent(),
    null
)
```

## 필요한 권한

AndroidManifest.xml에 다음 권한 추가:

```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />
<uses-permission android:name="android.permission.READ_CONTACTS" />
```

## BroadcastReceiver 구현 예제

```kotlin
class PhoneStateReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == TelephonyManager.ACTION_PHONE_STATE_CHANGED) {
            val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)

            if (state == TelephonyManager.EXTRA_STATE_RINGING) {
                val phoneNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER)

                // 연락처에서 이름 조회
                val contactName = getContactName(context, phoneNumber)

                // WebView로 전달
                (context as? MainActivity)?.sendToWebView(contactName, phoneNumber)
            }
        }
    }

    private fun getContactName(context: Context, phoneNumber: String?): String {
        phoneNumber ?: return ""

        val uri = Uri.withAppendedPath(
            ContactsContract.PhoneLookup.CONTENT_FILTER_URI,
            Uri.encode(phoneNumber)
        )

        val cursor = context.contentResolver.query(
            uri,
            arrayOf(ContactsContract.PhoneLookup.DISPLAY_NAME),
            null,
            null,
            null
        )

        var contactName = ""
        cursor?.use {
            if (it.moveToFirst()) {
                contactName = it.getString(0)
            }
        }

        return contactName
    }
}
```

## MainActivity 구현 예제

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            loadUrl("https://bionvibe.com/apps/installation-scheduler")
        }

        setContentView(webView)

        // BroadcastReceiver 등록
        val filter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
        registerReceiver(PhoneStateReceiver(), filter)
    }

    fun sendToWebView(name: String, phone: String) {
        runOnUiThread {
            webView.evaluateJavascript(
                "window.receiveIncomingCall('${name}', '${phone}')",
                null
            )
        }
    }
}
```

## 사용자 플로우

1. 고객이 전화를 걸면 안드로이드 앱이 전화 수신 감지
2. 발신자 정보(이름, 전화번호)를 연락처에서 조회
3. `window.receiveIncomingCall(name, phone)` 호출
4. 웹앱에 녹색 알림 카드 표시:
   - 고객명: [이름]
   - 연락처: [전화번호]
   - [✓ 정보 사용] / [✕ 무시] 버튼
5. 사용자가 "정보 사용" 클릭 시:
   - 고객명과 연락처 필드에 자동 입력
   - 나머지 정보(주소, TV 정보 등)만 입력하면 됨
6. "무시" 클릭 시:
   - 알림 닫힘
   - 수동으로 입력 가능

## 테스트 방법

WebView 개발자 도구에서 직접 테스트:

```javascript
// Chrome DevTools Console에서 실행
window.receiveIncomingCall('홍길동', '010-1234-5678')
```

## 주의사항

- Android 6.0 (API 23) 이상에서는 런타임 권한 요청 필요
- 전화번호 형식은 자유 (자동으로 처리됨)
- 이름이 없을 경우 빈 문자열 또는 null 전달 가능
- WebView의 JavaScript가 활성화되어 있어야 함

## 보안 고려사항

- HTTPS를 통해서만 앱 로드
- 신뢰할 수 있는 도메인만 허용
- 전화번호 등 민감한 정보는 로컬 스토리지에만 저장
- 서버 전송 시 암호화 필수

---

# 안드로이드 캘린더 연동 가이드 (읽기 전용)

TV 설치 스케줄러 앱에서 안드로이드 캘린더의 일정을 가져오는 기능입니다.

## ⚠️ 중요: 읽기 전용

- **안드로이드 캘린더의 내용은 절대 수정되지 않습니다**
- 캘린더 일정을 읽어와서 앱 내부에만 복사합니다
- 원본 캘린더는 그대로 유지됩니다

## 기능 설명

사용자가 캘린더 가져오기 버튼(📅)을 클릭하면 안드로이드 기본 캘린더의 일정을 불러와 TV 설치 스케줄러에 추가할 수 있습니다.

## 필요한 권한

AndroidManifest.xml에 다음 권한 추가:

```xml
<uses-permission android:name="android.permission.READ_CALENDAR" />
```

## Android Interface 구현

### 1. JavaScript Interface 클래스 생성

```kotlin
class CalendarBridge(private val activity: MainActivity) {

    @JavascriptInterface
    fun requestCalendarEvents() {
        activity.runOnUiThread {
            activity.sendCalendarEventsToWebView()
        }
    }
}
```

### 2. MainActivity에 인터페이스 추가

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true

            // Add JavaScript interface for calendar
            addJavascriptInterface(CalendarBridge(this@MainActivity), "AndroidCalendar")

            loadUrl("https://bionvibe.com/apps/installation-scheduler")
        }

        setContentView(webView)
    }

    fun sendCalendarEventsToWebView() {
        val events = getCalendarEvents()
        val eventsJson = convertToJson(events)

        webView.evaluateJavascript(
            "window.receiveCalendarEvents($eventsJson)",
            null
        )
    }
}
```

### 3. 캘린더 일정 읽기 구현

```kotlin
import android.Manifest
import android.content.pm.PackageManager
import android.provider.CalendarContract
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

fun MainActivity.getCalendarEvents(): List<CalendarEvent> {
    // Check permission
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_CALENDAR)
        != PackageManager.PERMISSION_GRANTED) {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.READ_CALENDAR),
            REQUEST_CALENDAR_PERMISSION
        )
        return emptyList()
    }

    val events = mutableListOf<CalendarEvent>()

    // Query calendar events from today onwards
    val startTime = Calendar.getInstance()
    startTime.set(Calendar.HOUR_OF_DAY, 0)
    startTime.set(Calendar.MINUTE, 0)

    val projection = arrayOf(
        CalendarContract.Events.TITLE,
        CalendarContract.Events.DESCRIPTION,
        CalendarContract.Events.EVENT_LOCATION,
        CalendarContract.Events.DTSTART,
        CalendarContract.Events.DTEND
    )

    val selection = "${CalendarContract.Events.DTSTART} >= ?"
    val selectionArgs = arrayOf(startTime.timeInMillis.toString())

    val cursor = contentResolver.query(
        CalendarContract.Events.CONTENT_URI,
        projection,
        selection,
        selectionArgs,
        "${CalendarContract.Events.DTSTART} ASC"
    )

    cursor?.use {
        val titleIndex = it.getColumnIndex(CalendarContract.Events.TITLE)
        val descIndex = it.getColumnIndex(CalendarContract.Events.DESCRIPTION)
        val locationIndex = it.getColumnIndex(CalendarContract.Events.EVENT_LOCATION)
        val startIndex = it.getColumnIndex(CalendarContract.Events.DTSTART)
        val endIndex = it.getColumnIndex(CalendarContract.Events.DTEND)

        while (it.moveToNext()) {
            val startMillis = it.getLong(startIndex)
            val endMillis = it.getLong(endIndex)

            val event = CalendarEvent(
                title = it.getString(titleIndex) ?: "",
                description = it.getString(descIndex) ?: "",
                location = it.getString(locationIndex) ?: "",
                startDate = formatDate(startMillis),
                startTime = formatTime(startMillis),
                endDate = formatDate(endMillis),
                endTime = formatTime(endMillis)
            )
            events.add(event)
        }
    }

    return events
}

data class CalendarEvent(
    val title: String,
    val description: String,
    val location: String,
    val startDate: String,  // YYYY-MM-DD
    val startTime: String,  // HH:mm
    val endDate: String,
    val endTime: String
)

fun formatDate(millis: Long): String {
    val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    return sdf.format(Date(millis))
}

fun formatTime(millis: Long): String {
    val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
    return sdf.format(Date(millis))
}

fun convertToJson(events: List<CalendarEvent>): String {
    val jsonArray = JSONArray()

    events.forEach { event ->
        val jsonObject = JSONObject().apply {
            put("title", event.title)
            put("description", event.description)
            put("location", event.location)
            put("startDate", event.startDate)
            put("startTime", event.startTime)
            put("endDate", event.endDate)
            put("endTime", event.endTime)
        }
        jsonArray.put(jsonObject)
    }

    return jsonArray.toString()
}

companion object {
    const val REQUEST_CALENDAR_PERMISSION = 100
}
```

## 사용자 플로우

1. 사용자가 캘린더 가져오기 버튼(📅) 클릭
2. 앱이 `window.AndroidCalendar.requestCalendarEvents()` 호출
3. 안드로이드 네이티브 코드가 캘린더 읽기 권한 확인
4. 권한이 있으면 캘린더 일정 조회 (오늘 이후)
5. 일정 데이터를 JSON으로 변환
6. `window.receiveCalendarEvents(events)` 호출하여 웹앱에 전달
7. 웹앱이 일정을 내부 스토리지에 복사
8. 성공 메시지 표시: "N개의 일정을 가져왔습니다! 안드로이드 캘린더는 수정되지 않았습니다."

## 테스트 방법

### 웹 브라우저에서 테스트 (Chrome DevTools Console)

```javascript
// 테스트 데이터
const testEvents = [
  {
    title: "김철수 고객님 TV 설치",
    description: "65인치 OLED TV 벽걸이 설치",
    location: "서울시 강남구 테헤란로 123",
    startDate: "2025-11-10",
    startTime: "14:00",
    endDate: "2025-11-10",
    endTime: "16:00"
  },
  {
    title: "이영희 고객님 TV 설치",
    description: "75인치 QLED TV 스탠드 설치",
    location: "서울시 서초구 서초대로 456",
    startDate: "2025-11-11",
    startTime: "10:00",
    endDate: "2025-11-11",
    endTime: "12:00"
  }
];

// 함수 호출
window.receiveCalendarEvents(testEvents);
```

## 데이터 매핑

Android Calendar → TV 설치 스케줄러:

| 캘린더 필드 | 스케줄러 필드 | 설명 |
|------------|-------------|------|
| title | customerName | 일정 제목을 고객명으로 사용 |
| location | address | 장소를 주소로 사용 |
| description | addressDetail / notes | 설명을 상세주소 및 메모로 사용 |
| startDate | date | 시작 날짜 |
| startTime | time | 시작 시간 |

## 주의사항

- **읽기 전용**: 안드로이드 캘린더는 절대 수정되지 않습니다
- Android 6.0 (API 23) 이상: 런타임 권한 요청 필요
- 오늘 이후 일정만 가져옵니다 (과거 일정 제외)
- 빈 필드가 있을 수 있으므로 null 처리 필요
- 가져온 일정은 앱 내부 localStorage에만 저장됩니다

## 보안 고려사항

- READ_CALENDAR 권한만 요청 (WRITE 권한 불필요)
- HTTPS를 통해서만 데이터 전송
- 캘린더 데이터는 로컬에만 저장
- 원본 캘린더 데이터 보호

---

# 안드로이드 영구 저장소 연동 (재부팅 후에도 유지)

웹앱의 스케줄 데이터를 안드로이드 네이티브 저장소(SharedPreferences)에 영구 보존하는 방법입니다.

## ⚠️ 중요: 데이터 손실 방지

- **사용자가 삭제하지 않는 한 데이터는 절대 사라지지 않습니다**
- 핸드폰 재부팅, 앱 재시작 후에도 데이터 유지
- 4중 백업 시스템: localStorage → localStorage Backup → Android Native → IndexedDB

## 저장 메커니즘

웹앱은 다음 순서로 데이터를 저장합니다:

1. **localStorage** (메인 저장소)
2. **localStorage-backup** (웹 백업)
3. **Android SharedPreferences** (네이티브 영구 저장)
4. **IndexedDB** (웹 추가 백업)

## 복구 메커니즘

앱 시작 시 다음 순서로 데이터를 복구 시도:

1. localStorage → 2. localStorage backup → 3. Android Native → 4. IndexedDB

## Android Interface 구현

### 1. JavaScript Interface 클래스 생성

```kotlin
import android.content.Context
import android.content.SharedPreferences
import android.webkit.JavascriptInterface

class StorageBridge(private val context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("installation_scheduler", Context.MODE_PRIVATE)

    @JavascriptInterface
    fun saveSchedules(jsonData: String) {
        try {
            prefs.edit()
                .putString("schedules_data", jsonData)
                .putLong("last_updated", System.currentTimeMillis())
                .apply()

            android.util.Log.d("StorageBridge", "✅ 스케줄 저장 완료: ${jsonData.length} bytes")
        } catch (e: Exception) {
            android.util.Log.e("StorageBridge", "❌ 저장 실패", e)
        }
    }

    @JavascriptInterface
    fun loadSchedules(): String {
        return try {
            val data = prefs.getString("schedules_data", "") ?: ""
            android.util.Log.d("StorageBridge", "✅ 스케줄 불러오기: ${data.length} bytes")
            data
        } catch (e: Exception) {
            android.util.Log.e("StorageBridge", "❌ 불러오기 실패", e)
            ""
        }
    }

    @JavascriptInterface
    fun clearSchedules() {
        prefs.edit()
            .remove("schedules_data")
            .remove("last_updated")
            .apply()
        android.util.Log.d("StorageBridge", "✅ 스케줄 삭제 완료")
    }

    @JavascriptInterface
    fun getLastUpdated(): Long {
        return prefs.getLong("last_updated", 0)
    }
}
```

### 2. MainActivity에 인터페이스 추가

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true // IndexedDB 활성화

            // Add JavaScript interface for persistent storage
            addJavascriptInterface(StorageBridge(this@MainActivity), "AndroidStorage")
            addJavascriptInterface(CalendarBridge(this@MainActivity), "AndroidCalendar")

            loadUrl("https://bionvibe.com/apps/installation-scheduler")
        }

        setContentView(webView)
    }

    override fun onPause() {
        super.onPause()
        // 앱이 백그라운드로 갈 때 현재 데이터를 저장
        webView.evaluateJavascript(
            "(function() { " +
            "  const data = localStorage.getItem('installation-schedules'); " +
            "  if (data && window.AndroidStorage) { " +
            "    window.AndroidStorage.saveSchedules(data); " +
            "  } " +
            "})();",
            null
        )
    }
}
```

## 자동 백업 타이밍

웹앱은 다음 상황에서 자동으로 저장합니다:

1. **스케줄 추가/수정/삭제 시** - 즉시 저장
2. **schedules 상태 변경 시** - useEffect로 자동 저장
3. **앱 백그라운드 전환 시** - MainActivity의 onPause()
4. **페이지 unload 시** - beforeunload 이벤트

## WebView 설정 (중요!)

```kotlin
webView.settings.apply {
    javaScriptEnabled = true
    domStorageEnabled = true  // localStorage 활성화
    databaseEnabled = true    // IndexedDB 활성화

    // WebView 캐시 설정 (데이터 유지를 위해 중요)
    cacheMode = WebSettings.LOAD_DEFAULT

    // 데이터 디렉토리 설정
    setAppCachePath(applicationContext.cacheDir.absolutePath)
    setAppCacheEnabled(true)
}
```

## AndroidManifest.xml 권한

```xml
<!-- 네트워크 접근 (WebView 로드) -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- 파일 저장 (IndexedDB 사용 시) -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## 데이터 백업 및 복원 테스트

### 테스트 시나리오

1. **정상 저장/불러오기 테스트**
   - 스케줄 10개 등록
   - 앱 종료
   - 앱 재시작
   - 10개 모두 정상 표시 확인

2. **재부팅 테스트**
   - 스케줄 등록
   - 핸드폰 재부팅
   - 앱 실행
   - 데이터 정상 표시 확인

3. **캐시 삭제 테스트**
   - 스케줄 등록
   - 브라우저 캐시/데이터 삭제
   - 앱 실행
   - Android Native Storage에서 복구 확인

4. **강제 종료 테스트**
   - 스케줄 등록 중
   - 앱 강제 종료
   - 앱 재시작
   - 마지막 저장 시점까지 복구 확인

## 디버그 로그 확인

Android Studio Logcat에서 다음 태그로 필터링:

```
tag:StorageBridge
```

정상 작동 시 다음 로그가 표시됩니다:

```
D/StorageBridge: ✅ 스케줄 저장 완료: 1234 bytes
D/StorageBridge: ✅ 스케줄 불러오기: 1234 bytes
```

## 사용자에게 안내할 내용

- 스케줄은 자동으로 저장됩니다
- 핸드폰을 재부팅해도 데이터가 유지됩니다
- 앱을 삭제하지 않는 한 데이터는 보존됩니다
- 백업은 4중으로 이루어져 안전합니다

## 주의사항

- **절대 사용자 확인 없이 데이터를 삭제하지 마세요**
- SharedPreferences는 앱 삭제 시에만 삭제됩니다
- WebView의 domStorageEnabled가 반드시 true여야 합니다
- clearSchedules()는 사용자가 명시적으로 "모든 데이터 삭제" 버튼을 눌렀을 때만 호출하세요

---

# iOS (iPhone/iPad) 통합 가이드

iOS에서도 안드로이드와 **완전히 동일한 기능**이 작동합니다.

## 1. iOS 네이티브 저장소 (Permanent Storage)

### Swift 구현 (WKWebView)

```swift
import WebKit
import UIKit

class StorageMessageHandler: NSObject, WKScriptMessageHandler {

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let action = dict["action"] as? String else {
            return
        }

        switch action {
        case "save":
            if let data = dict["data"] as? String {
                saveSchedules(data)
            }
        case "load":
            loadSchedules(webView: message.webView as? WKWebView)
        default:
            break
        }
    }

    private func saveSchedules(_ jsonData: String) {
        UserDefaults.standard.set(jsonData, forKey: "installation_schedules")
        UserDefaults.standard.set(Date(), forKey: "schedules_last_updated")
        UserDefaults.standard.synchronize()
        print("✅ iOS: 스케줄 저장 완료 (\(jsonData.count) bytes)")
    }

    private func loadSchedules(webView: WKWebView?) {
        let data = UserDefaults.standard.string(forKey: "installation_schedules") ?? ""

        // Call JavaScript callback with the data
        let js = "if (window.receiveIOSSchedules) { window.receiveIOSSchedules('\(data.replacingOccurrences(of: "'", with: "\\'"))'); }"
        webView?.evaluateJavaScript(js) { result, error in
            if let error = error {
                print("❌ iOS: JavaScript 실행 오류: \(error)")
            } else {
                print("✅ iOS: 스케줄 불러오기 완료 (\(data.count) bytes)")
            }
        }
    }
}

// ViewController 설정
class ViewController: UIViewController {
    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        let config = WKWebViewConfiguration()
        let storageHandler = StorageMessageHandler()
        config.userContentController.add(storageHandler, name: "iOSStorage")

        webView = WKWebView(frame: view.bounds, configuration: config)
        view.addSubview(webView)

        if let url = URL(string: "http://localhost:3000/apps/installation-scheduler") {
            webView.load(URLRequest(url: url))
        }
    }

    // 앱이 백그라운드로 갈 때 자동 저장
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        let js = """
        (function() {
            const data = localStorage.getItem('installation-schedules');
            if (data && window.webkit && window.webkit.messageHandlers.iOSStorage) {
                window.webkit.messageHandlers.iOSStorage.postMessage({
                    action: 'save',
                    data: data
                });
            }
        })();
        """

        webView.evaluateJavaScript(js, completionHandler: nil)
    }
}
```

### 데이터 영구성 보장

iOS에서도 다음 상황에서 **데이터가 절대 사라지지 않습니다**:

1. ✅ **앱 재시작** - UserDefaults에 저장되어 있음
2. ✅ **iPhone 재부팅** - UserDefaults는 시스템이 관리
3. ✅ **Safari 캐시 삭제** - 네이티브 앱이므로 영향 없음
4. ✅ **강제 종료** - viewWillDisappear에서 자동 저장
5. ❌ **앱 삭제 시에만 삭제됨** - 사용자가 앱을 삭제할 때만

## 2. iOS 캘린더 연동 (Read-Only)

### Swift 구현 (EventKit 사용)

```swift
import EventKit

class CalendarMessageHandler: NSObject, WKScriptMessageHandler {
    private let eventStore = EKEventStore()

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let action = dict["action"] as? String else {
            return
        }

        if action == "import" {
            requestCalendarAccess(webView: message.webView as? WKWebView)
        }
    }

    private func requestCalendarAccess(webView: WKWebView?) {
        eventStore.requestAccess(to: .event) { granted, error in
            if granted {
                self.fetchCalendarEvents(webView: webView)
            } else {
                print("❌ iOS: 캘린더 권한 거부됨")
                DispatchQueue.main.async {
                    let alert = UIAlertController(
                        title: "캘린더 권한 필요",
                        message: "설정 > 개인정보 보호 > 캘린더에서 권한을 허용해주세요.",
                        preferredStyle: .alert
                    )
                    alert.addAction(UIAlertAction(title: "확인", style: .default))
                    UIApplication.shared.windows.first?.rootViewController?.present(alert, animated: true)
                }
            }
        }
    }

    private func fetchCalendarEvents(webView: WKWebView?) {
        // 오늘부터 30일간의 일정 가져오기
        let startDate = Date()
        let endDate = Calendar.current.date(byAdding: .day, value: 30, to: startDate)!

        let predicate = eventStore.predicateForEvents(withStart: startDate, end: endDate, calendars: nil)
        let events = eventStore.events(matching: predicate)

        // Convert to JSON format
        var eventsArray: [[String: String]] = []

        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"

        let timeFormatter = DateFormatter()
        timeFormatter.dateFormat = "HH:mm"

        for event in events {
            let eventDict: [String: String] = [
                "title": event.title ?? "(제목 없음)",
                "location": event.location ?? "",
                "description": event.notes ?? "",
                "startDate": dateFormatter.string(from: event.startDate),
                "startTime": timeFormatter.string(from: event.startDate),
                "endDate": dateFormatter.string(from: event.endDate),
                "endTime": timeFormatter.string(from: event.endDate)
            ]
            eventsArray.append(eventDict)
        }

        // Convert to JSON string
        if let jsonData = try? JSONSerialization.data(withJSONObject: eventsArray, options: []),
           let jsonString = String(data: jsonData, encoding: .utf8) {

            let js = "if (window.receiveCalendarEvents) { window.receiveCalendarEvents(\(jsonString)); }"

            DispatchQueue.main.async {
                webView?.evaluateJavaScript(js) { result, error in
                    if let error = error {
                        print("❌ iOS: 캘린더 데이터 전송 오류: \(error)")
                    } else {
                        print("✅ iOS: 캘린더 일정 \(eventsArray.count)개 전송 완료")
                    }
                }
            }
        }
    }
}
```

### Info.plist 권한 추가

```xml
<key>NSCalendarsUsageDescription</key>
<string>TV 설치 일정을 캘린더에서 가져오기 위해 권한이 필요합니다. 캘린더는 절대 수정되지 않습니다.</string>
```

### ViewController 업데이트

```swift
class ViewController: UIViewController {
    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        let config = WKWebViewConfiguration()

        // Storage handler
        let storageHandler = StorageMessageHandler()
        config.userContentController.add(storageHandler, name: "iOSStorage")

        // Calendar handler (READ-ONLY)
        let calendarHandler = CalendarMessageHandler()
        config.userContentController.add(calendarHandler, name: "iOSCalendar")

        webView = WKWebView(frame: view.bounds, configuration: config)
        view.addSubview(webView)

        if let url = URL(string: "http://localhost:3000/apps/installation-scheduler") {
            webView.load(URLRequest(url: url))
        }
    }
}
```

## 3. iOS 캘린더 데이터 매핑

| iOS EventKit | 웹앱 Schedule | 설명 |
|-------------|--------------|------|
| `event.title` | `customerName` | 캘린더 일정 제목 |
| `event.location` | `address` | 장소 |
| `event.notes` | `addressDetail`, `notes` | 메모 |
| `event.startDate` | `date` | 시작일 (yyyy-MM-dd) |
| `event.startDate` | `time` | 시작시간 (HH:mm) |
| `event.endDate` | - | 종료일 (참고용) |
| `event.endTime` | - | 종료시간 (참고용) |

## 4. iOS 테스트 시나리오

### 테스트 1: 정상 저장/불러오기
1. 일정 3개 추가
2. 앱 종료
3. 앱 재실행
4. ✅ **예상 결과**: 3개 일정 그대로 표시

### 테스트 2: iPhone 재부팅
1. 일정 5개 추가
2. iPhone 완전히 재부팅
3. 앱 재실행
4. ✅ **예상 결과**: 5개 일정 그대로 표시 (UserDefaults 사용)

### 테스트 3: 앱 강제 종료
1. 일정 10개 추가
2. 앱 강제 종료 (스와이프 업으로 종료)
3. 앱 재실행
4. ✅ **예상 결과**: 10개 일정 그대로 표시

### 테스트 4: 캘린더 가져오기
1. iOS 캘린더에 일정 5개 미리 추가
2. 앱에서 📅 버튼 클릭
3. 권한 허용
4. ✅ **예상 결과**:
   - 5개 일정 웹앱에 추가됨
   - iOS 캘린더는 **절대 수정되지 않음**

## 5. iOS 디버그 로그

Xcode 콘솔에서 다음과 같은 로그를 확인할 수 있습니다:

```
✅ iOS: 스케줄 저장 완료 (1234 bytes)
✅ iOS: 스케줄 불러오기 완료 (1234 bytes)
✅ iOS: 캘린더 일정 5개 전송 완료
❌ iOS: 캘린더 권한 거부됨
```

## 6. iOS 보안 주의사항

- ⚠️ **읽기 전용**: EventKit으로 캘린더를 **절대 수정하지 마세요**
- ⚠️ **권한 설명**: Info.plist의 NSCalendarsUsageDescription을 명확하게 작성
- ⚠️ **데이터 백업**: UserDefaults는 iCloud 백업에 포함됨
- ⚠️ **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용 (localhost는 개발용)

## 7. Android vs iOS 기능 비교

| 기능 | Android | iOS | 상태 |
|-----|---------|-----|------|
| 영구 저장소 | SharedPreferences | UserDefaults | ✅ 동일 |
| 캘린더 읽기 | CalendarContract | EventKit | ✅ 동일 |
| 재부팅 후 복구 | ✅ | ✅ | ✅ 동일 |
| 강제 종료 복구 | ✅ | ✅ | ✅ 동일 |
| 캘린더 수정 | ❌ 절대 금지 | ❌ 절대 금지 | ✅ 동일 |
| 데이터 삭제 | 앱 삭제 시만 | 앱 삭제 시만 | ✅ 동일 |

**결론**: 안드로이드와 iOS 모두 **100% 동일한 기능**으로 작동합니다! 🎉
