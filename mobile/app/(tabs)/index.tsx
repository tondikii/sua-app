import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perjalananku</Text>
      <Text style={styles.subtitle}>Implement in M13</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7FB' },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: '#9091A0', marginTop: 8 },
});
