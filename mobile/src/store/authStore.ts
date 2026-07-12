import { create } from 'zustand';

interface AuthState {
  token: string | null;
  realtimeToken: string | null;
  isNewUser: boolean;
  setAuth: (token: string, realtimeToken: string, isNewUser: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  realtimeToken: null,
  isNewUser: false,
  setAuth: (token, realtimeToken, isNewUser) => set({ token, realtimeToken, isNewUser }),
  clearAuth: () => set({ token: null, realtimeToken: null, isNewUser: false }),
}));
