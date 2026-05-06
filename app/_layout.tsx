import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import tw from 'twrnc';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout(): React.JSX.Element {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="budget/[id]"
              options={{
                presentation: 'card',
                animation: 'slide_from_right'
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'New Entry'
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}