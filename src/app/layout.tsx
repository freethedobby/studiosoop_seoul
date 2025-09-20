import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import LanguageSelectionWrapper from "@/components/LanguageSelectionWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STUDIOSOOP SEOUL - 프리미엄 뷰티 서비스",
  description:
    "프리미엄 뷰티 서비스로 당신만의 특별한 스타일을 만들어드립니다. STUDIOSOOP SEOUL에서 펼쳐지는 예술적 뷰티 서비스.",
  keywords:
    "뷰티, 스튜디오, 서울, studiosoop, 프리미엄뷰티, 뷰티서비스, 예약제뷰티, 고급뷰티서비스",
  openGraph: {
    title: "STUDIOSOOP SEOUL - 프리미엄 뷰티 서비스",
    description:
      "프리미엄 뷰티 서비스로 당신만의 특별한 스타일을 만들어드립니다.",
    url: "https://studiosoopseoul.com",
    siteName: "STUDIOSOOP SEOUL",
    images: [
      {
        url: "https://studiosoopseoul.com/kakao-thumbnail.png",
        width: 1200,
        height: 630,
        alt: "STUDIOSOOP SEOUL - 프리미엄 뷰티 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STUDIOSOOP SEOUL - 프리미엄 뷰티 서비스",
    description:
      "프리미엄 뷰티 서비스로 당신만의 특별한 스타일을 만들어드립니다.",
    images: ["https://studiosoopseoul.com/kakao-thumbnail.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://studiosoopseoul.com",
  },
};

export const viewport =
  "width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <AuthProvider>
          <LanguageProvider>
            <GoogleAnalytics />
            <LanguageSelectionWrapper />
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
