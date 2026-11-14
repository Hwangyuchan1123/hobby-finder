export type LocationPref = "indoor" | "outdoor";
export type SocialPref = "solo" | "group";
export type BudgetPref = "low" | "high";
export type StylePref = "active" | "creative";
export type TimePref = "short" | "long";
export type RewardPref = "output" | "healing" | "growth";
export type EntryPref = "instant" | "gear";
export type MoodPref = "calm" | "dynamic";

/** 설문 응답 (프론트 → POST /api/recommend) */
export interface SurveyAnswers {
  location: LocationPref;
  social: SocialPref;
  budget: BudgetPref;
  style: StylePref;
  time_commitment: TimePref;
  reward: RewardPref;
  entry_barrier: EntryPref;
  mood: MoodPref;
}

/** Supabase `hobbies` 테이블 레코드 */
export interface Hobby {
  id: number;
  name: string;
  emoji: string;
  category: string;
  description: string;
  location: LocationPref | "both";
  social: SocialPref | "both";
  budget: BudgetPref;
  style: StylePref;
  time_commitment: TimePref;
  reward: RewardPref;
  entry_barrier: EntryPref;
  mood: MoodPref;
  monthly_cost: string;
  difficulty: number;
  tags: string[];
  starter_tip: string;
}

export interface Recommendation extends Hobby {
  match_score: number;
  match_reasons: string[];
}

export type DataSource = "supabase" | "fallback";

export interface RecommendMeta {
  endpoint: string;
  method: "POST";
  source: DataSource;
  fallback_reason: string | null;
  db_latency_ms: number | null;
  total_latency_ms: number;
  records_scanned: number;
  query: string;
  scoring_weights: Record<keyof SurveyAnswers, number>;
  timestamp: string;
}

export interface RecommendResponse {
  recommendations: Recommendation[];
  meta: RecommendMeta;
}

export interface HealthResponse {
  connected: boolean;
  mode: DataSource;
  latency_ms: number | null;
  row_count: number | null;
  reason: string | null;
}
