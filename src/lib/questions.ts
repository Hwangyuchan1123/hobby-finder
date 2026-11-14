import {
  Brush,
  CalendarDays,
  Dumbbell,
  Gem,
  Home,
  Leaf,
  Moon,
  Palette,
  Smartphone,
  Timer,
  Trees,
  TrendingUp,
  User,
  Users,
  Wallet,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { SurveyAnswers } from "./types";

export interface QuestionOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface Question {
  key: keyof SurveyAnswers;
  eyebrow: string;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    key: "location",
    eyebrow: "활동 장소",
    title: "어디에서 시간을 보낼 때\n가장 편안한가요?",
    subtitle: "주로 머무르고 싶은 공간을 골라주세요.",
    options: [
      { value: "indoor", label: "실내", description: "아늑한 방, 카페, 스튜디오 같은 공간", icon: Home },
      { value: "outdoor", label: "실외", description: "공원, 한강, 산처럼 탁 트인 곳", icon: Trees },
    ],
  },
  {
    key: "social",
    eyebrow: "에너지 방향",
    title: "어떤 방식으로\n에너지를 충전하나요?",
    subtitle: "취미를 즐기는 모습을 떠올려 보세요.",
    options: [
      { value: "solo", label: "혼자 집중", description: "나만의 페이스로 깊게 몰입하고 싶어요", icon: User },
      { value: "group", label: "사람들과 함께", description: "같이 웃고 떠들며 즐기는 게 좋아요", icon: Users },
    ],
  },
  {
    key: "budget",
    eyebrow: "예산 수준",
    title: "취미에 얼마나\n투자할 수 있나요?",
    subtitle: "초기 장비와 월 유지비를 기준으로 생각해 주세요.",
    options: [
      { value: "low", label: "가성비 우선", description: "부담 없이 가볍게 시작하고 싶어요", icon: Wallet },
      { value: "high", label: "장비 투자 가능", description: "제대로 하려면 투자도 괜찮아요", icon: Gem },
    ],
  },
  {
    key: "style",
    eyebrow: "선호 스타일",
    title: "어떤 활동에\n더 끌리나요?",
    subtitle: "직감적으로 마음이 가는 쪽을 골라주세요.",
    options: [
      { value: "active", label: "몸을 움직이는 활동", description: "땀 흘리고 나면 개운한 스타일", icon: Dumbbell },
      { value: "creative", label: "창작 · 정적 활동", description: "손으로 만들고 생각하는 스타일", icon: Palette },
    ],
  },
  {
    key: "time_commitment",
    eyebrow: "시간 투자",
    title: "취미에 쓸 수 있는\n시간은 어느 정도인가요?",
    subtitle: "일주일 중 현실적으로 낼 수 있는 시간을 떠올려 보세요.",
    options: [
      { value: "short", label: "틈틈이 가볍게", description: "평일 저녁 30분~1시간 정도", icon: Timer },
      { value: "long", label: "주말에 몰입", description: "한 번에 반나절 이상도 OK", icon: CalendarDays },
    ],
  },
  {
    key: "reward",
    eyebrow: "보상 · 성취 방식",
    title: "취미를 마친 뒤\n어떤 기분이면 좋겠어요?",
    subtitle: "가장 큰 만족을 주는 보상을 하나 골라주세요.",
    options: [
      { value: "output", label: "결과물이 남는", description: "작품·사진·물건처럼 눈에 보이는 성과", icon: Brush },
      { value: "healing", label: "힐링 · 스트레스 해소", description: "머리를 비우고 마음이 편안해지는 시간", icon: Leaf },
      { value: "growth", label: "체력 · 실력 성장", description: "어제보다 나아지는 내가 느껴지는 것", icon: TrendingUp },
    ],
  },
  {
    key: "entry_barrier",
    eyebrow: "입문 장벽",
    title: "어떻게 시작하는 게\n더 끌리나요?",
    subtitle: "준비물에 대한 부담 정도를 알려주세요.",
    options: [
      { value: "instant", label: "지금 바로 시작", description: "맨몸이나 스마트폰만으로 오늘 당장", icon: Smartphone },
      { value: "gear", label: "장비 갖추고 시작", description: "전용 도구를 고르고 세팅하는 것도 재미", icon: Wrench },
    ],
  },
  {
    key: "mood",
    eyebrow: "분위기 · 감성",
    title: "어떤 분위기의 취미가\n나와 잘 어울리나요?",
    subtitle: "마지막 질문이에요!",
    options: [
      { value: "calm", label: "차분하고 감성적인", description: "잔잔한 음악이 어울리는 고요한 무드", icon: Moon },
      { value: "dynamic", label: "역동적이고 트렌디한", description: "에너지 넘치고 요즘 핫한 무드", icon: Zap },
    ],
  },
];

export function getOptionLabel(key: keyof SurveyAnswers, value: string | undefined) {
  return QUESTIONS.find((q) => q.key === key)?.options.find((o) => o.value === value)?.label ?? "-";
}
