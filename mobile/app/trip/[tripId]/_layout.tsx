import { Tabs } from 'expo-router';

/**
 * Trip detail shell — single screen with inline tabs (Itinerary/Voting/Chat/Media),
 * plus full-screen members (Screen 97–102) and edit (Screen 103) pages.
 * Tab bar is hidden.
 */
export default function TripDetailLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="index" options={{ title: 'Detail' }} />
      <Tabs.Screen name="members" options={{ title: 'Anggota' }} />
      <Tabs.Screen name="edit" options={{ title: 'Edit' }} />
    </Tabs>
  );
}
