'use client';

import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, Bell, Moon, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    toast.success('Signed out successfully');
    router.push('/login');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        <h1 className="text-2xl font-bold text-foreground">Settings</h1>

        {/* Account */}
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account</p>
            <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo">
              Founder
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold text-foreground">{user?.name || 'Anuj Vardham'}</p>
                  <p className="text-xs text-muted-foreground">{user?.headline || 'Founder @ Nexus'}</p>

                </div>
              </div>
            </div>
            <a
              href={user?.linkedin_url || 'https://www.linkedin.com/in/anuj-vardham-b399253a1'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-xs text-[#0A66C2] font-semibold hover:underline bg-[#0A66C2]/10 px-3 py-2 rounded-xl w-full"
            >
              <span>My Connected LinkedIn Profile</span>
              <span className="text-2xs font-mono">anuj-vardham ↗</span>
            </a>
          </div>
        </div>


        {/* Preferences */}
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preferences</p>
          </div>
          <div className="divide-y divide-border">
            {[
              { icon: Shield, label: 'Privacy Settings', sub: 'Control who sees you' },
              { icon: Bell, label: 'Notifications', sub: 'Coming soon' },
              { icon: Moon, label: 'Dark Mode', sub: 'Coming soon' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3.5 opacity-60">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">About</p>
          </div>
          <div className="px-4 py-3.5 space-y-2">
            <p className="text-sm text-muted-foreground">Nexus v0.1.0 · Beta</p>
            <p className="text-xs text-muted-foreground">Smart event networking · Built with ❤️ in India</p>
            <a
              href="https://www.linkedin.com/company/join-nexus1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#0A66C2] font-semibold hover:underline pt-1"
            >

              Follow Nexus on LinkedIn ↗
            </a>
          </div>

        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full h-12 rounded-xl border-2 border-destructive/30 text-destructive font-semibold text-sm
                     flex items-center justify-center gap-2 hover:bg-destructive/5
                     active:scale-[0.98] transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
