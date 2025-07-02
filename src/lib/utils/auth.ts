import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Profile } from '@/types';
import { type SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../supabase/types'

export async function getSession() {
  const supabase = createServerComponentClient({ cookies });
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getProfile() {
  const session = await getSession();
  if (!session) return null;

  const supabase = createServerComponentClient({ cookies });
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    return profile as Profile;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/signin');
  }
  return session;
}

export async function requireGuest() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }
}

export type SignInData = {
  email: string
  password: string
}

export type SignUpData = SignInData & {
  username: string
}

export async function signIn(
  supabase: SupabaseClient<Database>,
  { email, password }: SignInData
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function signUp(
  supabase: SupabaseClient<Database>,
  { email, password, username }: SignUpData
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    throw authError
  }

  if (!authData.user) {
    throw new Error('User was not created')
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      username,
      display_name: username,
      is_private: false,
      is_verified: false,
    })

  if (profileError) {
    // If profile creation fails, delete the auth user
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw profileError
  }

  return authData
}

export async function signOut(supabase: SupabaseClient<Database>) {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export async function resetPassword(
  supabase: SupabaseClient<Database>,
  email: string
) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    throw error
  }
}

export async function updatePassword(
  supabase: SupabaseClient<Database>,
  newPassword: string
) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw error
  }
} 