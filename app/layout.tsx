import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ILove2Convert - Every PDF tool you need",
  description: "Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks. 100% free and easy to use.",
  keywords: "PDF tools, merge PDF, split PDF, compress PDF, PDF to Word, JPG to PDF, free PDF converter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  return (
    <html lang="en">
      <body className={inter.className}>
        {adsenseId && adsenseId !== "ca-pub-XXXXXXXXXXXXXXXX" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
