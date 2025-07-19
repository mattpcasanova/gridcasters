import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position') || 'RB';
    const season = parseInt(searchParams.get('season') || '2025');
    const type = searchParams.get('type') || 'preseason';
    const week = searchParams.get('week') ? parseInt(searchParams.get('week')!) : null;

    console.log(`Debug: Fetching average rankings for position=${position}, season=${season}, type=${type}, week=${week}`);

    let query = supabase
      .from('player_average_rankings')
      .select('*')
      .eq('position', position)
      .eq('season', season)
      .eq('type', type);

    if (week !== null) {
      query = query.eq('week', week);
    } else {
      query = query.is('week', null);
    }

    const { data, error } = await query.order('average_rank', { ascending: true });

    if (error) {
      console.error('Error fetching average rankings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Debug: Found ${data?.length || 0} average rankings for ${position}`);

    return NextResponse.json({
      position,
      season,
      type,
      week,
      count: data?.length || 0,
      rankings: data
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 