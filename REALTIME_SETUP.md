# 📡 Supabase Realtime 설정 가이드

이미지 업로드 시 모든 사용자에게 **실시간 반영**되도록 설정하는 방법입니다.

## ✅ 1. Supabase Realtime 활성화

### 방법 1: Supabase 대시보드에서 설정

1. **Supabase 대시보드**에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Database** → **Replication** 클릭
4. `apps` 테이블을 찾아서 **Realtime** 토글을 **ON**으로 변경

### 방법 2: SQL로 설정 (더 빠름)

Supabase SQL Editor에서 다음 명령어 실행:

```sql
-- apps 테이블에 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE apps;
```

## ✅ 2. 작동 확인

1. **폰에서** `/secret/image-manager` 접속
2. 앱 선택 후 이미지 업로드
3. **다른 기기(PC)**에서 홈페이지 열기
4. 브라우저 콘솔(F12)에서 다음 메시지 확인:
   - `📡 Realtime 연결 상태: SUBSCRIBED`
   - 이미지 업로드 시: `🔄 실시간 변경 감지:`
   - `✅ 앱 데이터 실시간 업데이트 완료!`

## 🔥 주요 기능

- **실시간 이미지 반영**: 이미지 업로드하면 모든 사용자 화면에 즉시 업데이트
- **자동 재연결**: 네트워크 끊김 시 자동으로 재연결
- **백업 시스템**: Realtime 실패 시 5분마다 자동 갱신

## 🎯 테스트 시나리오

### 시나리오 1: 폰에서 이미지 업로드
1. 폰에서 `/secret/image-manager` 접속
2. 앱 선택 → 사진 촬영/업로드 → 이미지 업데이트
3. PC에서 홈페이지 확인 → **즉시 반영!**

### 시나리오 2: 여러 사용자 동시 접속
1. 사용자 A, B, C가 홈페이지 접속
2. 관리자가 이미지 업로드
3. A, B, C 모두 **새로고침 없이** 즉시 업데이트 확인

## 🐛 문제 해결

### Realtime이 작동하지 않는 경우

1. **콘솔 메시지 확인**:
   ```
   📡 Realtime 연결 상태: CHANNEL_ERROR
   ```
   → Supabase에서 Realtime이 비활성화되어 있음

2. **해결 방법**:
   ```sql
   -- SQL Editor에서 실행
   ALTER PUBLICATION supabase_realtime ADD TABLE apps;
   ```

3. **권한 확인**:
   ```sql
   -- apps 테이블의 RLS 정책 확인
   SELECT * FROM pg_policies WHERE tablename = 'apps';
   ```

### 브라우저 새로고침 필요한 경우

- Realtime 연결이 끊어진 경우 → 페이지 새로고침
- 자동으로 재연결되지만, 안되면 새로고침

## 📌 참고사항

- Realtime은 **Supabase 무료 플랜**에서도 사용 가능
- 최대 연결 수: 무료 플랜 200개, 유료 플랜 500개+
- 메시지 크기 제한: 250KB
- 실시간 구독은 브라우저 탭이 활성화되어 있을 때만 작동
