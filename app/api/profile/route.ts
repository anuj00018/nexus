import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && !url.includes('placeholder')) {
    return createClient(url, key);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, name, avatar_url, company, bio, linkedin_url, looking_for, interests } = body;

    if (!userId || !name) {
      return NextResponse.json({ success: false, error: 'User ID and Name required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      // 1. Upsert users table permanently
      const { error: userErr } = await supabase.from('users').upsert({
        id: userId,
        email: email || '',
        name: name.trim(),
        avatar_url: avatar_url || null,
        company: company || null,
        bio: bio || null,
        linkedin_url: linkedin_url?.trim() || null,
        skills: interests || [],
        is_verified: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (userErr) console.warn('[API Profile] Users table upsert warning:', userErr.message);

      // 2. Upsert user_preferences table permanently
      const { error: prefErr } = await supabase.from('user_preferences').upsert({
        user_id: userId,
        goals: looking_for || [],
        onboarding_done: true,
        availability: 'available',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (prefErr) console.warn('[API Profile] User preferences upsert warning:', prefErr.message);
    }

    return NextResponse.json({ success: true, message: 'Profile saved permanently' });
  } catch (err: any) {
    console.error('[API Profile] Exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
