import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import tw from 'twrnc';

export default function TabLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5', // Indigo-600
        tabBarInactiveTintColor: '#94A3B8', // Slate-400
        headerShown: false,
        // Basic Apple design: Translucent tab bar
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} style={tw`absolute inset-0`} />
          ) : undefined
        ),
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 65,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#FFFFFF',
        },
        tabBarLabelStyle: tw`text-[11px] font-bold pb-1`,
      }}>

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
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />

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
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
    </Tabs>
  );
}