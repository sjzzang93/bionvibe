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
