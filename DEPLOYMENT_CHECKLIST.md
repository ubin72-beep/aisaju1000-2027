# AI 사주 천년지기 2027 — 출시 전 점검

## 현재 범위
- Next.js / Supabase 로그인 및 회원가입
- 회원별 출생 정보 등록·삭제 (정확한 만세력 계산 미구현)
- 일반 명리학 개념 AI 상담 베타 (개인 사주 계산 미지원)
- 상담 기록 전체 삭제
- 결제·포인트·관리자 기능은 운영 준비 전 단계

## 1. Supabase SQL 적용 (순서대로)
Supabase SQL Editor에서 아래 파일을 실행:
1. `supabase/schema.sql` (기존에 실행했다면 중복 실행 전 정책/트리거 확인)
2. `supabase/birth_profiles.sql`
3. `supabase/consultations.sql`
4. `supabase/consultation_limits.sql`

주의: 위 SQL은 최초 설치용입니다. 정책을 이미 생성한 데이터베이스에서 동일 파일을 다시 실행하면 중복 정책 오류가 발생할 수 있습니다. 실제 운영 데이터는 백업 후 변경하세요.

## 2. Vercel 환경 변수
- `NEXT_PUBLIC_SUPABASE_URL` — 공개 Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — 공개 Supabase publishable/anon key
- `OPENAI_API_KEY` — 서버 전용 비밀 키
- `SUPABASE_SERVICE_ROLE_KEY` — 서버 전용 비밀 키, 절대 NEXT_PUBLIC 접두어 사용 금지
- `OPENAI_MODEL` — 선택사항, 기본 gpt-4o-mini

비밀 키는 GitHub 커밋이나 브라우저 코드에 넣지 마세요.

## 3. 인증
Supabase Authentication → URL Configuration에서 실제 배포 도메인을 Site URL과 Redirect URLs에 등록합니다. 회원가입, 이메일 인증, 로그인, 로그아웃을 직접 테스트합니다.

## 4. 검증
- `npm install` 및 `npm run build`
- 회원 A가 회원 B의 출생 정보/상담 기록에 접근할 수 없는지 확인
- 출생 정보 저장·수정·삭제
- AI 상담 하루 3회 제한 및 실패 처리
- 상담 기록 전체 삭제
- 모바일 화면
- 비밀 키가 응답/클라이언트 번들에 포함되지 않는지 확인

## 5. 공개 전 미완성
- 검증된 한국 만세력 엔진: 절기 기준 월주, 일주, 시주, 음력 윤달 및 시간대/지역 보정 검증 필요
- 사주 기반 개인화 AI 상담: 만세력 검증 후 연동
- 결제: Toss Payments 서버 승인, 웹훅 검증, 중복 처리 방지, 환불 및 포인트 원장
- 관리자: 별도 서버 권한 및 감사 로그
- 이용약관/개인정보 처리방침, 보관 및 삭제 정책
- 접근성, 부하/보안 테스트

기존 `aisaju1000.com` 도메인의 DNS는 별도 승인 없이 변경하지 않습니다.
