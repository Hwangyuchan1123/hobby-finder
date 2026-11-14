import { Compass } from "lucide-react";
import StatusBadge, { type DbStatus } from "./StatusBadge";

export default function Header({ status, onHome }: { status: DbStatus; onHome: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={onHome}
          className="flex items-center gap-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
          aria-label="처음으로"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Compass className="size-4.5" strokeWidth={2.4} />
          </span>
          <span className="text-[17px] font-bold tracking-tight">HobbyFinder</span>
        </button>
        <StatusBadge status={status} />
      </div>
    </header>
  );
}
