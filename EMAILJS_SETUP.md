# 📧 EmailJS 설정 가이드

문의하기 폼에서 이메일을 받으려면 EmailJS 계정 설정이 필요합니다.

## 1️⃣ EmailJS 계정 생성

1. https://www.emailjs.com/ 접속
2. **Sign Up** 클릭 (무료)
3. 이메일 인증 완료

## 2️⃣ 이메일 서비스 연결

1. 대시보드에서 **Add New Service** 클릭
2. **Naver** 또는 **Gmail** 선택
3. 연결할 이메일 주소 입력: `wa8106@naver.com`
4. 인증 완료
5. **Service ID** 복사 (예: service_abc1234)

## 3️⃣ 이메일 템플릿 생성

1. **Email Templates** 메뉴로 이동
2. **Create New Template** 클릭
3. 템플릿 작성:

```
Subject: 🔔 BION 문의: {{from_name}}님의 메시지

From: {{from_name}} ({{from_email}})

메시지:
{{message}}

---
BION 문의 시스템
```

4. **Template ID** 복사 (예: template_xyz5678)
5. **Save** 클릭

## 4️⃣ Public Key 확인

1. **Account** 메뉴로 이동
2. **General** 탭에서 **Public Key** 복사 (예: AbCdEfGhIj123456)

## 5️⃣ 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc1234
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz5678
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=AbCdEfGhIj123456
NEXT_PUBLIC_GA_ID=G-DGQPGH00WH
```

## 6️⃣ 개발 서버 재시작

```bash
npm run dev
```

## 7️⃣ 테스트

1. http://localhost:3000/contact 접속
2. 테스트 메시지 전송
3. wa8106@naver.com에서 이메일 확인

---

## 💰 무료 제한

- 월 200건까지 무료
- 초과시 유료 플랜 필요 ($9.99/월)

## 🔒 보안

- `.env.local` 파일은 절대 Git에 올리지 마세요!
- `.gitignore`에 자동으로 포함되어 있습니다.

## 🆘 문제 해결

**이메일이 안 오면:**
1. EmailJS 대시보드에서 Usage 확인
2. 스팸 폴더 확인
3. 브라우저 콘솔에서 에러 확인
4. Service ID, Template ID, Public Key 재확인

