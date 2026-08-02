import { Linking } from 'react-native';

/**
 * Normalize a user-supplied URL (e.g. "instagram.com/budi") so it can be
 * opened by Linking — bare hosts get an https:// prefix.
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** Open an external URL, swallowing failures (e.g. missing app handler). */
export function openExternalLink(url: string): void {
  const target = normalizeUrl(url);
  if (!target) return;
  Linking.openURL(target).catch(() => {});
}
