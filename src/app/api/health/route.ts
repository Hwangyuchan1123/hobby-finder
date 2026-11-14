import { NextResponse } from "next/server";
import { getSupabase, MISSING_ENV_REASON } from "@/lib/supabase";
import type { HealthResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

/** 헤더의 DB 상태 배지가 실제 연결 상태를 반영하도록 사용하는 헬스체크 */
export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json<HealthResponse>({
      connected: false,
      mode: "fallback",
      latency_ms: null,
      row_count: null,
      reason: MISSING_ENV_REASON,
    });
  }

  const start = performance.now();
  try {
    const { count, error } = await supabase.from("hobbies").select("id", { count: "exact", head: true });
    const latency = Math.round((performance.now() - start) * 10) / 10;

    if (error) {
      return NextResponse.json<HealthResponse>({
        connected: false,
        mode: "fallback",
        latency_ms: latency,
        row_count: null,
        reason: error.message || "hobbies 테이블 조회 실패",
      });
    }

    return NextResponse.json<HealthResponse>({
      connected: true,
      mode: "supabase",
      latency_ms: latency,
      row_count: count ?? null,
      reason: null,
    });
  } catch (err) {
    return NextResponse.json<HealthResponse>({
      connected: false,
      mode: "fallback",
      latency_ms: null,
      row_count: null,
      reason: err instanceof Error ? err.message : "알 수 없는 오류",
    });
  }
}
