import {
  Geist,
  Geist_Mono,
  Oswald,
  Inter,
  Poppins,
  Playfair_Display,
  Roboto_Slab,
} from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const iphoneSystem = {
  variable: "--font-iphone-system",
  stack:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

// Helper: combined body class for convenience (expose variables on <body>)
export const bodyFontClass = [
  geistSans.variable,
  geistMono.variable,
  inter.variable,
  playfair.variable,
  poppins.variable,
  robotoSlab.variable,
  oswald.variable,
]
  .filter(Boolean)
  .join(" ");

// Optional: export heading & body class names if needed elsewhere
export const headingClass = playfair.variable;
export const bodySansClass = inter.variable;
