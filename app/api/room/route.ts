import { NextResponse } from 'next/server';

// Global in-memory room store (synced across all phones & laptops)
const roomStore: Record<string, Map<string, any>> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = (searchParams.get('eventId') || 'demo-1').toLowerCase();

  if (!roomStore[eventId]) {
    roomStore[eventId] = new Map();
  }

  const participants = Array.from(roomStore[eventId].values());
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
    if (!roomStore[eventId]) {
      roomStore[eventId] = new Map();
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
      distance_m: Math.floor(Math.random() * 30) + 2,
      interest_overlap: 2,
      joinedAt: Date.now(),
    };

    roomStore[eventId].set(participant.id, participant);

    return NextResponse.json({
      success: true,
      participant,
      totalCount: roomStore[eventId].size,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
