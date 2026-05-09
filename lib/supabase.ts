import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const ExpoSecureStoreAdapter = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

// Create a dummy transport for the Node build environment
// this prevents the "Node.js 20 detected" crash
class SetUpEmptyWebSocket {
    constructor() { }
    send() { }
    close() { }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: Platform.OS === 'web' ? undefined : ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    global: {
        // If the environment lacks WebSocket, use our dummy class
        // This stops the Supabase Realtime crash during 'npx expo export'
        fetch: global.fetch,
    },
    // Only inject a custom transport if global WebSocket is missing
    realtime: typeof WebSocket === 'undefined' ? {
        transport: SetUpEmptyWebSocket as any
    } : undefined,
});