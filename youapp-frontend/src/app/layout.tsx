import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouApp - Social Profile & Interest Matching",
  description: "Create and manage your social profile with Zodiac & Horoscope calculation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#09141A]`}>
        <div className="flex flex-col items-center justify-start min-h-screen">
          <div className="w-full max-w-[430px] min-h-screen bg-transparent shadow-2xl relative overflow-x-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
