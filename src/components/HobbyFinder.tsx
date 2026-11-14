"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { QUESTIONS } from "@/lib/questions";
import type { HealthResponse, RecommendResponse, SurveyAnswers } from "@/lib/types";
import Header from "./Header";
import Landing from "./Landing";
import LoadingAnalysis from "./LoadingAnalysis";
import Quiz from "./Quiz";
import Results from "./Results";
import type { DbStatus } from "./StatusBadge";

type Phase = "landing" | "quiz" | "loading" | "result" | "error";

const MIN_LOADING_MS = 1400; // 로딩 애니메이션이 깜빡이지 않도록 최소 노출 시간
const ADVANCE_DELAY_MS = 220; // 선택 피드백을 보여준 뒤 다음 질문으로

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function HobbyFinder() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<SurveyAnswers>>({});
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus>({ state: "checking" });
  const advancing = useRef(false);

  // 헤더 배지: 실제 DB 연결 상태 확인
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/health", { cache: "no-store", signal: ctrl.signal })
      .then((r) => r.json() as Promise<HealthResponse>)
      .then((h) =>
        setDbStatus({ state: h.connected ? "connected" : "fallback", latencyMs: h.latency_ms, detail: h.reason }),
      )
      .catch((e) => {
        if (e?.name !== "AbortError") setDbStatus({ state: "fallback", detail: "헬스체크 실패" });
      });
    return () => ctrl.abort();
  }, []);

  const reset = useCallback(() => {
    setPhase("landing");
    setStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    advancing.current = false;
  }, []);

  const submit = useCallback(async (final: SurveyAnswers) => {
    setPhase("loading");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const [res] = await Promise.all([
        fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(final),
        }),
        sleep(MIN_LOADING_MS),
      ]);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);

      const data = json as RecommendResponse;
      setResult(data);
      setDbStatus(
        data.meta.source === "supabase"
          ? { state: "connected", latencyMs: data.meta.db_latency_ms }
          : { state: "fallback", detail: data.meta.fallback_reason },
      );
      setPhase("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했어요.");
      setPhase("error");
    }
  }, []);

  const handleAnswer = (key: keyof SurveyAnswers, value: string) => {
    if (advancing.current) return;
    advancing.current = true;
    const next = { ...answers, [key]: value };
    setAnswers(next);

    setTimeout(() => {
      advancing.current = false;
      if (step < QUESTIONS.length - 1) {
        setStep((s) => s + 1);
      } else {
        submit(next as SurveyAnswers);
      }
    }, ADVANCE_DELAY_MS);
  };

  const handleBack = () => {
    if (step === 0) reset();
    else setStep((s) => s - 1);
  };

  return (
    <div className="min-h-dvh">
      <Header status={dbStatus} onHome={reset} />
      <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        {phase === "landing" && <Landing onStart={() => setPhase("quiz")} />}

        {phase === "quiz" && <Quiz step={step} answers={answers} onAnswer={handleAnswer} onBack={handleBack} />}

        {phase === "loading" && <LoadingAnalysis />}

        {phase === "result" && result && (
          <Results data={result} answers={answers as SurveyAnswers} onRestart={reset} />
        )}

        {phase === "error" && (
          <section className="animate-fade-up mx-auto mt-16 max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <AlertCircle className="size-6" />
            </span>
            <h2 className="mt-4 text-xl font-bold">추천을 불러오지 못했어요</h2>
            <p className="mt-1.5 text-sm text-slate-500">{error}</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => submit(answers as SurveyAnswers)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-indigo-700"
              >
                <RotateCcw className="size-4" />
                다시 시도
              </button>
              <button
                onClick={reset}
                className="rounded-xl border border-slate-200/80 px-5 py-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50"
              >
                처음으로
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-400">
        HobbyFinder · Next.js API Routes + Supabase
      </footer>
    </div>
  );
}
