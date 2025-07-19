import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const season = searchParams.get('season');
    const type = searchParams.get('type');
    const week = searchParams.get('week');

    if (!position || !season || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: position, season, type' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    let query = supabase
      .from('player_average_rankings')
      .select('*')
      .eq('position', position)
      .eq('season', parseInt(season))
      .eq('type', type)
      .order('average_rank', { ascending: true });

    if (week) {
      query = query.eq('week', parseInt(week));
    } else {
      query = query.is('week', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching average rankings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch average rankings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error in average rankings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 