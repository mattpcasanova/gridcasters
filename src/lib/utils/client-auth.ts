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
  console.log('Client auth: Starting sign in process...');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Client auth: Sign in error:', error);
      throw error;
    }

    console.log('Client auth: Sign in successful, session established');
    return data;
  } catch (err) {
    console.error('Client auth: Unexpected error during sign in:', err);
    throw err;
  }
}

export async function signUp(
  supabase: SupabaseClient<Database>,
  { email, password, username }: SignUpData
) {
  console.log('Client auth: Starting sign up process...');

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Client auth: Sign up auth error:', authError);
      throw authError;
    }

    if (!authData.user) {
      console.error('Client auth: User was not created');
      throw new Error('User was not created');
    }

    console.log('Client auth: Auth user created, creating profile...');

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      username,
      display_name: username,
      is_private: false,
      is_verified: false,
    });

    if (profileError) {
      console.error('Client auth: Profile creation error:', profileError);
      // If profile creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    console.log('Client auth: Sign up successful, profile created');
    return authData;
  } catch (err) {
    console.error('Client auth: Unexpected error during sign up:', err);
    throw err;
  }
}

export async function signOut(supabase: SupabaseClient<Database>) {
  console.log('Client auth: Starting sign out process...');

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Client auth: Sign out error:', error);
      throw error;
    }
    console.log('Client auth: Sign out successful');
  } catch (err) {
    console.error('Client auth: Unexpected error during sign out:', err);
    throw err;
  }
}

export async function resetPassword(
  supabase: SupabaseClient<Database>,
  email: string
) {
  console.log('Client auth: Starting password reset process...');

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      console.error('Client auth: Password reset error:', error);
      throw error;
    }
    console.log('Client auth: Password reset email sent');
  } catch (err) {
    console.error('Client auth: Unexpected error during password reset:', err);
    throw err;
  }
}

export async function updatePassword(
  supabase: SupabaseClient<Database>,
  newPassword: string
) {
  console.log('Client auth: Starting password update process...');

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Client auth: Password update error:', error);
      throw error;
    }
    console.log('Client auth: Password updated successfully');
  } catch (err) {
    console.error('Client auth: Unexpected error during password update:', err);
    throw err;
  }
} 