import { Lightbulb, RotateCcw, Wallet } from "lucide-react";
import { getOptionLabel, QUESTIONS } from "@/lib/questions";
import type { Recommendation, RecommendResponse, SurveyAnswers } from "@/lib/types";
import DbInspector from "./DbInspector";

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`난이도 ${level}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`size-1.5 rounded-full ${n <= level ? "bg-indigo-500" : "bg-slate-200"}`} />
      ))}
    </span>
  );
}

function HobbyCard({ hobby, rank }: { hobby: Recommendation; rank: number }) {
  const best = rank === 1;
  return (
    <article
      className={`animate-fade-up relative rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        best ? "border-indigo-200 ring-4 ring-indigo-500/10" : "border-slate-200/80"
      }`}
      style={{ animationDelay: `${rank * 100}ms` }}
    >
      {best && (
        <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
          BEST MATCH
        </span>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${
            best ? "bg-indigo-50" : "bg-slate-100"
          }`}
        >
          {hobby.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>#{rank}</span>
            <span className="h-3 w-px bg-slate-200" />
            <span>{hobby.category}</span>
          </div>
          <h3 className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-slate-900">{hobby.name}</h3>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-extrabold tabular-nums ${best ? "text-indigo-600" : "text-slate-900"}`}>
            {hobby.match_score}
            <span className="text-base">%</span>
          </div>
          <div className="text-[11px] font-medium text-slate-400">매칭률</div>
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${best ? "bg-indigo-600" : "bg-indigo-400"}`}
          style={{ width: `${hobby.match_score}%` }}
        />
      </div>

      <p className="mt-4 leading-relaxed text-slate-600">{hobby.description}</p>

      {(hobby.match_reasons.length > 0 || hobby.tags.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hobby.match_reasons.map((r) => (
            <span key={r} className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
              ✓ {r}
            </span>
          ))}
          {hobby.tags.map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm">
          <Wallet className="size-4 shrink-0 text-slate-400" />
          <span className="text-slate-700">{hobby.monthly_cost}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-500">입문 난이도</span>
          <DifficultyDots level={hobby.difficulty} />
        </div>
      </div>

      <div className="mt-3 flex gap-2.5 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <p className="leading-relaxed text-slate-700">
          <b className="font-semibold text-slate-900">시작 팁 · </b>
          {hobby.starter_tip}
        </p>
      </div>
    </article>
  );
}

interface ResultsProps {
  data: RecommendResponse;
  answers: SurveyAnswers;
  onRestart: () => void;
}

export default function Results({ data, answers, onRestart }: ResultsProps) {
  return (
    <section className="pt-8 sm:pt-12">
      <div className="animate-fade-up text-center">
        <p className="text-sm font-bold text-indigo-600">분석 완료</p>
        <h2 className="mt-2 text-[28px] font-extrabold tracking-tight sm:text-4xl">당신을 위한 취미 Top 3</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {QUESTIONS.map((q) => (
            <span
              key={q.key}
              className="rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
            >
              {getOptionLabel(q.key, answers[q.key])}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {data.recommendations.map((h, i) => (
          <HobbyCard key={h.id} hobby={h} rank={i + 1} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
        >
          <RotateCcw className="size-4" />
          다시 테스트하기
        </button>
      </div>

      <DbInspector data={data} request={answers} />
    </section>
  );
}
