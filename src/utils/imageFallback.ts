/**
 * Image Fallback Utilities for HushAPK
 * Provides elegant inline SVG placeholders to prevent broken images and layout shifts.
 */

// SVG App Icon placeholder (Dark slate with emerald shield)
export const DEFAULT_APP_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128' fill='none'%3E%3Crect width='128' height='128' rx='28' fill='%231e293b'/%3E%3Cpath d='M64 24L36 36v32c0 22.4 12 43.2 28 48 16-4.8 28-25.6 28-48V36L64 24z' fill='%2310b981' fill-opacity='0.2' stroke='%2310b981' stroke-width='4' stroke-linejoin='round'/%3E%3Cpath d='M52 64l8 8 16-16' stroke='%2310b981' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

// SVG Screenshot placeholder
export const DEFAULT_SCREENSHOT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240' fill='none'%3E%3Crect width='400' height='240' rx='16' fill='%230f172a' stroke='%23334155' stroke-width='2'/%3E%3Cpath d='M160 100l30 35 25-20 45 50H140l20-65z' fill='%2310b981' fill-opacity='0.25'/%3E%3Ccircle cx='170' cy='80' r='12' fill='%2310b981' fill-opacity='0.4'/%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='12'%3EApplication Preview%3C/text%3E%3C/svg%3E";

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl: string = DEFAULT_APP_ICON) {
  const target = e.currentTarget;
  if (target.src !== fallbackUrl) {
    target.onerror = null; // Prevent loop
    target.src = fallbackUrl;
  }
}
