'use client';

// ===================================================================
// Settings Page — Clean Preferences & Small Neat Founder Mention
// Displays useful account preferences, small neat Founder & Nexus
// LinkedIn links, and password-protected Founder Inbox for Anuj.
// ===================================================================
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, Bell, Moon, Lock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const isFounder =
    user?.role === 'founder' ||
    user?.email?.toLowerCase().includes('anuj') ||
    user?.name?.toLowerCase().includes('anuj');

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    toast.success('Signed out successfully');
    router.push('/login');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8">
      <div className="max-w-lg mx-auto px-4 py-6 sm:py-8 space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your account preferences and privacy</p>
        </div>

        {/* Account Preferences Section */}
        <div className="rounded-3xl border border-border/80 bg-background/90 overflow-hidden shadow-sm backdrop-blur-md">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/20">
            <p className="text-2xs font-extrabold text-nexus-indigo uppercase tracking-wider">Account Preferences</p>
          </div>

          <div className="divide-y divide-border/60">
            {[
              { icon: Shield, label: 'Privacy & Visibility', sub: 'Control who sees your profile in rooms' },
              { icon: Bell, label: 'Room Notifications', sub: 'Direct chat & event alerts' },
              { icon: Moon, label: 'Appearance', sub: 'System dark/light mode' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-nexus-indigo/10 text-nexus-indigo">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* About & Small Neat Founder Section */}
        <div className="rounded-3xl border border-border/80 bg-background/90 overflow-hidden shadow-sm backdrop-blur-md">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/20">
            <p className="text-2xs font-extrabold text-nexus-indigo uppercase tracking-wider">About Application</p>
          </div>
          <div className="px-4 py-4 space-y-3 text-xs">
            <div className="flex justify-between items-center text-foreground font-semibold">
              <span>Nexus Platform</span>
              <span className="font-mono text-2xs px-2 py-0.5 rounded bg-muted">v1.0.0</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Meet.Connect.Grow · Real-Time Event Networking Platform
            </p>

            {/* Small Neat Founder & Nexus LinkedIn Links */}
            <div className="pt-2.5 border-t border-border/50 flex flex-wrap items-center gap-3 text-2xs font-semibold">
              <a
                href="https://www.linkedin.com/in/anuj-vardham-b399253a1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline"
              >
                Founder: Anuj Vardham ↗
              </a>
              <span className="text-muted-foreground/60">•</span>
              <a
                href="https://www.linkedin.com/company/join-nexus1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline"
              >
                Nexus Company Page ↗
              </a>
            </div>
          </div>
        </div>

        {/* Founder Password-Protected Admin Inbox Link (Visible STRICTLY to Founder Account Only) */}
        {isFounder && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Founder Rating & Review Inbox</p>
                <p className="text-[10px] text-muted-foreground">Protected by Founder Password</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-2xs font-extrabold hover:bg-amber-600 transition-colors shadow-xs"
            >
              Open Inbox 🔒
            </Link>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full h-12 rounded-2xl border border-destructive/30 text-destructive font-bold text-xs
                     flex items-center justify-center gap-2 hover:bg-destructive/10
                     active:scale-[0.98] transition-all duration-150 shadow-2xs"
        >
          <LogOut className="h-4 w-4" />
          Sign Out of Nexus
        </button>

      </div>
    </div>
  );
}
