import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import ws from 'ws'; //

const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
        if (Platform.OS === 'web') {
            return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        }
        return SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },
    removeItem: async (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    },
};

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseUrl = "https://gjlgirgyyaujjsapeisv.supabase.co";
const supabaseAnonKey = "sb_publishable_Bunl5ouET78wABgzDvZSgQ_qyaGR4bz";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    // Add this block to fix the Node.js 20 WebSocket error
    realtime: {
        transport: ws as any, //
    },
});