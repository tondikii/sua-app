import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle } from '@/components/icons/AlertCircle';
import { CheckCircle } from '@/components/icons/CheckCircle';
import { Info } from '@/components/icons/Info';
import { RefreshCw } from '@/components/icons/RefreshCw';
import { X } from '@/components/icons/X';
import { useTheme } from '@/theme';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  type?: ToastType;
  submessage?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastState {
  message: string;
  options: ToastOptions;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/** Figma Screen 119 — toast tampil selama 3 detik atau ditutup manual. */
const TOAST_DURATION_MS = 3000;

/** Ikon per tipe (lucide) — sukses: check-circle; error: alert-circle; info: info. */
function ToastIcon({ type, color }: { type: ToastType; color: string }) {
  if (type === 'success') return <CheckCircle size={20} color={color} />;
  if (type === 'info') return <Info size={20} color={color} />;
  return <AlertCircle size={20} color={color} />;
}

/**
 * Non-blocking toast host — Figma Screen 119 (Toast & Snackbar).
 * 3 variants:
 * - success: teal background, white text (banner sukses)
 * - error: coral background, white text (default, backward-compatible)
 * - info: white background, charcoal text, border
 * Auto-dismiss 3s, optional action button + manual close.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors: c } = useTheme();
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, options });
    timeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  const type = toast?.options.type ?? 'error';
  const isInfo = type === 'info';

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Modal visible={!!toast} transparent animationType="fade" onRequestClose={dismiss}>
        <View style={styles.backdrop} pointerEvents="box-none">
          {toast ? (
            <View
              style={[
                styles.toast,
                {
                  backgroundColor: isInfo ? c.white : type === 'success' ? c.teal : c.coral,
                  borderColor: isInfo ? c.border : 'transparent',
                  shadowColor: type === 'success' ? c.teal : type === 'error' ? c.coral : '#1A1A2E',
                },
              ]}
            >
              <View style={styles.iconWrap}>
                <ToastIcon
                  type={type}
                  color={isInfo ? c.teal : '#FFFFFF'}
                />
              </View>

              <View style={styles.body}>
                <Text
                  style={[
                    styles.message,
                    { color: isInfo ? c.charcoal : '#FFFFFF' },
                  ]}
                  numberOfLines={2}
                >
                  {toast.message}
                </Text>
                {toast.options.submessage && (
                  <Text
                    style={[
                      styles.submessage,
                      { color: isInfo ? c.muted : 'rgba(255,255,255,0.75)' },
                    ]}
                    numberOfLines={2}
                  >
                    {toast.options.submessage}
                  </Text>
                )}
                {toast.options.actionLabel && toast.options.onAction && (
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: isInfo ? c.coralLight : 'rgba(255,255,255,0.22)',
                        borderColor: isInfo ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.35)',
                      },
                    ]}
                    onPress={() => {
                      toast.options.onAction?.();
                      dismiss();
                    }}
                    activeOpacity={0.8}
                  >
                    <RefreshCw size={11} color={isInfo ? c.coral : '#FFFFFF'} />
                    <Text style={[styles.actionText, { color: isInfo ? c.coral : '#FFFFFF' }]}>
                      {toast.options.actionLabel}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.closeBtn,
                  { backgroundColor: isInfo ? c.light : 'rgba(255,255,255,0.18)' },
                ]}
                onPress={dismiss}
                activeOpacity={0.8}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <X size={12} color={isInfo ? c.muted : '#FFFFFF'} />
              </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: 360,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 10,
  },
  iconWrap: {
    marginTop: 1,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 20,
  },
  submessage: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 17,
    marginTop: 3,
  },
  actionBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
