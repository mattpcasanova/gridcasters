'use client';

import type { SupabaseClient, AuthResponse } from '@supabase/supabase-js';
import { Database } from '../supabase/types';

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
};

export type SignUpResult = {
  user: any;
  session: any;
  needsEmailConfirmation?: boolean;
  message?: string;
};

// Track last request time to prevent rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Client auth: Waiting ${waitTime}ms to avoid rate limiting...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

export async function signIn(
  supabase: SupabaseClient<Database>,
  { emailOrUsername, password, rememberMe }: { emailOrUsername: string; password: string; rememberMe?: boolean }
) {
  console.log('Starting sign in for:', emailOrUsername);

  try {
    await waitForRateLimit();
    
    let email = emailOrUsername;
    
    // If it's not an email (doesn't contain @), try to look up the email by username
    if (!emailOrUsername.includes('@')) {
      console.log('Looking up email for username:', emailOrUsername);
      
      // Call our API endpoint to look up the email by username
      const response = await fetch('/api/auth/username-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: emailOrUsername }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Username not found');
      }

      const { email: userEmail } = await response.json();
      email = userEmail;
      console.log('Found email for username:', userEmail);
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Set session persistence based on remember me
    if (rememberMe) {
      await supabase.auth.setSession({
        access_token: authData.session?.access_token || '',
        refresh_token: authData.session?.refresh_token || '',
      });
    }

    if (authError) {
      console.error('Sign in failed:', authError.message);
      
      // Handle specific rate limiting error
      if (authError.message?.includes('you can only request this after')) {
        throw new Error('Please wait a moment before trying again. Sign in requests are rate limited for security.');
      }
      
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Sign in failed - no user returned');
    }

    console.log('Sign in successful');
    return authData;
  } catch (err) {
    console.error('Sign in failed:', err);
    throw err;
  }
}

export async function signUp(
  supabase: SupabaseClient<Database>,
  { email, password, username, firstName, lastName, birthDate }: SignUpData
): Promise<SignUpResult> {
  console.log('Starting sign up for:', email);

  try {
    await waitForRateLimit();
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        data: {
          username: username,
          display_name: username,
          first_name: firstName || '',
          last_name: lastName || '',
          birth_date: birthDate || ''
        }
      }
    });

    if (authError) {
      console.error('Auth user creation failed:', authError.message);
      
      // Handle specific rate limiting error
      if (authError.message?.includes('you can only request this after')) {
        throw new Error('Please wait a moment before trying again. Sign up requests are rate limited for security.');
      }
      
      throw authError;
    }

    if (!authData.user) {
      throw new Error('User was not created');
    }

    console.log('Auth user created, checking session...');
    console.log('Auth data:', {
      userId: authData.user.id,
      email: authData.user.email,
      emailConfirmed: authData.user.email_confirmed_at,
      sessionExists: !!authData.session
    });
    
    // Profile will be created automatically by database trigger
    console.log('Profile will be created automatically by database trigger');
    
    // If no session was created, email confirmation is required
    if (!authData.session) {
      console.log('No session created - email confirmation required');
      
      // Return success state indicating email confirmation needed
      return {
        ...authData,
        needsEmailConfirmation: true,
        message: 'Account created successfully! Please check your email to verify your account.'
      };
    }
    
    console.log('Sign up successful');
    return authData;
  } catch (err) {
    console.error('Sign up failed:', err);
    throw err;
  }
}

// This function is no longer needed since profiles are created automatically by database trigger

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
    await waitForRateLimit();
    
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