"use client";

import { useState } from "react";
import { Check, ChevronDown, Clock, Copy, Database, Layers, Server, Terminal } from "lucide-react";
import type { RecommendResponse, SurveyAnswers } from "@/lib/types";

/** 간단한 JSON 구문 강조 (HTML 이스케이프 후 토큰에 색상 부여) */
function highlightJson(json: string) {
  const escaped = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-amber-300";
      if (match.startsWith('"')) cls = match.endsWith(":") ? "text-sky-300" : "text-emerald-300";
      else if (match === "true" || match === "false") cls = "text-violet-300";
      else if (match === "null") cls = "text-slate-500";
      return `<span class="${cls}">${match}</span>`;
    },
  );
}

function CodeBlock({ title, value }: { title: string; value: unknown }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(value, null, 2);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 클립보드 권한이 없으면 무시 */
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </span>
          <span className="ml-2 font-mono text-xs text-slate-400">{title}</span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-slate-200"
        >
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-80 overflow-auto p-4 font-mono text-[12px] leading-relaxed text-slate-300">
        <code dangerouslySetInnerHTML={{ __html: highlightJson(text) }} />
      </pre>
    </div>
  );
}

export default function DbInspector({ data, request }: { data: RecommendResponse; request: SurveyAnswers }) {
  const [open, setOpen] = useState(false);
  const { meta } = data;
  const isLive = meta.source === "supabase";

  const stats = [
    { icon: Server, label: "API Endpoint", value: `${meta.method} ${meta.endpoint}`, mono: true },
    {
      icon: Clock,
      label: "DB 응답 시간",
      value: meta.db_latency_ms != null ? `${meta.db_latency_ms} ms` : "N/A (mock)",
      sub: `API 전체 ${meta.total_latency_ms} ms`,
    },
    { icon: Layers, label: "조회된 레코드", value: `${meta.records_scanned} rows`, sub: `반환 ${data.recommendations.length}건` },
    {
      icon: Database,
      label: "데이터 소스",
      value: isLive ? "Supabase (Live)" : "Fallback (Mock)",
      highlight: isLive ? "text-emerald-600" : "text-amber-600",
    },
  ];

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-5 text-left transition-all duration-200 hover:bg-slate-50 sm:p-6"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Terminal className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block font-bold text-slate-900">System &amp; DB Inspector</span>
          <span className="block text-sm text-slate-500">API 호출 · DB 쿼리 · 응답 데이터 확인</span>
        </span>
        <span
          className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${
            isLive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          <span className={`size-1.5 rounded-full ${isLive ? "bg-emerald-500" : "bg-amber-500"}`} />
          {isLive ? "LIVE" : "MOCK"}
        </span>
        <ChevronDown
          className={`size-5 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 border-t border-slate-100 p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <s.icon className="size-3.5" />
                    {s.label}
                  </div>
                  <div
                    className={`mt-1.5 text-sm font-bold break-all ${s.highlight ?? "text-slate-900"} ${
                      s.mono ? "font-mono text-[13px]" : ""
                    }`}
                  >
                    {s.value}
                  </div>
                  {s.sub && <div className="mt-0.5 text-[11px] text-slate-400">{s.sub}</div>}
                </div>
              ))}
            </div>

            {meta.fallback_reason && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <b>Fallback 사유:</b> {meta.fallback_reason}
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Executed Query</p>
              <code className="block overflow-x-auto rounded-xl bg-slate-100 px-4 py-3 font-mono text-[12px] whitespace-nowrap text-slate-700">
                {meta.query}
              </code>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Request Body</p>
              <CodeBlock title="request.json" value={request} />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Response JSON</p>
              <CodeBlock title={`response.json · ${meta.timestamp}`} value={data} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
