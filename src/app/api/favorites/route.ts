import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

// GET /api/favorites - Get user's favorite players
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's favorites
    const { data: favorites, error } = await supabase
      .from('player_favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/favorites - Add a player to favorites
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { player_id, player_name, team, position } = await request.json();

    if (!player_id || !player_name || !team || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert favorite (will fail if already exists due to unique constraint)
    const { data, error } = await supabase
      .from('player_favorites')
      .insert([{
        user_id: user.id,
        player_id,
        player_name,
        team,
        position
      }])
      .select();

    if (error) {
      // Check if it's a duplicate key error
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Player already in favorites' }, { status: 409 });
      }
      console.error('Error adding favorite:', error);
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }

    return NextResponse.json({ favorite: data[0] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/favorites - Remove a player from favorites
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const player_id = searchParams.get('player_id');

    if (!player_id) {
      return NextResponse.json({ error: 'Missing player_id parameter' }, { status: 400 });
    }

    // Delete favorite
    const { error } = await supabase
      .from('player_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('player_id', player_id);

    if (error) {
      console.error('Error removing favorite:', error);
      return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 