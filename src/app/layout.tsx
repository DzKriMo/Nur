import type { Metadata, Viewport } from "next";
import { Inter, Amiri, Reem_Kufi } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientProviders from "@/components/providers/ClientProviders";
import PwaRegister from "@/components/PwaRegister";
import PinchZoomReset from "@/components/PinchZoomReset";
import { SITE_URL, SITE_NAME, SITE_NAME_EN, SITE_DESCRIPTION, SITE_DESCRIPTION_EN } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });
const reemKufi = Reem_Kufi({ subsets: ["arabic", "latin"], variable: "--font-reem-kufi" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s - نور`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "قرآن",
    "القرآن الكريم",
    "الحديث الشريف",
    "صحيح البخاري",
    "الأذكار",
    "أوقات الصلاة",
    "قصص الأنبياء",
    "تطبيق إسلامي",
    "Quran",
    "Hadith",
    "Sahih al-Bukhari",
    "Adhkar",
    "Islamic app",
    "Nur",
  ],
  applicationName: "نور",
  authors: [{ name: "نور" }],
  creator: "نور",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ar_AR",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1280,
        height: 853,
        alt: SITE_NAME_EN,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME_EN,
    description: SITE_DESCRIPTION_EN,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "نور",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} ${reemKufi.variable} antialiased bg-parchment-50 dark:bg-night-950 text-slate-900 dark:text-slate-50`}>
        <ClientProviders>
          <Navbar />
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer />
        </ClientProviders>
        <PwaRegister />
        <PinchZoomReset />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              alternateName: SITE_NAME_EN,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              inLanguage: "ar",
            }),
          }}
        />
      </body>
    </html>
  );
}
