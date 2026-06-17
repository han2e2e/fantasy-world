# 이능력판정소 (Isekai Ability Quiz)

성향으로 알아보는 나의 이세계 이능력 찾기 — React(Vite) + Supabase + Web Audio API 기반 성향 퀴즈 웹앱.

## 🔗 바로가기 (대시보드)

| 서비스 | 주소 | 용도 |
|---|---|---|
| 🌐 배포 사이트 | https://ability-world.vercel.app | 실제 서비스 |
| 🐙 GitHub | https://github.com/han2e2e/fantasy-world | 소스코드 저장소 (`main`) |
| ▲ Vercel | https://vercel.com/leehan-s-projects1/fantsay-world | 배포·도메인·환경변수 |
| 🟢 Supabase | https://supabase.com/dashboard/project/tdyogwcetgvnjvzmidav | DB·테이블·RLS |

## 🧩 연동 구조

- **코드**: GitHub `han2e2e/fantasy-world` (원격 `origin`)
- **배포**: Vercel 프로젝트 `leehan-s-projects1/fantsay-world`, 별칭 도메인 `ability-world.vercel.app`
- **백엔드**: Supabase 프로젝트 `tdyogwcetgvnjvzmidav`
  - 테이블: `quizzes`, `user_responses`, `guestbook`
  - 환경변수: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (로컬 `.env` / Vercel 환경변수)

## 🚀 개발 / 빌드 / 배포

```bash
npm install        # 의존성 설치
npm run dev        # 로컬 개발 서버
npm run build      # 프로덕션 빌드 (dist/)
npx vercel --prod --yes   # 프로덕션 수동 배포
```

## ⚙️ GitHub → Vercel 자동배포 설정 (웹 대시보드에서 1회)

CLI로는 GitHub 앱 권한 때문에 연결이 안 되므로 아래 단계로 한 번만 설정하면, 이후 `main`에 push할 때마다 자동 배포됩니다.

1. https://vercel.com/leehan-s-projects1/fantsay-world 접속 → 로그인
2. 상단 **Settings** → 좌측 **Git** 메뉴
3. **Connect Git Repository** → GitHub 선택 → 권한 승인(Authorize Vercel)
4. 저장소 목록에서 **han2e2e/fantasy-world** 선택 → Production Branch는 `main`
5. 연결 후, 이후 `git push origin main` 만 하면 Vercel이 자동으로 빌드·배포

> 자동배포 설정 후에는 `npx vercel --prod` 수동 배포가 더 이상 필요 없습니다.

## 🗄️ Supabase 테이블 요약

- `quizzes`: 10문항(question_number, question, option1~4, type1~4)
- `user_responses`: 퀴즈 결과 저장 (user_name, selected_choices, final_scores, matched_job)
- `guestbook`: 익명 방명록 (nickname, comment, user_response_id) — RLS SELECT/INSERT/DELETE 허용
