import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell } from '@/components/icons/Bell';
import { useTheme } from '@/theme';
import { typography } from '@/theme/typography';

interface HomeHeaderProps {
  unreadCount: number;
  onPressBell: () => void;
}

export function HomeHeader({ unreadCount, onPressBell }: HomeHeaderProps) {
  const { colors: c } = useTheme();
  const insets = useSafeAreaInsets();
  const badgeText = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={[styles.title, { color: c.charcoal }]}>Perjalananku</Text>
      <TouchableOpacity
        style={[styles.bellButton, { backgroundColor: c.light }]}
        onPress={onPressBell}
        activeOpacity={0.7}
      >
        <Bell size={20} color={c.charcoal} />
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: c.coral, borderColor: c.white }]}>
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
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#FFFFFF',
  },
});
