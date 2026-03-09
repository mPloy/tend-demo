// Tend — Auth service (Supabase auth operations)
import { supabase } from '../lib/supabase';
import type { UserRole } from '../types';

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: { role: UserRole; firstName: string; lastName: string }
) {
  return supabase.auth.signUp({
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
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

export async function getSession() {
  return supabase.auth.getSession();
}
