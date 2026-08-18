import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ClientProviders from "@/components/providers/ClientProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "Nur - Islamic App",
  description: "Quran, Hadith, Adhkar, Prayer Times, and AI Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50`}>
        <ClientProviders>
          <Navbar />
          <main className="pb-16 md:pb-0">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
