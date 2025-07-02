'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../supabase/types';

export async function createProfile(userId: string, username: string) {
  console.log('Server auth: Starting profile creation...', { userId, username });

  try {
    const cookieStore = cookies();
    console.log('Server auth: Creating Supabase client...');
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    console.log('Server auth: Inserting profile...');
    const { error, data } = await supabase.from('profiles').insert({
      id: userId,
      username,
      display_name: username,
      is_private: false,
      is_verified: false,
    }).select();

    if (error) {
      console.error('Server auth: Profile creation error:', error);
      throw error;
    }

    console.log('Server auth: Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Server auth: Unexpected error during profile creation:', error);
    throw error;
  }
} 