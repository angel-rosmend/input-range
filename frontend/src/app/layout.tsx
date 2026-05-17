import Link from "next/link";
import "../styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { ROUTES } from "@/utils/routes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Range Component Demo",
  description: "Interactive range with accessibility and mobile support",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav>
          <div>
            <Link href={ROUTES.home}>MANGO</Link>
          </div>
          <div>
            <Link href={ROUTES.exercise1}>Exercise 1</Link>
            <Link href={ROUTES.exercise2}>Exercise 2</Link>
          </div>
        </nav>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
