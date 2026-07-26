'use client';

// ===================================================================
// Nexus UI v2 — Settings Page
// Clean preferences & Founder privacy control.
// Preserves: Supabase sign-out, Zustand session purge, and founder role check.
// ===================================================================
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, Bell, Moon, Lock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SettingsPageV2() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const isFounder =
    user?.role === 'founder' ||
    user?.email?.toLowerCase().includes('anuj') ||
    user?.name?.toLowerCase().includes('anuj');

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    clearUser();
    try {
      localStorage.removeItem('nexus-auth');
      sessionStorage.clear();
    } catch {}
    toast.success('Signed out successfully');
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8 bg-slate-950 text-slate-100">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6 animate-fade-in">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
          <p className="text-xs text-slate-400">Manage your account preferences and privacy</p>
        </div>

        {/* Account Preferences Section */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl backdrop-blur-xl">
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/50">
            <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">Account Preferences</p>
          </div>

          <div className="divide-y divide-slate-800/80">
            {[
              { icon: Shield, label: 'Privacy & Visibility', sub: 'Control who sees your profile in rooms' },
              { icon: Bell, label: 'Room Notifications', sub: 'Direct chat & event alerts' },
              { icon: Moon, label: 'Appearance', sub: 'System dark/light mode' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* About & Small Neat Founder Section */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl backdrop-blur-xl">
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/50">
            <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">About Application</p>
          </div>
          <div className="px-5 py-4 space-y-3 text-xs">
            <div className="flex justify-between items-center text-white font-bold">
              <span>Nexus Platform</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">v2.0.0</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Meet · Connect · Grow · Real-Time Event Networking Platform
            </p>

            {/* Small Neat Founder & Nexus LinkedIn Links */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <a
                href="https://www.linkedin.com/in/anuj-vardham-b399253a1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline font-bold"
              >
                Founder: Anuj Vardham <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://www.linkedin.com/company/join-nexus1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline font-bold"
              >
                Nexus Company Page <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Founder Password-Protected Admin Inbox Link (Visible STRICTLY to Founder Account Only) */}
        {isFounder && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Founder Rating & Review Inbox</p>
                <p className="text-[10px] text-slate-400">Protected by Founder Password</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-colors shadow-md"
            >
              Open Inbox 🔒
            </Link>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full h-12 rounded-2xl border border-rose-500/30 text-rose-400 font-extrabold text-xs
                     flex items-center justify-center gap-2 hover:bg-rose-500/10
                     active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          <LogOut className="h-4 w-4" />
          Sign Out of Nexus
        </button>

      </div>
    </div>
  );
}
