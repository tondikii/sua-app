import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export type HomeTab = 'mendatang' | 'selesai' | 'undangan';

interface HomeTabsProps {
  activeTab: HomeTab;
  counts: { mendatang: number; selesai: number; undangan: number };
  onChangeTab: (tab: HomeTab) => void;
}

const TABS: { id: HomeTab; label: string }[] = [
  { id: 'mendatang', label: 'Mendatang' },
  { id: 'selesai', label: 'Selesai' },
  { id: 'undangan', label: 'Undangan' },
];

export function HomeTabs({ activeTab, counts, onChangeTab }: HomeTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        const count = counts[tab.id];

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onChangeTab(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Text style={isActive ? styles.labelActive : styles.labelInactive}>
                {tab.label}
              </Text>
              <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
                <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : styles.badgeTextInactive]}>
                  {count}
                </Text>
              </View>
            </View>
            <View style={[styles.underline, isActive && styles.underlineActive]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 22,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  tab: {
    marginRight: 18,
    paddingBottom: 0,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingBottom: 10,
  },
  labelActive: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  labelInactive: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeActive: {
    backgroundColor: colors.coralLight,
  },
  badgeInactive: {
    backgroundColor: colors.light,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  badgeTextActive: {
    color: colors.coral,
  },
  badgeTextInactive: {
    color: colors.muted,
  },
  underline: {
    height: 2.5,
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  underlineActive: {
    backgroundColor: colors.coral,
  },
});
