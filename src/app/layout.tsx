import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";
import CursorSakura from "@/components/fx/CursorSakura";
import Preloader from "@/components/fx/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Rudraksh Sharma — Web Developer & Python Enthusiast",
  description:
    "Awwwards-winning cinematic portfolio of Rudraksh Sharma: B.Tech IT student, Python developer and AWS certified CloudOps engineer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${cormorant.variable} antialiased`}>
      <body className="grain bg-ink text-bone">
        <Preloader />
        <CursorSakura />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
