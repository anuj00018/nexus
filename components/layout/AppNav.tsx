'use client';

// ===================================================================
// App Sidebar Navigation — Cyber Aurora Glass Edition
// Deep cosmic obsidian glass sidebar with electric violet & neon cyan active indicators.
// Collapses to touch-friendly cyber bottom dock on mobile.
// ===================================================================
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarPlus,
  User, Settings, LogOut, ChevronRight, Sparkles, Radio
} from 'lucide-react';
import { NexusLogo } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { id: 'home',       href: ROUTES.DASHBOARD,  icon: LayoutDashboard, label: 'Radar Home' },
  { id: 'join',       href: ROUTES.JOIN_EVENT,  icon: CalendarPlus,    label: 'Join Room'  },
  { id: 'profile',    href: '/profile/me',      icon: User,            label: 'Profile'    },
  { id: 'settings',   href: ROUTES.SETTINGS,    icon: Settings,        label: 'Settings'   },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    clearUser();
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
    } catch {}
    toast.success('Signed out successfully');
    window.location.replace('/?logout=true');
  };

  return (
    <>
      {/* ── Desktop Sidebar ────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-[245px] min-h-screen shrink-0 relative z-30"
        style={{
          background: 'rgba(7, 11, 26, 0.94)',
          backdropFilter: 'blur(36px)',
          WebkitBackdropFilter: 'blur(36px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Logo Header */}
        <div className="flex items-center px-5 h-18 border-b border-white/[0.08]">
          <NexusLogo size={28} variant="full" />
        </div>

        {/* Live Radar Status Pill */}
        <div className="px-4 pt-4">
          <div className="px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.12)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-[11px] font-bold text-cyan-300">Live Radar</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 uppercase font-bold">
              LIVE
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold',
                  'transition-all duration-200 group',
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-5 rounded-r-full"
                    style={{
                      background: 'linear-gradient(180deg, #8B5CF6, #06B6D4)',
                      boxShadow: '0 0 12px rgba(6, 182, 212, 0.8)',
                    }}
                  />
                )}

                {/* Active Background Glow */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.18) 0%, rgba(6, 182, 212, 0.10) 100%)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                    }}
                  />
                )}

                {/* Hover Background */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}

                <item.icon className={cn(
                  'relative h-4 w-4 shrink-0 transition-colors duration-200',
                  isActive ? 'text-[#06B6D4]' : 'text-slate-400 group-hover:text-white'
                )} />
                <span className="relative">{item.label}</span>
                {isActive && <ChevronRight className="relative h-3.5 w-3.5 ml-auto text-cyan-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-white/[0.08]">
          {user && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group hover:bg-white/[0.05]">
              <div className="relative shrink-0">
                <Avatar src={user.avatar_url} alt={user.name} size="sm" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-cyan-400 border-2 border-[#070B1A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-cyan-300/80 truncate">{user.company || 'Verified Attendee'}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="opacity-60 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-rose-400"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ──────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 safe-bottom"
        style={{
          background: 'rgba(7, 11, 26, 0.94)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[54px]',
                  'transition-all duration-200 relative',
                  isActive ? 'text-white' : 'text-slate-400'
                )}
                aria-label={item.label}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-cyan-400' : 'text-slate-400')} />
                <span className="text-2xs font-semibold">{item.label}</span>
                {/* Active dot indicator */}
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: '#06B6D4',
                      boxShadow: '0 0 10px rgba(6, 182, 212, 0.9)',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
