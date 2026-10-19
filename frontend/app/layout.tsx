// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { AuthBootstrap } from "./providers";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// export const metadata: Metadata = {
//   title: "ChatBot — گفتگوی هوشمند",
//   description: "پلتفرم حرفه‌ای چت‌بات",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fa" dir="rtl">
//       <body className={`${inter.variable} font-sans`}>
//         <AuthBootstrap>{children}</AuthBootstrap>
//       </body>
//     </html>
//   );
// }



import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthBootstrap } from "./providers";
import { AskBar } from "@/components/AskBar";

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
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} font-sans antialiased`}>
        <AuthBootstrap>{children}</AuthBootstrap>
        {/* نوار پرسش روی همه صفحات */}
        <AskBar />
      </body>
    </html>
  );
}