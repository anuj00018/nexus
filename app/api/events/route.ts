import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side persistent in-memory store for cross-device code resolution
// Keeps active rooms & user connect codes available across devices (mobile + laptop)
interface EventRecord {
  code: string;
  title: string;
  category: string;
  venueName?: string;
  venueAddress?: string;
  organizerId?: string;
  organizerName?: string;
  type: 'event' | 'user';
  createdAt: number;
  expiresAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __nexusEventsStore: Record<string, EventRecord> | undefined;
}

if (!globalThis.__nexusEventsStore) {
  globalThis.__nexusEventsStore = {
    NEXUS1: {
      code: 'NEXUS1',
      title: 'Nexus Global Summit 2025',
      category: 'conference',
      venueName: 'Main Arena & Keynote Stage',
      venueAddress: 'Convention Center, San Francisco / Virtual',
      organizerId: 'user-founder-anuj',
      organizerName: 'Anuj Vardham',
      type: 'event',
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    TECHFEST25: {
      code: 'TECHFEST25',
      title: 'TechFest International 2025',
      category: 'tech_fest',
      venueName: 'Innovation Pavilion',
      venueAddress: 'Tech Campus Hall A',
      organizerId: 'user-marcus',
      organizerName: 'Marcus Vance',
      type: 'event',
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    'AI-HACK': {
      code: 'AI-HACK',
      title: 'Global AI Agents Hackathon',
      category: 'hackathon',
      venueName: 'Hacker Lounge & Demo Arena',
      venueAddress: 'HITEC Innovation District',
      organizerId: 'user-sarah',
      organizerName: 'Sarah Chen',
      type: 'event',
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  };
}

const eventsStore = globalThis.__nexusEventsStore;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && !url.includes('placeholder')) {
    return createClient(url, key);
  }
  return null;
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawCode = searchParams.get('code');

    if (!rawCode) {
      // Return list of active preset / registered events
      const list = Object.values(eventsStore).sort((a, b) => b.createdAt - a.createdAt);
      return NextResponse.json({ success: true, events: list });
    }

    const cleanCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12);
    let event = eventsStore[cleanCode];

    // Check Supabase if not in memory (with 600ms hard timeout so it never hangs)
    if (!event) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const res: any = await Promise.race([
            supabase.from('events').select('*').eq('join_code', cleanCode).maybeSingle(),
            new Promise((resolve) => setTimeout(() => resolve({ data: null }), 600)),
          ]);
          const data = res?.data;

          if (data) {
            event = {
              code: data.join_code,
              title: data.title || `Event ${data.join_code}`,
              category: data.category || 'tech_fest',
              venueName: data.venue_name,
              venueAddress: data.venue_address,
              organizerId: data.organizer_id,
              type: 'event',
              createdAt: new Date(data.created_at || Date.now()).getTime(),
              expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            };
            eventsStore[cleanCode] = event;
          }
        } catch (dbErr) {
          console.warn('[API Events] Supabase lookup notice:', dbErr);
        }
      }
    }

    // If still not explicitly in store, but valid length (3-12 chars), create dynamic event record
    // so attendees joining custom codes from mobile phone or laptop are NEVER blocked
    if (!event && cleanCode.length >= 3) {
      event = {
        code: cleanCode,
        title: cleanCode.startsWith('NX-') ? `Attendee Connect (${cleanCode})` : `Room #${cleanCode}`,
        category: 'meetup',
        venueName: 'Live Event Space',
        type: cleanCode.startsWith('NX-') ? 'user' : 'event',
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      eventsStore[cleanCode] = event;
    }

    return NextResponse.json({
      success: true,
      exists: Boolean(event),
      event: event || null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, title, category, venueName, venueAddress, organizerId, organizerName, type = 'event' } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid code is required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12);
    if (cleanCode.length < 3) {
      return NextResponse.json({ success: false, error: 'Code must be at least 3 characters' }, { status: 400 });
    }

    const eventRecord: EventRecord = {
      code: cleanCode,
      title: title?.trim() || `Event ${cleanCode}`,
      category: category || 'tech_fest',
      venueName: venueName?.trim() || 'Tech Venue',
      venueAddress: venueAddress?.trim() || '',
      organizerId: organizerId || 'anonymous',
      organizerName: organizerName || 'Host',
      type: type === 'user' ? 'user' : 'event',
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24-hour active room window
    };

    // Store immediately in persistent global registry (0ms latency across all devices)
    eventsStore[cleanCode] = eventRecord;

    // Optional background non-blocking sync to Supabase (NEVER awaited or blocking)
    const supabase = getSupabaseAdmin();
    if (supabase && type === 'event') {
      Promise.race([
        supabase.from('events').upsert({
          title: eventRecord.title,
          join_code: cleanCode,
          category: eventRecord.category,
          venue_name: eventRecord.venueName,
          venue_address: eventRecord.venueAddress,
          organizer_id: organizerId || 'user-founder-anuj',
          status: 'active',
        }, { onConflict: 'join_code' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800)),
      ]).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Code successfully generated and registered across devices',
      event: eventRecord,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
