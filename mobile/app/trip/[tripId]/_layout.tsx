import { Tabs } from 'expo-router';

/**
 * Trip detail shell — 4 content tabs + manage. Tab bar is hidden;
 * navigation uses a custom header in each screen instead.
 */
export default function TripDetailLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="index" options={{ title: 'Itinerary' }} />
      <Tabs.Screen name="voting" options={{ title: 'Voting' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="media" options={{ title: 'Media' }} />
      <Tabs.Screen name="manage" options={{ title: 'Kelola' }} />
    </Tabs>
  );
}
