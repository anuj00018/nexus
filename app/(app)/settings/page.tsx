'use client';

// ===================================================================
// Settings Page
// Features clean, minimal Founder card linking to Anuj Vardham's LinkedIn
// ===================================================================
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, Bell, Moon, Info, Lock } from 'lucide-react';
import Link from 'next/link';
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

        {/* ── Simple Aesthetic Founder Card (Middle of Settings) ──────────────── */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-background via-muted/20 to-background p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md bg-nexus-indigo/10 text-nexus-indigo border border-nexus-indigo/20">
              Founder
            </span>
            <span className="text-2xs font-mono text-muted-foreground">Nexus Verified</span>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">Anuj Vardham</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Founder & CEO @ Nexus</p>
          </div>

          <a
            href="https://www.linkedin.com/in/anuj-vardham-b399253a1"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-xl bg-[#0A66C2] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#084e96] active:scale-[0.98] transition-all shadow-md shadow-[#0A66C2]/20"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Connect with Founder on LinkedIn ↗
          </a>
        </div>

        {/* Private Founder Portal Link */}
        <div className="rounded-2xl border border-border bg-background p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Founder Rating & Review Inbox</p>
              <p className="text-2xs text-muted-foreground">Protected by Founder Security Password</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-lg bg-nexus-indigo text-white text-2xs font-bold hover:bg-nexus-indigo/90 transition-colors"
          >
            Open Inbox 🔒
          </Link>
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
            <p className="text-xs text-muted-foreground">Meet.Connect.Grow · Built with ❤️ in India</p>
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
