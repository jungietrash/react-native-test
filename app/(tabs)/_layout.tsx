import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            // Fixed height to ensure it matches the KeyboardAvoidingView offset
            tabBarStyle: {
                position: 'absolute',
                height: 0,
                bottom: -20,
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

        </Tabs>
    );
}