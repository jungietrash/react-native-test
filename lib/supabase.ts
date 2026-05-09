import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// 1. Safety Check for Environment Variables
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase Environment Variables. Check your .env file.");
}

// 2. Encrypted Storage Adapter (Mobile Only)
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

// 3. Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // We use SecureStore on mobile, but default to localStorage on Web
        storage: Platform.OS === 'web' ? undefined : ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});