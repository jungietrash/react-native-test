import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#EBC351",
                tabBarInactiveTintColor: "#666",

                // Position labels and icons
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    marginBottom: 4,
                },
                tabBarItemStyle: {
                    paddingVertical: 5,
                },

                // Floating Dock Styling
                tabBarStyle: {
                    position: "absolute",
                    borderTopWidth: 0,
                    elevation: 0,
                    // Center the dock and give it breathing room
                    bottom: Platform.OS === 'ios' ? 25 : 15,
                    left: 20,
                    right: 20,
                    height: 64,
                    borderRadius: 32,
                    // Essential for Android transparency
                    backgroundColor: 'transparent',
                    // shadow for Android/Web visibility
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                },

                tabBarBackground: () => (
                    <View style={StyleSheet.absoluteFill}>
                        {Platform.OS === 'ios' ? (
                            <BlurView
                                intensity={80}
                                tint="dark"
                                style={[
                                    StyleSheet.absoluteFill,
                                    { borderRadius: 32, overflow: "hidden", borderColor: '#222' },
                                ]}
                            />
                        ) : (
                            /* 
                               Android Fallback: BlurView is hit-or-miss on Android. 
                               Semi-transparent solid color is standard for "Glassmorphism" on Android.
                            */
                            <View
                                style={[
                                    StyleSheet.absoluteFill,
                                    {
                                        backgroundColor: 'rgba(18, 18, 18, 0.94)',
                                        borderRadius: 32,
                                        borderWidth: 1,
                                        borderColor: '#222'
                                    }
                                ]}
                            />
                        )}
                    </View>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "grid" : "grid-outline"}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="chat"
                options={{
                    title: "AI",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "sparkles" : "sparkles-outline"}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Assuming you have a profile/settings route for that signout we made */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Account",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}