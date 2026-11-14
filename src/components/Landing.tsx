import { ArrowRight, Database, ListChecks, Sparkles, Trophy } from "lucide-react";

const FEATURES = [
  { icon: ListChecks, title: "8단계 질문", desc: "2분이면 끝나는 간단한 성향 퀴즈" },
  { icon: Database, title: "50가지 취미 데이터 분석", desc: "장소, 예산, 활동 성향까지 꼼꼼하게 매칭" },
  { icon: Trophy, title: "Top 3 추천", desc: "매칭 점수와 시작 팁까지" },
];

const STACK = ["Next.js App Router", "TypeScript", "API Routes", "Supabase", "Tailwind CSS"];

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="flex flex-col items-center pt-10 text-center sm:pt-16">
      <div className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
        <Sparkles className="size-3.5" />
        나만의 취미 추천 서비스
      </div>

      <div className="animate-float mt-8 text-6xl select-none" aria-hidden>
        🧭
      </div>

      <h1
        className="animate-fade-up mt-6 text-[32px] leading-[1.25] font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.2]"
        style={{ animationDelay: "80ms" }}
      >
        나에게 딱 맞는 취미,
        <br />
        <span className="text-indigo-600">8개의 질문</span>이면 충분해요
      </h1>

      <p
        className="animate-fade-up mt-5 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg"
        style={{ animationDelay: "160ms" }}
      >
        성향과 생활 패턴을 바탕으로 50가지 취미 데이터 중
        <br className="hidden sm:block" /> 가장 잘 어울리는 취미 3개를 골라드릴게요.
      </p>

      <button
        onClick={onStart}
        className="animate-fade-up group mt-9 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 active:translate-y-0 active:scale-[0.98]"
        style={{ animationDelay: "240ms" }}
      >
        내 취미 찾기 시작하기
        <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
      <p className="animate-fade-up mt-3 text-xs text-slate-400" style={{ animationDelay: "280ms" }}>
        로그인 없이 바로 시작 · 약 2분 소요
      </p>

      <div className="mt-14 grid w-full gap-4 sm:grid-cols-3 sm:gap-6">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="animate-fade-up rounded-2xl border border-slate-200/80 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ animationDelay: `${320 + i * 80}ms` }}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <f.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {STACK.map((s) => (
          <span
            key={s}
            className="rounded-full border border-slate-200/80 bg-white px-3 py-1 font-mono text-[11px] text-slate-500"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
