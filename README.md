# HobbyFinder · 맞춤형 취미 추천 웹앱

8개의 질문에 답하면 Next.js API Route가 Supabase `hobbies` 테이블을 조회해 가장 잘 맞는 취미 Top 3를 추천합니다.

**Stack**: Next.js (App Router) · TypeScript · Tailwind CSS v4 · lucide-react · Supabase

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev                  # http://localhost:3000
```

`.env.local`에 키가 없거나 Supabase 연결이 실패해도 앱은 **Fallback(목업 데이터) 모드**로 정상 동작합니다.
이때 헤더 배지는 주황색 `Fallback Mode`로, 연결되면 녹색 `Supabase DB Connected`로 표시됩니다.

## Supabase 설정

1. Supabase에서 새 프로젝트 생성
2. **SQL Editor**에 `supabase_setup.sql` 전체를 붙여넣고 Run (테이블 + RLS 읽기 정책 + 데이터 50개)
3. **Project Settings → API**에서 `Project URL`, `anon public` 키를 복사해 `.env.local`에 입력

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

## Vercel 배포

1. GitHub에 push (`.env.local`은 `.gitignore`로 제외됨)
2. Vercel에서 저장소 Import
3. **Settings → Environment Variables**에 `SUPABASE_URL`, `SUPABASE_ANON_KEY` 추가 후 Deploy

## 구조

```
src/
├─ app/
│  ├─ api/recommend/route.ts   POST: 설문 응답 → Supabase 조회 → 점수 매칭 → Top 3 (+ Fallback)
│  ├─ api/health/route.ts      GET : 헤더 배지용 DB 연결 상태 확인
│  ├─ layout.tsx               Pretendard 폰트 전역 적용
│  └─ page.tsx
├─ components/                 Header, StatusBadge, Landing, Quiz, LoadingAnalysis, Results, DbInspector
└─ lib/                        types, questions, matching(점수 로직), supabase(서버 클라이언트), fallback-hobbies
```

## 매칭 알고리즘

| 항목 | 가중치 | 부분 점수 |
| --- | --- | --- |
| ① 활동 장소 | 15 | 취미가 `both`이면 80% |
| ② 에너지 방향 | 15 | 취미가 `both`이면 80% |
| ③ 예산 | 10 | 투자 가능한 사용자에게 가성비 취미는 60% |
| ④ 선호 스타일 | 15 | – |
| ⑤ 시간 투자 | 10 | – |
| ⑥ 보상·성취 방식 (결과물 / 힐링 / 성장) | 15 | – |
| ⑦ 입문 장벽 (바로 시작 / 장비) | 10 | 장비 선호 사용자에게 바로 시작형 취미는 50% |
| ⑧ 분위기 (차분·감성 / 역동·트렌디) | 10 | – |

가중치는 `src/lib/matching.ts`의 `WEIGHTS`에서 조정할 수 있고, 결과 화면 Inspector의 응답 JSON(`meta.scoring_weights`)에서도 확인할 수 있습니다.

DB 쿼리 단계에서 `location IN (선택값, 'both')`로 1차 필터링 후, 서버에서 점수를 계산해 정렬합니다 (동점이면 입문 난이도가 낮은 순).
