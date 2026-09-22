/**
 * URL Security Utilities for HushAPK
 * Enforces strict external redirect policies:
 * - Only http:// and https:// URLs allowed
 * - Reject javascript:, data:, file:, blob:, vbscript:
 * - Prevents open redirect attacks & unsafe browser execution
 */

export function isValidExternalDownloadUrl(urlStr: string | null | undefined): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  const lower = trimmed.toLowerCase();

  // Explicitly reject harmful protocol schemes
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('blob:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('intent:') ||
    lower.startsWith('market:')
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function openExternalDownloadUrl(url: string | null | undefined, fallbackPrompt?: string): boolean {
  if (!url || !isValidExternalDownloadUrl(url)) {
    console.warn('Rejected unsafe or invalid download redirect URL:', url);
    if (fallbackPrompt) {
      alert(`Invalid download URL: ${fallbackPrompt}`);
    }
    return false;
  }

  // Strictly open in new tab with noopener & noreferrer
  window.open(url.trim(), '_blank', 'noopener,noreferrer');
  return true;
}
