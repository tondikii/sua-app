import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from '@/components/icons/Image';
import { Video } from '@/components/icons/Video';
import { colors } from '@/theme/colors';

interface Props {
  onPickPhoto: () => void;
  onPickVideo: () => void;
  onClose: () => void;
}

export function ChatAttachMenu({ onPickPhoto, onPickVideo, onClose }: Props) {
  return (
    <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.item} onPress={onPickPhoto} activeOpacity={0.7}>
          <View style={[styles.iconBox, { backgroundColor: colors.tealLight }]}>
            <Image size={16} color={colors.teal} />
          </View>
          <Text style={styles.itemLabel}>Foto</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.item} onPress={onPickVideo} activeOpacity={0.7}>
          <View style={[styles.iconBox, { backgroundColor: colors.coralLight }]}>
            <Video size={16} color={colors.coral} />
          </View>
          <Text style={styles.itemLabel}>Video</Text>
        </TouchableOpacity>
        <View style={styles.noteDivider} />
        <Text style={styles.note}>Foto & video dari chat otomatis masuk tab Media.</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 30,
  },
  menu: {
    position: 'absolute',
    left: 16,
    bottom: 0,
    marginBottom: 8,
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  noteDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
    marginTop: 4,
  },
  note: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginHorizontal: 14,
    marginTop: 8,
    lineHeight: 14,
  },
});
