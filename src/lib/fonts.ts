// Using local fallback stacks instead of next/font/google to avoid Turbopack
// internal font module issues. We preserve the same CSS variable names so
// global styles continue to work. You can later swap these back to next/font
// once the build issue is resolved.
export const geistSans = {
  variable: "",
  className: "",
};

export const geistMono = {
  variable: "",
  className: "",
};

export const inter = {
  variable: "",
  className: "",
};

export const poppins = {
  variable: "",
  className: "",
};

export const playfair = {
  variable: "",
  className: "",
};

export const robotoSlab = {
  variable: "",
  className: "",
};

export const oswald = {
  variable: "",
  className: "",
};

export const iphoneSystem = {
  variable: "--font-iphone-system",
  stack:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

// Helper: combined body class for convenience (expose variables on <body>)
// Without next/font, we don't need to add any font variable classes.
// Keep this empty to avoid adding bogus class names.
export const bodyFontClass = "";

// Optional: export heading & body class names if needed elsewhere
export const headingClass = playfair.variable;
export const bodySansClass = inter.variable;
