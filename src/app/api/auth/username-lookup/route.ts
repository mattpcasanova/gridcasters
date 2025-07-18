import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminSupabase } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Create server-side Supabase client for profile lookup
    const supabase = createServerSupabase();

    // Look up the user by username in the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username.toLowerCase().trim())
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Username not found' },
        { status: 404 }
      );
    }

    // Get the user's email from auth.users using admin client
    const adminSupabase = createAdminSupabase();
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.getUserById(profile.id);

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return the email for authentication
    return NextResponse.json({
      email: authUser.user.email,
      username: profile.username
    });

  } catch (error) {
    console.error('Username lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 