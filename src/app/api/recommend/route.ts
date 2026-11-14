import { NextResponse } from "next/server";
import { FALLBACK_HOBBIES } from "@/lib/fallback-hobbies";
import { parseAnswers, rankHobbies, WEIGHTS } from "@/lib/matching";
import { getSupabase, MISSING_ENV_REASON } from "@/lib/supabase";
import type { DataSource, Hobby, RecommendResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const ENDPOINT = "/api/recommend";

export async function POST(request: Request) {
  const startedAt = performance.now();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "요청 본문이 올바른 JSON이 아닙니다." }, { status: 400 });
  }

  const answers = parseAnswers(body);
  if (!answers) {
    return NextResponse.json({ error: "설문 응답 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const locationFilter = [answers.location, "both"];
  let query = `SELECT * FROM hobbies WHERE location IN ('${locationFilter.join("', '")}')`;

  let hobbies: Hobby[] = [];
  let source: DataSource = "supabase";
  let fallbackReason: string | null = null;
  let dbLatencyMs: number | null = null;

  const supabase = getSupabase();

  if (!supabase) {
    source = "fallback";
    fallbackReason = MISSING_ENV_REASON;
  } else {
    try {
      const dbStart = performance.now();
      // 1차: 장소 조건으로 DB 레벨 필터링
      const { data, error } = await supabase.from("hobbies").select("*").in("location", locationFilter);
      if (error) throw new Error(error.message || "Supabase 쿼리 오류");

      let rows = (data ?? []) as Hobby[];

      // 2차: 후보가 3개 미만이면 전체 테이블로 확장 조회
      if (rows.length < 3) {
        const all = await supabase.from("hobbies").select("*");
        if (all.error) throw new Error(all.error.message || "Supabase 쿼리 오류");
        rows = (all.data ?? []) as Hobby[];
        query = "SELECT * FROM hobbies";
      }

      dbLatencyMs = Math.round((performance.now() - dbStart) * 10) / 10;

      if (rows.length === 0) {
        source = "fallback";
        fallbackReason = "hobbies 테이블이 비어 있습니다 (supabase_setup.sql 실행 필요)";
      } else {
        hobbies = rows;
      }
    } catch (err) {
      source = "fallback";
      fallbackReason = `Supabase 연결 실패: ${err instanceof Error ? err.message : String(err)}`;
      dbLatencyMs = null;
    }
  }

  if (source === "fallback") {
    hobbies = FALLBACK_HOBBIES.filter((h) => locationFilter.includes(h.location));
    if (hobbies.length < 3) hobbies = FALLBACK_HOBBIES;
    query = `[MOCK] ${query}`;
  }

  const recommendations = rankHobbies(hobbies, answers, 3);

  const payload: RecommendResponse = {
    recommendations,
    meta: {
      endpoint: ENDPOINT,
      method: "POST",
      source,
      fallback_reason: fallbackReason,
      db_latency_ms: dbLatencyMs,
      total_latency_ms: Math.round((performance.now() - startedAt) * 10) / 10,
      records_scanned: hobbies.length,
      query,
      scoring_weights: WEIGHTS,
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(payload);
}
