import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";

import ws from "ws";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Native storage
 */
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) =>
        SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

/**
 * Web storage
 */
const WebStorage = {
    getItem: async (key: string) => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(key);
    },

    setItem: async (key: string, value: string) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value);
    },

    removeItem: async (key: string) => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    },
};

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            storage:
                Platform.OS === "web"
                    ? WebStorage
                    : ExpoSecureStoreAdapter,

            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },

        realtime: {
            transport: ws as any,
        },
    }
);