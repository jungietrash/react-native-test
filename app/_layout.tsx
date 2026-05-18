import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import tw from 'twrnc';
import { supabase } from '../lib/supabase';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Heading': require('../assets/fonts/Pistilli-Roman.otf'),
  });

  const segments = useSegments();
  const router = useRouter();

  // Track layout navigation engine mounting status
  const [isNavigationReady, setIsNavigationReady] = useState<boolean>(false);
  // Track initial auth hydration state from Supabase local cache storage
  const [isAuthInitialized, setIsAuthInitialized] = useState<boolean>(false);

  // 1. Handle Font Loading Engine
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // 2. Track Navigation State Mount Lifecycle
  useEffect(() => {
    // This flags true once Expo Router's navigation tree is fully built
    setIsNavigationReady(true);
  }, []);

  // 3. Centralized Guarded Authentication & Routing Engine
  useEffect(() => {
    // Hard blocks until typography assets are ready and the underlying engine mounts
    if (!loaded || !isNavigationReady) return;

    // Fetch initial state explicitly to prevent flashing/race-conditions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthInitialized(true);
      handleRouting(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Once hydrated, handle real-time sign-in/sign-out routing changes smoothly
      if (isAuthInitialized) {
        handleRouting(session);
      }
    });

    // Encapsulated safe routing evaluation
    function handleRouting(session: any) {
      // Cast segments as string[] to stop the 'never' type restriction
      const inAuthGroup = (segments as string[]).includes('login');

      if (!session && !inAuthGroup) {
        router.replace('/login');
      } else if (session && inAuthGroup) {
        router.replace('/');
      }
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loaded, segments, isNavigationReady, isAuthInitialized]);

  // Early return UI tree blocks layout instantiation until fonts execute down correctly
  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Ensure definitions here map explicitly to your app files layout */}
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="chat" />
        </Stack>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}