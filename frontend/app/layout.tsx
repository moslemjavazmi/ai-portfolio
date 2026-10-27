
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthBootstrap } from "./providers";
import PortfolioAssistant from "@/components/portfolio/PortfolioAssistant";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "پرتفولیو | Full-Stack Developer",
  description: "رزومه و پروژه‌های من",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="ltr">
      <body className={`${vazir.variable} font-sans antialiased`}>
        <AuthBootstrap>{children}</AuthBootstrap>
        <PortfolioAssistant />
      </body>
    </html>
  );
}