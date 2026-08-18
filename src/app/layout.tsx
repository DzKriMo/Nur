import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientProviders from "@/components/providers/ClientProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: {
    default: "Nur - Islamic App",
    template: "%s | Nur",
  },
  description: "Nur is your companion for Quran, Hadith, Adhkar, prayer times, and an AI assistant — all in one beautiful, modern Islamic app.",
  keywords: ["Quran", "Hadith", "Adhkar", "Islamic app", "prayer times", "Sahih al-Bukhari", "Nur"],
  applicationName: "Nur",
  authors: [{ name: "Nur" }],
  openGraph: {
    title: "Nur - Islamic App",
    description: "Your companion for Quran, Hadith, Adhkar, prayer times, and an AI assistant.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
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
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
