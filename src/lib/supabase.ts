import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DB_TIMEOUT_MS = 5000;

/**
 * 서버 전용 Supabase 클라이언트.
 * 환경변수가 없거나 형식이 잘못된 경우 null을 반환 → 호출부에서 Fallback 처리.
 * (Vercel/로컬 모두 SUPABASE_URL, SUPABASE_ANON_KEY 사용. NEXT_PUBLIC_ 접두사도 허용)
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !/^https?:\/\//.test(url)) return null;

  try {
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        // DB가 응답하지 않을 때 API가 무한 대기하지 않도록 타임아웃 설정
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, signal: AbortSignal.timeout(DB_TIMEOUT_MS) }),
      },
    });
  } catch {
    return null;
  }
}

export const MISSING_ENV_REASON = "환경변수 미설정 (SUPABASE_URL / SUPABASE_ANON_KEY)";
