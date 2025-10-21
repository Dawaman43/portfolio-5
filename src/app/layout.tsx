import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { bodyFontClass } from "@/lib/fonts";

const siteUrl = "https://dawitworku.tech";
const siteName = "Dawit Worku Portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dawit Worku | Software Engineer & Android Developer",
    template: "%s | Dawit Worku",
  },
  description:
    "Portfolio and blog by Dawit Worku, a 4th year Software Engineering student at Adama Science and Technology University building polished web, Android, and AI experiences.",
  keywords: [
    "Dawit Worku",
    "Software Engineer",
    "Adama Science and Technology University",
    "Android",
    "Next.js",
    "Portfolio",
  ],
  category: "technology",
  authors: [
    {
      name: "Dawit Worku",
      url: siteUrl,
    },
  ],
  creator: "Dawit Worku",
  publisher: "Dawit Worku",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Dawit Worku | Software Engineer & Android Developer",
    description:
      "Dawit Worku is a 4th year Software Engineering student at Adama Science and Technology University crafting end-to-end web and mobile products.",
    url: siteUrl,
    siteName,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dawit Worku | Software Engineer & Android Developer",
    description:
      "Polished experiences across web, Android, and AI from Dawit Worku.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@dawit_codes",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/profile.jpg", type: "image/jpeg", sizes: "192x192" },
      { url: "/profile.jpg", type: "image/jpeg", sizes: "512x512" },
    ],
    apple: "/profile.jpg",
    shortcut: "/favicon.ico",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Dawit Worku",
    email: "mailto:dawitworkujima@gmail.com",
    jobTitle: "Software Engineering Student",
    image: `${siteUrl}/profile.jpg`,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Adama Science and Technology University",
    },
    url: siteUrl,
    sameAs: [
      "https://github.com/dawaman43",
      "https://linkedin.com/in/dawit-worku",
      "https://x.com/dawit_codes",
    ],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`bw-theme ${bodyFontClass} antialiased`}>
        <SiteChrome />
        {children}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
