// Tend — Auth context provider
// Supports dual-mode: real Supabase auth OR demo mode with mock data
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserRole } from '../types';
import type { ProfileRow } from '../lib/database.types';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  role: UserRole | null;
  isLoading: boolean;
  isDemo: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, metadata: { role: UserRole; firstName: string; lastName: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  enterDemoMode: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    role: null,
    isLoading: true,
    isDemo: false,
  });

  // Load session on mount
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // No Supabase configured — go straight to demo-ready state
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }

    // Get existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadProfile(session.user.id).then((profile) => {
          setState({
            session,
            user: session.user,
            profile,
            role: profile?.role as UserRole || null,
            isLoading: false,
            isDemo: false,
          });
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const profile = await loadProfile(session.user.id);
          setState({
            session,
            user: session.user,
            profile,
            role: profile?.role as UserRole || null,
            isLoading: false,
            isDemo: false,
          });
        } else {
          setState({
            session: null,
            user: null,
            profile: null,
            role: null,
            isLoading: false,
            isDemo: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.warn('Failed to load profile:', error.message);
      return null;
    }
    return data as ProfileRow;
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured. Use demo mode.' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: { role: UserRole; firstName: string; lastName: string }
  ) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured. Use demo mode.' };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: metadata.role,
          firstName: metadata.firstName,
          lastName: metadata.lastName,
        },
      },
    });
    return { error: error?.message || null };
  };

  const signOut = async () => {
    if (state.isDemo) {
      setState({
        session: null,
        user: null,
        profile: null,
        role: null,
        isLoading: false,
        isDemo: false,
      });
      return;
    }
    await supabase.auth.signOut();
  };

  const enterDemoMode = (role: UserRole) => {
    // Create a fake profile for demo mode
    const demoProfiles: Record<UserRole, ProfileRow> = {
      elder: {
        id: 'elder-1',
        role: 'elder',
        first_name: 'Margaret',
        last_name: 'Chen',
        street_address: '2156 West 4th Avenue',
        city: 'Vancouver',
        province: 'BC',
        postal_code: 'V6K 1A1',
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      helper: {
        id: 'helper-1',
        role: 'helper',
        first_name: 'Sarah',
        last_name: 'Williams',
        street_address: '888 Hamilton Street',
        city: 'Vancouver',
        province: 'BC',
        postal_code: 'V6B 2W9',
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      family: {
        id: 'family-1',
        role: 'family',
        first_name: 'Jennifer',
        last_name: 'Chen',
        street_address: null,
        city: 'Toronto',
        province: 'ON',
        postal_code: 'M5V 2T6',
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    setState({
      session: null,
      user: null,
      profile: demoProfiles[role],
      role,
      isLoading: false,
      isDemo: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
