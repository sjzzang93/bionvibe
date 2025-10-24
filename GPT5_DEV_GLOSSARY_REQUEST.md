# GPT-5 요청: 개발자 용어 사전 데이터 생성

## 요청 개요
개발자 용어 사전을 위한 방대한 JSON 데이터를 생성해주세요.

## 데이터 구조 (JSON 형식)

```json
{
  "terms": [
    {
      "id": "unique-term-id",
      "term": "용어명 (영문)",
      "category": "카테고리",
      "languages": ["주로 사용되는 언어1", "언어2", "언어3"],
      "programs": ["주로 사용되는 프로그램/도구1", "도구2"],
      "simpleExplanation": "초등학생도 이해할 수 있는 쉬운 설명 (비유, 예시 포함)",
      "generalExplanation": "일반적인 기술 설명 (정확하고 전문적인 설명)",
      "example": "실제 코드 예시 또는 사용 예시 (선택사항)",
      "relatedTerms": ["관련용어1", "관련용어2"]
    }
  ]
}
```

## 필드 설명

### 1. `id` (string, 필수)
- 고유 식별자 (영문 소문자, 하이픈 사용)
- 예: `"flutter"`, `"api"`, `"machine-learning"`

### 2. `term` (string, 필수)
- 용어명 (영문 표기)
- 예: `"Flutter"`, `"API"`, `"Machine Learning"`

### 3. `category` (string, 필수)
- 용어가 속한 카테고리
- 카테고리 목록:
  - `"프레임워크"` - 프레임워크/라이브러리
  - `"프로그래밍 언어"` - 프로그래밍 언어
  - `"모바일"` - 모바일 개발
  - `"웹"` - 웹 개발
  - `"백엔드"` - 백엔드/서버
  - `"프론트엔드"` - 프론트엔드
  - `"데이터베이스"` - 데이터베이스
  - `"DevOps"` - 배포/운영
  - `"AI/ML"` - 인공지능/머신러닝
  - `"보안"` - 보안
  - `"네트워크"` - 네트워크
  - `"클라우드"` - 클라우드
  - `"개발 도구"` - 개발 도구
  - `"아키텍처"` - 소프트웨어 아키텍처
  - `"개념"` - 프로그래밍 개념
  - `"디자인 패턴"` - 디자인 패턴
  - `"버전 관리"` - Git 등
  - `"테스팅"` - 테스트/QA
  - `"기타"` - 기타

### 4. `languages` (array, 필수)
- 해당 용어가 주로 사용되는 프로그래밍 언어
- 예: `["Dart", "Flutter"]`, `["JavaScript", "TypeScript", "Python"]`
- 범용적인 개념이면: `["범용"]`
- 언어 자체를 설명하는 경우: `["해당 언어명"]`

### 5. `programs` (array, 필수)
- 해당 용어와 관련된 프로그램, 도구, 플랫폼
- 예: `["Android Studio", "VS Code", "Xcode"]`
- 예: `["React", "Next.js", "Vercel"]`
- 해당 없으면: `["범용"]`

### 6. `simpleExplanation` (string, 필수)
- **초등학생도 이해할 수 있는 매우 쉬운 설명**
- 일상적인 비유, 쉬운 예시 사용
- 전문 용어 최소화
- 2-4문장 정도
- 예시:
  - "레고 블록을 조립하듯이 미리 만들어진 코드 조각들을 가져다 쓰는 거예요. 처음부터 다 만들 필요 없이 이미 잘 만들어진 부품들을 조립해서 앱을 빠르게 만들 수 있어요!"
  - "책의 목차 같은 거예요. 어디에 무슨 내용이 있는지 한눈에 볼 수 있게 정리해놓은 거죠."

### 7. `generalExplanation` (string, 필수)
- **정확하고 전문적인 기술 설명**
- 개발자가 읽었을 때 정확하고 유용한 정보
- 3-6문장 정도
- 기술적 세부사항 포함
- 사용 목적, 장단점, 특징 등 포함
- 예시:
  - "Google이 개발한 오픈소스 UI 프레임워크로, Dart 언어를 사용하여 iOS, Android, Web, Desktop 등 다양한 플랫폼에서 실행 가능한 네이티브 컴파일 애플리케이션을 단일 코드베이스로 개발할 수 있습니다. Hot Reload 기능으로 빠른 개발이 가능하며, 위젯 기반의 선언적 UI 구조를 채택하고 있습니다."

### 8. `example` (string, 선택사항)
- 실제 코드 예시 또는 사용 예시
- 간단하고 이해하기 쉬운 예시
- 코드 블록 형식 또는 설명 형식

### 9. `relatedTerms` (array, 선택사항)
- 관련된 다른 용어들
- 예: `["React", "Vue.js", "Angular"]`

---

## 요청 사항

### 📌 필수 포함 용어 (카테고리별)

#### 🎯 Flutter 관련 (특히 방대하게!)
- Flutter
- Dart
- Widget
- StatefulWidget
- StatelessWidget
- BuildContext
- Hot Reload
- Hot Restart
- MaterialApp
- Scaffold
- Container
- Row, Column
- Stack
- ListView
- GridView
- Provider
- Riverpod
- BLoC
- GetX
- setState
- InheritedWidget
- FutureBuilder
- StreamBuilder
- Navigator
- Routes
- Hero Animation
- Cupertino
- Material Design
- Pub.dev
- pubspec.yaml
- Flutter SDK
- Flutter Doctor
- Android Studio
- Xcode
- iOS Simulator
- Android Emulator
- APK
- IPA
- Firebase (Flutter 연동)
- FlutterFire
- Dio (HTTP)
- Shared Preferences
- SQLite (Flutter)
- Hive
- GetIt
- Freezed
- JSON Serialization
- flutter_bloc
- go_router
- auto_route

#### 💻 프로그래밍 언어
- JavaScript
- TypeScript
- Python
- Java
- C++
- C#
- Swift
- Kotlin
- Go
- Rust
- PHP
- Ruby
- Dart (Flutter 관련이므로 특히 상세하게)
- SQL
- HTML
- CSS
- Sass/SCSS

#### 🌐 웹 개발
- React
- Next.js
- Vue.js
- Nuxt.js
- Angular
- Svelte
- Node.js
- Express
- FastAPI
- Django
- Flask
- Tailwind CSS
- Bootstrap
- REST API
- GraphQL
- WebSocket
- SSR (Server-Side Rendering)
- CSR (Client-Side Rendering)
- SSG (Static Site Generation)
- SPA (Single Page Application)
- PWA (Progressive Web App)
- SEO
- CORS
- JWT
- OAuth
- Cookie
- Session
- LocalStorage
- SessionStorage
- DOM
- Virtual DOM
- Webpack
- Vite
- Babel
- ESLint
- Prettier

#### 📱 모바일 개발
- React Native
- Flutter (이미 위에 상세)
- Swift (iOS)
- SwiftUI
- UIKit
- Kotlin (Android)
- Jetpack Compose
- Android SDK
- iOS SDK
- Xcode
- Android Studio
- Expo
- Cordova
- Ionic
- Capacitor
- App Store
- Google Play Store
- Push Notification
- Deep Linking
- In-App Purchase

#### 🗄️ 백엔드 & 데이터베이스
- MongoDB
- PostgreSQL
- MySQL
- Redis
- SQLite
- Firebase Realtime Database
- Firestore
- Supabase
- Prisma
- TypeORM
- Sequelize
- NoSQL
- SQL
- ORM
- Migration
- Index
- Query
- Transaction
- ACID
- Normalization
- Sharding
- Replication

#### ☁️ DevOps & 클라우드
- Docker
- Kubernetes
- CI/CD
- GitHub Actions
- Jenkins
- AWS
- Google Cloud Platform (GCP)
- Azure
- Vercel
- Netlify
- Heroku
- Firebase Hosting
- S3
- CloudFront
- Load Balancer
- Nginx
- Apache
- Linux
- Shell Script
- Environment Variables
- .env

#### 🔧 개발 도구
- Git
- GitHub
- GitLab
- Bitbucket
- VS Code
- IntelliJ IDEA
- Android Studio
- Xcode
- Postman
- Insomnia
- Figma
- Notion
- Jira
- Slack
- Discord
- Terminal
- CLI
- npm
- yarn
- pnpm
- pip
- Homebrew
- Composer

#### 🧠 개념 & 패턴
- API
- MVC
- MVVM
- Clean Architecture
- Dependency Injection
- Singleton Pattern
- Factory Pattern
- Observer Pattern
- Repository Pattern
- Async/Await
- Promise
- Callback
- Event Loop
- Thread
- Process
- Garbage Collection
- Memory Leak
- Big O Notation
- Algorithm
- Data Structure
- Array
- Linked List
- Stack
- Queue
- Tree
- Graph
- Hash Table
- Recursion
- Dynamic Programming
- Greedy Algorithm
- Binary Search
- Sorting

#### 🤖 AI/ML
- Machine Learning
- Deep Learning
- Neural Network
- TensorFlow
- PyTorch
- scikit-learn
- OpenAI API
- GPT
- LLM
- NLP
- Computer Vision
- CNN
- RNN
- Transformer
- Fine-tuning
- Dataset
- Training
- Inference

#### 🔒 보안
- HTTPS
- SSL/TLS
- Encryption
- Hashing
- JWT
- OAuth 2.0
- Two-Factor Authentication (2FA)
- XSS
- CSRF
- SQL Injection
- API Key
- Access Token
- Refresh Token
- CORS

#### 🧪 테스팅
- Unit Test
- Integration Test
- E2E Test
- Jest
- Mocha
- Chai
- Cypress
- Selenium
- Puppeteer
- Flutter Test
- Widget Test
- TDD (Test-Driven Development)
- BDD (Behavior-Driven Development)
- Mocking
- Code Coverage

#### 🌍 네트워크
- HTTP
- HTTPS
- TCP/IP
- DNS
- IP Address
- Port
- Proxy
- CDN
- Latency
- Bandwidth
- WebSocket
- gRPC
- MQTT

#### 📚 기타 중요 개념
- Agile
- Scrum
- Sprint
- Kanban
- Refactoring
- Code Review
- Pull Request
- Merge
- Conflict
- Branch
- Commit
- Push
- Pull
- Clone
- Fork
- Open Source
- License
- README
- Documentation
- Changelog
- Semantic Versioning
- Monorepo
- Microservices
- Serverless
- Edge Computing
- WebAssembly
- TypeScript Generics
- Interface
- Abstract Class
- Inheritance
- Polymorphism
- Encapsulation

---

## 📋 요청 수량

- **총 200~300개 용어** 생성
- **Flutter 관련 용어는 특히 방대하게 (최소 50개 이상)**
- 각 용어마다 모든 필수 필드 포함
- `languages`, `programs` 필드 빠짐없이 작성

---

## ✅ 품질 기준

1. **simpleExplanation**: 초등학생이 이해할 수 있을 정도로 쉽게
2. **generalExplanation**: 개발자에게 실질적으로 유용한 정보
3. **languages**: 실제로 해당 용어를 사용하는 언어 정확히 명시
4. **programs**: 실제로 해당 용어와 관련된 도구/프로그램 명시
5. **일관성**: 모든 용어가 동일한 구조와 품질 유지

---

## 📤 응답 형식

- JSON 파일로 응답
- 한글 인코딩 정상 작동 확인
- 유효한 JSON 문법
- 들여쓰기 2칸
- 파일명: `dev_glossary_full.json`

---

## 예시 (Flutter 관련)

```json
{
  "terms": [
    {
      "id": "flutter",
      "term": "Flutter",
      "category": "프레임워크",
      "languages": ["Dart"],
      "programs": ["Android Studio", "VS Code", "Xcode", "Flutter SDK"],
      "simpleExplanation": "레고 블록처럼 미리 만들어진 조각들을 조립해서 스마트폰 앱을 만드는 도구예요. 한 번만 만들면 아이폰과 안드로이드 둘 다에서 똑같이 작동해요! 게다가 코드를 고치면 바로바로 화면에 반영돼서 정말 빠르게 앱을 만들 수 있어요.",
      "generalExplanation": "Google이 개발한 오픈소스 크로스 플랫폼 UI 프레임워크로, Dart 언어를 사용합니다. iOS, Android, Web, Desktop 등 다양한 플랫폼에서 실행 가능한 네이티브 컴파일 애플리케이션을 단일 코드베이스로 개발할 수 있습니다. Hot Reload 기능으로 개발 속도가 빠르며, 위젯 기반의 선언적 UI 구조를 채택하고 있습니다. Material Design과 Cupertino 위젯을 기본 제공하여 플랫폼별 네이티브 UI를 쉽게 구현할 수 있습니다.",
      "example": "flutter create my_app\nflutter run\n// Hot Reload: 코드 수정 후 'r' 키 입력으로 즉시 반영",
      "relatedTerms": ["Dart", "Widget", "Hot Reload", "Material Design", "React Native"]
    },
    {
      "id": "dart",
      "term": "Dart",
      "category": "프로그래밍 언어",
      "languages": ["Dart"],
      "programs": ["Flutter", "DartPad", "VS Code", "Android Studio"],
      "simpleExplanation": "Flutter 앱을 만들 때 사용하는 프로그래밍 언어예요. 영어로 컴퓨터에게 명령을 내리는 것처럼, Dart로 앱에게 '이렇게 움직여라' '저 버튼을 눌렀을 때 이렇게 해라' 같은 명령을 써요. 배우기 쉽고 빠르게 작동해요!",
      "generalExplanation": "Google이 개발한 객체지향 프로그래밍 언어로, Flutter의 공식 언어입니다. JavaScript와 유사한 문법을 가지고 있어 학습이 용이하며, 강타입 언어로 타입 안정성을 제공합니다. JIT(Just-In-Time) 컴파일과 AOT(Ahead-Of-Time) 컴파일을 모두 지원하여 개발 시에는 빠른 Hot Reload를, 프로덕션에서는 최적화된 네이티브 코드를 제공합니다. null safety 기능으로 null 참조 오류를 컴파일 타임에 방지할 수 있습니다.",
      "example": "void main() {\n  print('Hello, Dart!');\n  var name = 'Flutter';\n  int count = 10;\n}",
      "relatedTerms": ["Flutter", "JavaScript", "TypeScript", "Java", "Kotlin"]
    },
    {
      "id": "widget",
      "term": "Widget",
      "category": "개념",
      "languages": ["Dart", "Flutter"],
      "programs": ["Flutter"],
      "simpleExplanation": "화면에 보이는 모든 것들이 위젯이에요. 버튼도 위젯, 글자도 위젯, 사진도 위젯! 레고 블록처럼 위젯들을 쌓아 올려서 앱 화면을 만들어요. 작은 위젯들을 조합해서 큰 위젯을 만들 수도 있어요!",
      "generalExplanation": "Flutter에서 UI를 구성하는 기본 단위입니다. 'Everything is a Widget'이라는 철학 아래, 화면의 모든 요소(버튼, 텍스트, 레이아웃, 애니메이션 등)가 위젯으로 구성됩니다. 위젯은 불변(immutable) 객체이며, StatelessWidget과 StatefulWidget으로 나뉩니다. 위젯 트리 구조로 조합되어 복잡한 UI를 구현하며, 선언적 프로그래밍 방식으로 UI를 정의합니다.",
      "example": "Container(\n  child: Text('Hello'),\n  padding: EdgeInsets.all(16),\n)",
      "relatedTerms": ["StatelessWidget", "StatefulWidget", "BuildContext", "Flutter"]
    }
  ]
}
```

---

## 🚀 시작해주세요!

위 형식과 예시를 참고하여 **200~300개의 개발자 용어**를 JSON 형식으로 생성해주세요.
특히 **Flutter 관련 용어는 50개 이상** 방대하게 포함해주세요!

