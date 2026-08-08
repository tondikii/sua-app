import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { X } from '@/components/icons/X';
import { useTheme, type Colors } from '@/theme';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description?: React.ReactNode;
  /** Leading icon rendered in a tinted rounded box (e.g. Trash2 for destructive). */
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Centered confirmation dialog — matches Figma `ConfirmDialogModal`
 * (Screen 95 TripDelete / Screen 68 DeleteVoting).
 */
export function ConfirmModal({
  visible,
  title,
  description,
  icon,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={13} color={c.muted} />
          </TouchableOpacity>

          {icon && <View style={styles.iconWrap}>{icon}</View>}

          <Text style={styles.title}>{title}</Text>

          {description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn]}
              onPress={onCancel}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, destructive ? styles.confirmBtnDanger : styles.confirmBtnPrimary]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color={c.white} />
              ) : (
                <Text style={styles.confirmText}>{confirmLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(c: Colors) {
  return StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  card: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: c.white,
    borderRadius: 20,
    padding: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.24,
    shadowRadius: 56,
    elevation: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: c.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: c.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: c.charcoal,
    textAlign: 'center',
    letterSpacing: -0.2,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: c.muted,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    backgroundColor: c.white,
    borderWidth: 1.5,
    borderColor: c.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: c.charcoal,
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnPrimary: {
    backgroundColor: c.coral,
    shadowColor: c.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 3,
  },
  confirmBtnDanger: {
    backgroundColor: c.danger,
    borderWidth: 1.5,
    borderColor: c.dangerDark,
    shadowColor: c.danger,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 3,
  },
  confirmText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: c.white,
  },
  });
}
