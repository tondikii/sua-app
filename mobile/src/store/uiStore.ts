import { create } from 'zustand';

/**
 * Ephemeral UI state only (active tab, draft inputs, sheet visibility, …).
 *
 * Auth lives in `src/auth/AuthProvider.tsx` — do NOT store tokens or user state
 * here. Per ARCHITECTURE §5.1 this store is for non-persisted UI state; it is
 * intentionally reset on every app launch.
 */
export type BottomTab = 'index' | 'search' | 'wishlist' | 'profile';

interface UiState {
  /** Last active bottom tab — used to restore focus after returning from a modal/deep link. */
  lastTab: BottomTab;
  setLastTab: (tab: BottomTab) => void;
}

export const useUiStore = create<UiState>((set) => ({
  lastTab: 'index',
  setLastTab: (tab) => set({ lastTab: tab }),
}));
