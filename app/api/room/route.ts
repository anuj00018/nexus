import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line no-var
  var __nexusRoomStore: Record<string, Map<string, any>> | undefined;
}

// Global room store across warm serverless instances and hot reloads
if (!globalThis.__nexusRoomStore) {
  globalThis.__nexusRoomStore = {};
}
const globalRoomStore = globalThis.__nexusRoomStore;

// Inactivity threshold: 25 seconds without a heartbeat = user left room
const PRESENCE_TIMEOUT_MS = 25_000;

const INITIAL_ROOM_PARTICIPANTS = [
  {
    id: 'attendee-sarah-chen',
    name: 'Sarah Chen',
    headline: 'Senior AI Research Engineer @ Anthropic',
    company: 'Anthropic',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    linkedin_url: 'https://www.linkedin.com/in/sarah-chen-ai',
    interests: ['AI / ML', 'LLM Agents', 'Neural Architectures', 'Startups'],
    looking_for: ['Co-founder', 'AI & Tech'],
    bio: 'Working on multi-agent reasoning. Seeking founders building agentic developer tools.',
    role: 'founder',
    is_verified: true,
    is_persistent: true,
  },
  {
    id: 'attendee-marcus-vance',
    name: 'Marcus Vance',
    headline: 'VP of Engineering @ Stripe | Ex-Google',
    company: 'Stripe',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    linkedin_url: 'https://www.linkedin.com/in/marcus-vance-tech',
    interests: ['Distributed Systems', 'Cloud Architecture', 'Fintech', 'Hiring'],
    looking_for: ['Hiring', 'Networking'],
    bio: 'Scaling high-throughput payment pipelines. Actively scouting principal engineers and tech leads.',
    role: 'organizer',
    is_verified: true,
    is_persistent: true,
  },
  {
    id: 'attendee-elena-rostova',
    name: 'Elena Rostova',
    headline: 'Founding Partner @ Matrix Capital (AI / SaaS)',
    company: 'Matrix Capital',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    linkedin_url: 'https://www.linkedin.com/in/elena-rostova-vc',
    interests: ['Venture Capital', 'Seed Deals', 'AI / ML', 'SaaS Growth'],
    looking_for: ['Co-founders', 'Startups'],
    bio: 'Investing $500k–$2M in pre-seed AI infrastructure and vertical SaaS founders.',
    role: 'attendee',
    is_verified: true,
    is_persistent: true,
  },
  {
    id: 'attendee-devon-park',
    name: 'Devon Park',
    headline: 'Full-Stack Product Architect @ Linear',
    company: 'Linear',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    linkedin_url: 'https://www.linkedin.com/in/devon-park-product',
    interests: ['Next.js', 'Product Design', 'Zero-Latency UX', 'TypeScript'],
    looking_for: ['AI & Tech', 'Networking'],
    bio: 'Obsessed with fluid interactions, craft, and keyboard-first developer productivity tools.',
    role: 'attendee',
    is_verified: true,
    is_persistent: true,
  },
  {
    id: 'attendee-kavya-sharma',
    name: 'Kavya Sharma',
    headline: 'Lead ML Engineer @ TechVentures',
    company: 'TechVentures',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    linkedin_url: 'https://www.linkedin.com/in/kavya-sharma',
    interests: ['AI / ML', 'Web3', 'Startups', 'Networking'],
    looking_for: ['Co-founder', 'AI & Tech'],
    bio: 'Building autonomous agent workflows and edge intelligence. Happy to chat about prompt optimization.',
    role: 'founder',
    is_verified: true,
    is_persistent: true,
  },
];

function ensureRoomInitialized(eventId: string) {
  if (!globalRoomStore[eventId]) {
    globalRoomStore[eventId] = new Map();
  }
  const roomMap = globalRoomStore[eventId];
  for (const person of INITIAL_ROOM_PARTICIPANTS) {
    if (!roomMap.has(person.id)) {
      roomMap.set(person.id, {
        ...person,
        lastActiveAt: Date.now(),
      });
    }
  }
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && !url.includes('placeholder')) {
    return createClient(url, key);
  }
  return null;
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = (searchParams.get('eventId') || 'nexus1').toLowerCase();

  ensureRoomInitialized(eventId);

  const now = Date.now();
  const roomMap = globalRoomStore[eventId];

  // Clean up transient users who left or haven't sent a heartbeat in 25s
  for (const [userId, participant] of roomMap.entries()) {
    if (!participant.is_persistent && (now - (participant.lastActiveAt || 0) > PRESENCE_TIMEOUT_MS)) {
      roomMap.delete(userId);
    }
  }

  // Cross-Instance Vercel Sync: Load real attendees who joined this event from Supabase DB (capped at 600ms timeout)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const res: any = await Promise.race([
        supabase
          .from('event_participants')
          .select(`
            user_id,
            users:user_id (
              id,
              name,
              company,
              avatar_url,
              linkedin_url,
              role,
              headline,
              is_verified
            )
          `)
          .eq('event_id', eventId),
        new Promise((resolve) => setTimeout(() => resolve({ data: null }), 600)),
      ]);
      const dbParticipants = res?.data;

      if (dbParticipants && Array.isArray(dbParticipants)) {
        for (const row of dbParticipants) {
          const u: any = row.users;
          if (u && u.name && !roomMap.has(u.id)) {
            const formattedLinkedin = u.linkedin_url?.trim().startsWith('http')
              ? u.linkedin_url.trim()
              : u.linkedin_url?.trim()
                ? `https://${u.linkedin_url.trim()}`
                : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(u.name)}`;

            roomMap.set(u.id, {
              id: u.id,
              name: u.name,
              headline: u.headline || `${u.role === 'founder' ? 'Founder' : 'Builder'} @ ${u.company || 'Tech Event'}`,
              company: u.company || 'Attendee',
              avatar_url: u.avatar_url || null,
              linkedin_url: formattedLinkedin,
              interests: ['AI & Tech', 'Startups'],
              looking_for: ['Networking', 'Collaboration'],
              bio: null,
              role: u.role || 'attendee',
              is_verified: true,
              is_persistent: false,
              lastActiveAt: Date.now(),
            });
          }
        }
      }
    } catch {
      // Non-blocking fallback to memory store
    }
  }

  const participants = Array.from(roomMap.values());
  return NextResponse.json({ success: true, participants });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId: rawEventId, user } = body;

    if (!user || !user.name || user.name.startsWith('Attendee #')) {
      return NextResponse.json({ success: false, error: 'Real authenticated user required' }, { status: 400 });
    }

    const eventId = (rawEventId || 'nexus1').toLowerCase();
    ensureRoomInitialized(eventId);

    const formattedLinkedin = user.linkedin_url?.trim().startsWith('http')
      ? user.linkedin_url.trim()
      : user.linkedin_url?.trim()
        ? `https://${user.linkedin_url.trim()}`
        : 'https://www.linkedin.com';

    const userId = user.id || `user-${user.name.toLowerCase().replace(/\s+/g, '-')}`;

    const participant = {
      id: userId,
      name: user.name.trim(),
      company: user.company?.trim() || 'Tech Network',
      avatar_url: user.avatar_url || null,
      linkedin_url: formattedLinkedin,
      interests: user.interests || [],
      looking_for: user.looking_for || ['Networking'],
      bio: user.bio || null,
      role: user.role || 'attendee',
      is_verified: true,
      lastActiveAt: Date.now(),
    };

    // Upsert real user into active room map immediately
    globalRoomStore[eventId].set(userId, participant);

    // Optional background non-blocking sync to Supabase DB (NEVER blocks API response)
    const supabase = getSupabaseClient();
    if (supabase) {
      Promise.race([
        Promise.all([
          supabase.from('users').upsert({
            id: userId,
            name: participant.name,
            company: participant.company,
            avatar_url: participant.avatar_url,
            linkedin_url: participant.linkedin_url,
            role: participant.role,
            is_verified: true,
          }, { onConflict: 'id' }),
          supabase.from('event_participants').upsert({
            event_id: eventId,
            user_id: userId,
          }, { onConflict: 'event_id,user_id' }),
        ]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800)),
      ]).catch(() => {});
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
    const eventId = (searchParams.get('eventId') || 'nexus1').toLowerCase();
    const userId = searchParams.get('userId');

    if (eventId && userId && globalRoomStore[eventId]) {
      globalRoomStore[eventId].delete(userId);
    }

    return NextResponse.json({ success: true, message: 'Removed from room' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
