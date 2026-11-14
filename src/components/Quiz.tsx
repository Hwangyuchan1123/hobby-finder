import { Check, ChevronLeft } from "lucide-react";
import { QUESTIONS } from "@/lib/questions";
import type { SurveyAnswers } from "@/lib/types";

interface QuizProps {
  step: number;
  answers: Partial<SurveyAnswers>;
  onAnswer: (key: keyof SurveyAnswers, value: string) => void;
  onBack: () => void;
}

export default function Quiz({ step, answers, onAnswer, onBack }: QuizProps) {
  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = Math.round((step / total) * 100);
  const selected = answers[q.key];

  return (
    <section className="pt-6 sm:pt-10">
      {/* 진행률 */}
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={onBack}
          className="-ml-2 inline-flex items-center gap-1 rounded-xl px-2 py-1.5 font-medium text-slate-500 transition-all duration-200 hover:bg-slate-200/60 hover:text-slate-900"
        >
          <ChevronLeft className="size-4" />
          {step === 0 ? "처음으로" : "이전"}
        </button>
        <span className="font-semibold text-slate-500">
          <span className="text-indigo-600">{step + 1}</span> / {total}
        </span>
      </div>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/70"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${Math.max(progress, 4)}%` }}
        />
      </div>

      {/* 질문 (step이 바뀔 때마다 key로 재마운트되어 애니메이션 재생) */}
      <div key={q.key} className="animate-fade-up mt-10 sm:mt-14">
        <p className="text-sm font-bold text-indigo-600">
          Q{step + 1}. {q.eyebrow}
        </p>
        <h2 className="mt-2 text-[26px] leading-snug font-extrabold tracking-tight whitespace-pre-line text-slate-900 sm:text-3xl">
          {q.title}
        </h2>
        <p className="mt-2 text-slate-500">{q.subtitle}</p>

        <div className={`mt-8 grid gap-4 sm:gap-6 ${q.options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {q.options.map((opt, i) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onAnswer(q.key, opt.value)}
                className={`animate-fade-up group relative flex items-center gap-4 rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:scale-[0.98] sm:flex-col sm:items-start ${
                  isSelected ? "border-indigo-500 ring-4 ring-indigo-500/10" : "border-slate-200/80"
                }`}
                style={{ animationDelay: `${100 + i * 70}ms` }}
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                  }`}
                >
                  <opt.icon className="size-6" />
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-bold text-slate-900">{opt.label}</span>
                  <span className="mt-0.5 block text-sm text-slate-500">{opt.description}</span>
                </span>
                <span
                  className={`absolute top-4 right-4 flex size-6 items-center justify-center rounded-full bg-indigo-600 text-white transition-all duration-200 ${
                    isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
