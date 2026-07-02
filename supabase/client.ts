import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

console.log("SUPABASE INITIALIZATION URL:", supabaseUrl);

// Previene caídas durante la generación estática (SSG) de Expo Web en Node.js
if (typeof global.WebSocket === "undefined") {
  (global as any).WebSocket = class {};
}

// Almacenamiento seguro para SSR / SSG
const safeStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") {
      return null;
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") {
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") {
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
