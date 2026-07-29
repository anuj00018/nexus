'use client';

// ===================================================================
// App Sidebar Navigation — Premium Glassmorphism
// Deep navy glass sidebar with electric blue active indicators
// Collapses to icon-only bottom nav on mobile
// ===================================================================
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarPlus,
  User, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { NexusLogo, NexusIcon } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { id: 'home',       href: ROUTES.DASHBOARD,  icon: LayoutDashboard, label: 'Home'       },
  { id: 'join',       href: ROUTES.JOIN_EVENT,  icon: CalendarPlus,    label: 'Join Event' },
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
        className="hidden md:flex flex-col w-[240px] min-h-screen shrink-0"
        style={{
          background: 'rgba(8, 12, 24, 0.85)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center px-5 h-16" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <NexusLogo size={26} variant="full" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium',
                  'transition-all duration-200 group',
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{
                      background: 'linear-gradient(180deg, #4263EB, #22D3EE)',
                      boxShadow: '0 0 12px rgba(66, 99, 235, 0.5)',
                    }}
                  />
                )}

                {/* Active background glow */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'rgba(66, 99, 235, 0.08)',
                      border: '1px solid rgba(66, 99, 235, 0.12)',
                    }}
                  />
                )}

                {/* Hover background */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-xl bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}

                <item.icon className={cn(
                  'relative h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                  isActive ? 'text-[#4263EB]' : 'text-slate-500 group-hover:text-slate-300'
                )} />
                <span className="relative">{item.label}</span>
                {isActive && <ChevronRight className="relative h-3.5 w-3.5 ml-auto text-slate-500" />}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          {user && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group hover:bg-white/[0.04]">
              <div className="relative">
                <Avatar src={user.avatar_url} alt={user.name} size="sm" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#080C18]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-rose-400"
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
          background: 'rgba(8, 12, 24, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
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
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[52px]',
                  'transition-all duration-200 relative',
                  isActive ? 'text-white' : 'text-slate-500'
                )}
                aria-label={item.label}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-[#4263EB]')} />
                <span className="text-2xs font-medium">{item.label}</span>
                {/* Active dot indicator */}
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                    style={{
                      background: '#4263EB',
                      boxShadow: '0 0 6px rgba(66, 99, 235, 0.6)',
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
