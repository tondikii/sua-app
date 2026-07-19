import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

/** Generic "not yet implemented" screen — used by route stubs landing in later milestones. */
export function ComingSoon({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    padding: theme.spacing.xxl,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: 'center',
  },
});
