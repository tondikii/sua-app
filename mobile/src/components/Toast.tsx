import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import { AlertCircle } from '@/components/icons/AlertCircle';
import { colors } from '@/theme/colors';

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION_MS = 2500;

/**
 * Lightweight non-blocking toast used in place of native Alert for
 * validation/error feedback. Rendered inside a transparent Modal so it
 * works identically on web (where Alert.alert is a no-op) and native.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Modal visible={!!message} transparent animationType="fade">
        <View style={styles.backdrop} pointerEvents="none">
          {message ? (
            <View style={styles.toast}>
              <AlertCircle size={16} color={colors.coral} />
              <Text style={styles.toastText} numberOfLines={2}>{message}</Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 84,
    paddingHorizontal: 32,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  toastText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
    lineHeight: 18,
  },
});
