import { Platform } from 'react-native';
import type { ImperativeRouter } from 'expo-router';

const LAST_TAB_KEY = 'ap_last_tab';

const TAB_ROUTES = ['/', '/search', '/wishlist', '/profile'] as const;

/** Remember the last visited tab so back-navigation survives a browser refresh. */
export function setLastTab(route: string): void {
  if (Platform.OS !== 'web') return;
  try {
    sessionStorage.setItem(LAST_TAB_KEY, route);
  } catch {
    // Storage unavailable — back simply falls back to home.
  }
}

export function getLastTab(): string {
  if (Platform.OS !== 'web') return '/';
  try {
    const stored = sessionStorage.getItem(LAST_TAB_KEY);
    if (stored && (TAB_ROUTES as readonly string[]).includes(stored)) return stored;
  } catch {
    // Fall through to home.
  }
  return '/';
}

/**
 * Back button that works even after a hard refresh on web: when the in-memory
 * navigation stack is gone (no previous screen to pop), go to the last visited
 * tab instead of doing nothing.
 */
export function goBackSmart(router: ImperativeRouter): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(getLastTab() as never);
}
