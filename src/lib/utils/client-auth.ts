'use client';

import type { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/types';

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = SignInData & {
  username: string;
};

export async function signIn(
  supabase: SupabaseClient<Database>,
  { email, password }: SignInData
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUp(
  supabase: SupabaseClient<Database>,
  { email, password, username }: SignUpData
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error('User was not created');
  }

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    username,
    display_name: username,
    is_private: false,
    is_verified: false,
  });

  if (profileError) {
    // If profile creation fails, delete the auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw profileError;
  }

  return authData;
}

export async function signOut(supabase: SupabaseClient<Database>) {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function resetPassword(
  supabase: SupabaseClient<Database>,
  email: string
) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    throw error;
  }
}

export async function updatePassword(
  supabase: SupabaseClient<Database>,
  newPassword: string
) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
} 