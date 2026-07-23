import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell } from '@/components/icons/Bell';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface HomeHeaderProps {
  unreadCount: number;
  onPressBell: () => void;
}

export function HomeHeader({ unreadCount, onPressBell }: HomeHeaderProps) {
  const badgeText = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perjalananku</Text>
      <TouchableOpacity
        style={styles.bellButton}
        onPress={onPressBell}
        activeOpacity={0.7}
      >
        <Bell size={20} color={colors.charcoal} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.white,
  },
});
