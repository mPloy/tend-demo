// Tend — Supabase client initialization
// Only creates a real client when env vars are configured.
// When unconfigured (demo mode), exports a null-safe stub.
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase is only available when env vars are configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Only create the client when credentials are present — createClient throws
// if the URL is empty, and the demo build has no .env file.
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Required for React Native / Expo
      },
    })
  : (null as unknown as SupabaseClient); // Demo mode — never used
