"use client";

import { useEffect, useState } from "react";
import { Check, LoaderCircle, Sparkles } from "lucide-react";

const STEPS = [
  { label: "설문 응답 전송", code: "POST /api/recommend" },
  { label: "Supabase hobbies 테이블 조회", code: "SELECT * FROM hobbies" },
  { label: "매칭 점수 계산 및 정렬", code: "rankHobbies(top=3)" },
];

export default function LoadingAnalysis() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => Math.min(a + 1, STEPS.length - 1)), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="animate-fade-up pt-10 sm:pt-16" aria-busy="true" aria-live="polite">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex size-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/20" />
          <span className="absolute inset-2 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600" />
          <Sparkles className="size-7 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight">취향을 분석하고 있어요</h2>
        <p className="mt-1.5 text-slate-500">데이터베이스에서 꼭 맞는 취미를 찾는 중…</p>
      </div>

      {/* 단계별 진행 로그 */}
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <ul className="space-y-3">
          {STEPS.map((s, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <li key={s.label} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    done ? "bg-emerald-500 text-white" : current ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-300"
                  }`}
                >
                  {done ? (
                    <Check className="size-3.5" strokeWidth={3} />
                  ) : current ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className={`flex-1 font-medium ${done || current ? "text-slate-800" : "text-slate-400"}`}>
                  {s.label}
                </span>
                <code className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500 sm:inline">
                  {s.code}
                </code>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 결과 카드 스켈레톤 */}
      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="skeleton size-14 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3 rounded-md" />
                <div className="skeleton h-3 w-1/5 rounded-md" />
              </div>
              <div className="skeleton h-8 w-14 rounded-xl" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="skeleton h-3 w-full rounded-md" />
              <div className="skeleton h-3 w-4/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
