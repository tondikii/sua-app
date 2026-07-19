import { Tabs } from 'expo-router';

/**
 * Trip detail shell — 4 content tabs + manage. Counter rules (Itinerary hidden
 * when empty, Chat unread-only, etc.) are applied in M13/M14.
 */
export default function TripDetailLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Itinerary' }} />
      <Tabs.Screen name="voting" options={{ title: 'Voting' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="media" options={{ title: 'Media' }} />
      <Tabs.Screen name="manage" options={{ title: 'Kelola' }} />
    </Tabs>
  );
}
