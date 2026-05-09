import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                // ✅ Proper floating dock style
                tabBarStyle: {
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    height: 50,
                    borderRadius: 28,
                    backgroundColor: "transparent",
                    borderTopWidth: 0,
                    elevation: 0,
                },

                tabBarBackground: () => (
                    <BlurView
                        intensity={Platform.OS === "ios" ? 90 : 120}
                        tint="dark"
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                borderRadius: 28,
                                overflow: "hidden",
                            },
                        ]}
                    />
                ),

                tabBarActiveTintColor: "#EBC351",
                tabBarInactiveTintColor: "#666",

                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "700",
                    textTransform: "uppercase",
                },
            }}
        >
            {/* DASHBOARD */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="grid-outline" size={22} color={color} />
                    ),
                }}
            />

            {/* AI CHAT */}
            <Tabs.Screen
                name="chat"
                options={{
                    title: "AI",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="sparkles-outline" size={22} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}