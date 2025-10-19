import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import { bodyFontClass } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Dawit Worku",
  description: "Personal portfolio of Dawit Worku",
  keywords: ["Dawit Worku", "Portfolio", "Web Development"],
  authors: [{ name: "Dawit Worku", url: "https://dawitworku.com" }],
  openGraph: {
    title: "Dawit Worku",
    description: "Personal portfolio of Dawit Worku",
    url: "https://dawitworku.tech",
    siteName: "Dawit Worku Portfolio",
    images: [
      {
        url: "https://dawitworku.tech/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dawit Worku Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFontClass} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
