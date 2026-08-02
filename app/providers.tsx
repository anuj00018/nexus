'use client';

/**
 * Providers — wraps the app with all global context providers
 * Fully error-safe: handles missing Supabase config, missing tables, etc.
 * Preserves user onboarding & LinkedIn profile state permanently.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';

const LINKEDIN_URL_REGEX = /^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[^\s/]+\/?.*$/i;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthListener({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, setLoading, setOnboarded } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured || initialized.current) {
      setLoading(false);
      return;
    }
    initialized.current = true;

    // Dynamic import to avoid top-level crashes
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();

      const hydrateUserProfile = (data: any, sessionUser: any) => {
        let savedLocal: any = null;
        try {
          const raw = localStorage.getItem('nexus_user_profile');
          if (raw) savedLocal = JSON.parse(raw);
        } catch { }

        const dbLinkedin = data?.linkedin_url;
        const localLinkedin = savedLocal?.linkedin_url;
        const finalLinkedinUrl = (dbLinkedin && LINKEDIN_URL_REGEX.test(dbLinkedin))
          ? dbLinkedin
          : (localLinkedin && LINKEDIN_URL_REGEX.test(localLinkedin))
            ? localLinkedin
            : null;

        const combinedUser = {
          id: sessionUser.id,
          email: sessionUser.email ?? '',
          name: data?.name
            ?? savedLocal?.name
            ?? sessionUser.user_metadata?.full_name
            ?? sessionUser.user_metadata?.name
            ?? sessionUser.email?.split('@')[0]
            ?? 'User',
          avatar_url: data?.avatar_url ?? savedLocal?.avatar_url ?? sessionUser.user_metadata?.avatar_url ?? null,
          company: data?.company ?? savedLocal?.company ?? null,
          bio: data?.bio ?? savedLocal?.bio ?? null,
          linkedin_url: finalLinkedinUrl,
          interests: data?.skills ?? savedLocal?.interests ?? [],
          looking_for: savedLocal?.looking_for ?? ['Networking'],
          role: data?.role ?? savedLocal?.role ?? 'attendee',
          is_active: true,
          created_at: data?.created_at ?? new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(combinedUser as any);

        if (finalLinkedinUrl && LINKEDIN_URL_REGEX.test(finalLinkedinUrl)) {
          setOnboarded(true);
          try {
            document.cookie = 'nexus_onboarded=true; path=/; max-age=31536000; SameSite=Lax';
          } catch { }
        }
      };

      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              hydrateUserProfile(data, session.user);
            })
            .catch(() => {
              hydrateUserProfile(null, session.user);
            });
        } else {
          setLoading(false);
        }
      }).catch(() => setLoading(false));

      // Auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const { data } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            hydrateUserProfile(data, session.user);
          } else if (event === 'SIGNED_OUT') {
            clearUser();
            queryClient.clear();
            try {
              document.cookie = 'nexus_onboarded=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              localStorage.removeItem('nexus_user_profile');
            } catch { }
          }
        }
      );

      return () => subscription.unsubscribe();
    }).catch(() => setLoading(false));
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'hsl(0 0% 9%)',
              color: 'hsl(0 0% 98%)',
              border: '1px solid hsl(0 0% 14%)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#F87171', secondary: '#fff' } },
          }}
        />
      </AuthListener>
    </QueryClientProvider>
  );
}
