# Supabase 이메일 확인 비활성화 가이드

## ❌ Email not confirmed 에러 해결

### 방법 1: Supabase Dashboard 설정 (권장)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택

2. **Authentication → Providers**
   - 왼쪽 메뉴: `Authentication` → `Providers`
   - `Email` 클릭

3. **이메일 확인 비활성화**
   - `Confirm email` 토글을 **OFF**
   - `Save` 클릭

### 방법 2: 기존 사용자 수동 확인

1. **Authentication → Users**
2. 사용자 클릭
3. `Email Confirmed` 체크박스 활성화
4. `Save` 클릭

---

## 완료!

이제 아이디/비밀번호만으로 바로 로그인할 수 있습니다! 🎉
