import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Global room store across warm serverless instances
const globalRoomStore: Record<string, Map<string, any>> = {};

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && !url.includes('placeholder')) {
    return createClient(url, key);
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = (searchParams.get('eventId') || 'demo-1').toLowerCase();

  if (!globalRoomStore[eventId]) {
    globalRoomStore[eventId] = new Map();
  }

  // If Supabase is connected, load persistent participants from DB as well
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: dbParticipants } = await supabase
        .from('event_participants')
        .select('user_id, users(id, name, headline, avatar_url, linkedin_url, skills)')
        .eq('event_id', eventId);

      if (dbParticipants && dbParticipants.length > 0) {
        dbParticipants.forEach((p: any) => {
          if (p.users?.name) {
            const formatted = {
              id: p.users.id,
              name: p.users.name,
              headline: p.users.headline || 'Event Attendee',
              avatar_url: p.users.avatar_url,
              linkedin_url: p.users.linkedin_url || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(p.users.name)}`,
              skills: p.users.skills || ['Networking', 'Tech'],
              availability: 'available',
              distance_m: 5,
              interest_overlap: 2,
              joinedAt: Date.now(),
            };
            globalRoomStore[eventId].set(formatted.id, formatted);
          }
        });
      }
    } catch (err) {
      console.warn('DB fetch warning:', err);
    }
  }

  const participants = Array.from(globalRoomStore[eventId].values());
  return NextResponse.json({ success: true, participants });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId: rawEventId, user } = body;

    if (!user || !user.name) {
      return NextResponse.json({ success: false, error: 'User data missing' }, { status: 400 });
    }

    const eventId = (rawEventId || 'demo-1').toLowerCase();
    if (!globalRoomStore[eventId]) {
      globalRoomStore[eventId] = new Map();
    }

    const formattedLinkedin = user.linkedin_url?.trim().startsWith('http')
      ? user.linkedin_url.trim()
      : user.linkedin_url?.trim()
      ? `https://${user.linkedin_url.trim()}`
      : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(user.name)}`;

    const participant = {
      id: user.id || `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: user.name.trim(),
      headline: user.headline?.trim() || 'Event Attendee',
      avatar_url: user.avatar_url || null,
      linkedin_url: formattedLinkedin,
      skills: user.skills || ['Networking', 'Tech'],
      availability: 'available',
      distance_m: Math.floor(Math.random() * 20) + 2,
      interest_overlap: 2,
      joinedAt: Date.now(),
    };

    // Store in serverless memory map
    globalRoomStore[eventId].set(participant.id, participant);

    // Save to Supabase DB if available
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('users').upsert({
          id: participant.id,
          name: participant.name,
          headline: participant.headline,
          linkedin_url: participant.linkedin_url,
          skills: participant.skills,
        }, { onConflict: 'id' });

        await supabase.from('event_participants').upsert({
          event_id: eventId,
          user_id: participant.id,
        }, { onConflict: 'event_id,user_id' });
      } catch (dbErr) {
        console.warn('DB upsert warning:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      participant,
      totalCount: globalRoomStore[eventId].size,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
