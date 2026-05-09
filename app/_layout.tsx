import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import tw from 'twrnc';
import { supabase } from '../lib/supabase'; // Ensure this path is correct

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Heading': require('../assets/fonts/Pistilli-Roman.otf'),
  });

  const segments = useSegments();
  const router = useRouter();

  // 1. Handle Font Loading
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // 2. Handle Authentication Routing
  useEffect(() => {
    if (!loaded) return;

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const inAuthGroup = segments[0] === 'login';

      if (!session && !inAuthGroup) {
        // No user and not on login page? Kick to login.
        router.replace('/login');
      } else if (session && inAuthGroup) {
        // User logged in and on login page? Go to dashboard.
        router.replace('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loaded, segments]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Ensure these screen names match your file names in /app */}
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="chat" />
        </Stack>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}