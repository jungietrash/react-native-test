import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import tw from 'twrnc';

/**
 * CORE FUNDAMENTALS DEMONSTRATED:
 * 1. Platform-Specific UI: Different styling for iOS/Android.
 * 2. Translucency: Utilizing BlurView for Apple's glassmorphism effect.
 * 3. Haptics: Providing tactile feedback on navigation.
 * 4. Conditional Rendering: Changing icons based on 'focused' state.
 */

export default function TabLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5', // Indigo-600
        tabBarInactiveTintColor: '#94A3B8', // Slate-400
        headerShown: false,

        // --- FUNDAMENTAL: CUSTOM TAB BAR BACKGROUND ---
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <View style={tw`absolute inset-0 bg-white/70 overflow-hidden`}>
              {/* SAFE-CHECK: Wrapping BlurView in a View with a background color 
                  fallback prevents "Unimplemented Component" crashes 
               */}
              <BlurView intensity={80} tint="light" style={tw`flex-1`} />
            </View>
          ) : (
            <View style={tw`absolute inset-0 bg-white border-t border-gray-100`} />
          )
        ),

        // --- FUNDAMENTAL: TAB BAR STYLING ---
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          // Transparent on iOS to let BlurView shine through
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#FFFFFF',
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: tw`text-[11px] font-bold`,
      }}>

      {/* --- BUDGETS TAB --- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            // FUNDAMENTAL: UX Feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />

      {/* --- INSIGHTS/EXPLORE TAB --- */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
    </Tabs>
  );
}