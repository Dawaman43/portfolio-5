export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassDictionary
  | ClassArray;
export type ClassDictionary = Record<string, unknown>;
export type ClassArray = ClassValue[];

function toVal(mix: ClassValue): string {
  if (typeof mix === "string" || typeof mix === "number") return String(mix);
  if (Array.isArray(mix)) return mix.map(toVal).filter(Boolean).join(" ");
  if (mix && typeof mix === "object") {
    return Object.keys(mix)
      .filter((key) => (mix as ClassDictionary)[key])
      .join(" ");
  }
  return "";
}

export function cn(...inputs: ClassValue[]) {
  const classes = inputs.map(toVal).filter(Boolean).join(" ");
  return classes.split(/\s+/).filter(Boolean).join(" ");
}

export function calculateReadingTime(
  content: string | null,
  wordsPerMinute = 180
): number | null {
  if (!content) {
    return null;
  }
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  if (!words) {
    return null;
  }
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function isNewPost(
  publishedAt: string | null,
  recentWindowDays = 14
): boolean {
  if (!publishedAt) {
    return false;
  }
  const timestamp = Date.parse(publishedAt);
  if (Number.isNaN(timestamp)) {
    return false;
  }
  const windowMs = recentWindowDays * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp < windowMs;
}
