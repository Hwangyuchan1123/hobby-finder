import type { Hobby, Recommendation, SurveyAnswers } from "./types";

/** 항목별 가중치 (합계 100) */
export const WEIGHTS: Record<keyof SurveyAnswers, number> = {
  location: 15,
  social: 15,
  budget: 10,
  style: 15,
  time_commitment: 10,
  reward: 15,
  entry_barrier: 10,
  mood: 10,
};

const LABELS = {
  location: { indoor: "실내 활동", outdoor: "야외 활동", both: "실내·야외 모두 가능" },
  social: { solo: "혼자 몰입", group: "함께하는 즐거움", both: "혼자도, 함께도 OK" },
  budget: { low: "가성비 시작", high: "장비 투자형" },
  style: { active: "몸을 움직이는 활동", creative: "창작·정적 활동" },
  time_commitment: { short: "틈틈이 가볍게", long: "주말 몰입형" },
  reward: { output: "결과물이 남는", healing: "스트레스 해소·힐링", growth: "체력·실력 성장" },
  entry_barrier: { instant: "바로 시작 가능", gear: "장비 갖추는 재미" },
  mood: { calm: "차분·감성 무드", dynamic: "역동·트렌디 무드" },
} as const;

/** 질문별 부분 점수 비율 (0 ~ 1) */
function partial(key: keyof SurveyAnswers, hobbyValue: string, answer: string): number {
  if (hobbyValue === answer) return 1;
  switch (key) {
    case "location":
    case "social":
      return hobbyValue === "both" ? 0.8 : 0;
    case "budget":
      // 투자 가능한 사람에게 가성비 취미도 충분히 어울림
      return answer === "high" && hobbyValue === "low" ? 0.6 : 0;
    case "entry_barrier":
      // 장비를 갖추고 싶은 사람에게 바로 시작 가능한 취미는 절반 점수
      return answer === "gear" && hobbyValue === "instant" ? 0.5 : 0;
    default:
      return 0;
  }
}

function scoreHobby(hobby: Hobby, a: SurveyAnswers) {
  let score = 0;
  const reasons: string[] = [];

  for (const key of Object.keys(WEIGHTS) as (keyof SurveyAnswers)[]) {
    const hobbyValue = hobby[key] as string;
    const ratio = partial(key, hobbyValue, a[key]);
    if (ratio === 0) continue;
    score += WEIGHTS[key] * ratio;

    // 정확히 일치했거나 'both'로 맞춘 경우만 매칭 이유로 표시
    const labels = LABELS[key] as Record<string, string>;
    if (ratio === 1) reasons.push(labels[a[key]]);
    else if (hobbyValue === "both") reasons.push(labels.both);
  }

  return { score: Math.round(score), reasons };
}

/** 점수 내림차순, 동점이면 난이도가 낮은(입문하기 쉬운) 순 */
export function rankHobbies(hobbies: Hobby[], answers: SurveyAnswers, limit = 3): Recommendation[] {
  return hobbies
    .map((h) => {
      const { score, reasons } = scoreHobby(h, answers);
      return { ...h, match_score: score, match_reasons: reasons };
    })
    .sort((x, y) => y.match_score - x.match_score || x.difficulty - y.difficulty)
    .slice(0, limit);
}

const ALLOWED: Record<keyof SurveyAnswers, readonly string[]> = {
  location: ["indoor", "outdoor"],
  social: ["solo", "group"],
  budget: ["low", "high"],
  style: ["active", "creative"],
  time_commitment: ["short", "long"],
  reward: ["output", "healing", "growth"],
  entry_barrier: ["instant", "gear"],
  mood: ["calm", "dynamic"],
};

export function parseAnswers(body: unknown): SurveyAnswers | null {
  if (!body || typeof body !== "object") return null;
  const src = body as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of Object.keys(ALLOWED) as (keyof SurveyAnswers)[]) {
    const v = src[key];
    if (typeof v !== "string" || !ALLOWED[key].includes(v)) return null;
    out[key] = v;
  }
  return out as unknown as SurveyAnswers;
}
