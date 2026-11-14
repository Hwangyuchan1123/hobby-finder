import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HobbyFinder · 맞춤형 취미 추천",
  description: "8개의 질문으로 나에게 꼭 맞는 취미 Top 3를 찾아보세요. Next.js API Route + Supabase 기반 추천 서비스.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
