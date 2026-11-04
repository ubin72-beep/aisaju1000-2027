import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "AI 사주 천년지기 | 천년의 지혜, AI로 만나다",
  description: "정통 명리학과 AI가 만나는 프리미엄 사주 상담 플랫폼"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
