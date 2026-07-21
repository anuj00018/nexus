'use client';

/**
 * Providers — wraps the app with all global context providers
 * Fully error-safe: handles missing Supabase config, missing tables, etc.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';

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
  const { setUser, clearUser, setLoading } = useAuthStore();
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

      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // Try to fetch profile — gracefully handle missing tables
          supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data, error }) => {
              if (data && !error) {
                setUser(data);
              } else {
                // Table might not exist yet — set minimal user from auth session
                setUser({
                  id: session.user.id,
                  email: session.user.email ?? '',
                  name: session.user.user_metadata?.full_name
                    ?? session.user.user_metadata?.name
                    ?? session.user.email?.split('@')[0]
                    ?? 'User',
                  avatar_url: session.user.user_metadata?.avatar_url ?? null,
                  headline: session.user.user_metadata?.headline ?? null,
                  linkedin_url: session.user.user_metadata?.linkedin_url ?? 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
                  skills: [],
                  role: 'attendee',
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                } as any);
              }
            });
        } else {
          setLoading(false);
        }
      }).catch(() => setLoading(false));

      // Auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (data && !error) {
              setUser(data);
            } else {
              // Fallback to auth metadata
              setUser({
                id: session.user.id,
                email: session.user.email ?? '',
                name: session.user.user_metadata?.full_name
                  ?? session.user.user_metadata?.name
                  ?? session.user.email?.split('@')[0]
                  ?? 'User',
                avatar_url: session.user.user_metadata?.avatar_url ?? null,
                headline: null,
                linkedin_url: session.user.user_metadata?.linkedin_url ?? 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
                skills: [],
                role: 'attendee',

                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as any);
            }
          } else if (event === 'SIGNED_OUT') {
            clearUser();
            queryClient.clear();
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
            error:   { iconTheme: { primary: '#F87171', secondary: '#fff' } },
          }}
        />
      </AuthListener>
    </QueryClientProvider>
  );
}
