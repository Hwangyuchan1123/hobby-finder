export type DbStatus = {
  state: "checking" | "connected" | "fallback";
  latencyMs?: number | null;
  detail?: string | null;
};

const STYLES = {
  connected: {
    wrap: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    ping: "bg-emerald-400",
    label: "Supabase DB Connected",
    short: "DB Connected",
  },
  fallback: {
    wrap: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    ping: "bg-amber-400",
    label: "Fallback Mode · Mock Data",
    short: "Mock Data",
  },
  checking: {
    wrap: "border-slate-200 bg-white text-slate-500",
    dot: "bg-slate-400",
    ping: "bg-slate-300",
    label: "Checking DB…",
    short: "Checking…",
  },
} as const;

export default function StatusBadge({ status }: { status: DbStatus }) {
  const s = STYLES[status.state];
  const title =
    status.state === "connected"
      ? `Supabase 연결됨${status.latencyMs != null ? ` · ${status.latencyMs}ms` : ""}`
      : status.detail ?? undefined;

  return (
    <div
      title={title}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 ${s.wrap}`}
    >
      <span className="relative flex size-2">
        <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-75 ${s.ping}`} />
        <span className={`relative inline-flex size-2 rounded-full ${s.dot}`} />
      </span>
      <span className="hidden sm:inline">{s.label}</span>
      <span className="sm:hidden">{s.short}</span>
      {status.state === "connected" && status.latencyMs != null && (
        <span className="hidden font-mono text-[11px] font-medium text-emerald-600/80 md:inline">
          {status.latencyMs}ms
        </span>
      )}
    </div>
  );
}
