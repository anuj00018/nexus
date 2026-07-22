import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Global room store across warm serverless instances
const globalRoomStore: Record<string, Map<string, any>> = {};

// Inactivity threshold: 15 seconds without a heartbeat = user left room
const PRESENCE_TIMEOUT_MS = 15_000;

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

  const now = Date.now();
  const roomMap = globalRoomStore[eventId];

  // Clean up users who left or haven't sent a heartbeat in 15s
  for (const [userId, participant] of roomMap.entries()) {
    if (now - (participant.lastActiveAt || 0) > PRESENCE_TIMEOUT_MS) {
      roomMap.delete(userId);
    }
  }

  const participants = Array.from(roomMap.values());
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

    const userId = user.id || `user-${user.name.toLowerCase().replace(/\s+/g, '-')}`;

    const participant = {
      id: userId,
      name: user.name.trim(),
      headline: user.headline?.trim() || 'Event Attendee',
      avatar_url: user.avatar_url || null,
      linkedin_url: formattedLinkedin,
      skills: user.skills || ['Networking', 'Tech'],
      availability: 'available',
      distance_m: Math.floor(Math.random() * 20) + 2,
      interest_overlap: 2,
      lastActiveAt: Date.now(),
    };

    // Upsert user into active room map with updated timestamp
    globalRoomStore[eventId].set(userId, participant);

    // Save to Supabase DB if available
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('users').upsert({
          id: userId,
          name: participant.name,
          headline: participant.headline,
          linkedin_url: participant.linkedin_url,
          skills: participant.skills,
        }, { onConflict: 'id' });

        await supabase.from('event_participants').upsert({
          event_id: eventId,
          user_id: userId,
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

// Explicit exit/leave room endpoint
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = (searchParams.get('eventId') || 'demo-1').toLowerCase();
    const userId = searchParams.get('userId');

    if (eventId && userId && globalRoomStore[eventId]) {
      globalRoomStore[eventId].delete(userId);
    }

    return NextResponse.json({ success: true, message: 'Removed from room' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
