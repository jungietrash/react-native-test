import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      // Fixed height to ensure it matches the KeyboardAvoidingView offset
      tabBarStyle: {
        position: 'absolute',
        height: 0,
        borderTopWidth: 0, // Removes the harsh line for a cleaner look
        elevation: 0,
      },
      tabBarBackground: () => (
        <BlurView
          intensity={Platform.OS === 'ios' ? 80 : 100}
          style={StyleSheet.absoluteFill}
          tint="dark" // Changed to dark to match the black branding
        />
      ),
      tabBarActiveTintColor: '#EBC351', // Gold Branding
      tabBarInactiveTintColor: '#666666', // Muted Gray
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="square.grid.2x2.fill"
              tintColor={color}
              fallback={null}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Ask AI',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="sparkles"
              tintColor={color}
              fallback={null}
            />
          ),
        }}
      />
    </Tabs>
  );
}