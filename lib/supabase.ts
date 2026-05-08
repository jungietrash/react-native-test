import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import ws from 'ws'; // 1. Import the ws package

const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key)
    },
    setItem: (key: string, value: string) => {
        SecureStore.setItemAsync(key, value)
    },
    removeItem: (key: string) => {
        SecureStore.deleteItemAsync(key)
    },
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    // 2. Add this realtime section
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
        transport: ws as any, // This tells Supabase to use 'ws' for WebSockets
    },
})