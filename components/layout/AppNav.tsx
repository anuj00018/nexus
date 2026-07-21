'use client';

// ===================================================================
// App Sidebar Navigation
// Premium minimal sidebar with icons + labels
// Collapses to icon-only on mobile
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
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    toast.success('Signed out');
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      {/* ── Desktop Sidebar ────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-border bg-background shrink-0">
        {/* Logo */}
        <div className="flex items-center px-5 h-16 border-b border-border">
          <NexusLogo size={26} variant="full" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-all duration-150 group',
                  isActive
                    ? 'bg-nexus-indigo/10 text-nexus-indigo'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-nexus-indigo' : 'text-muted-foreground group-hover:text-foreground'
                )} />
                {item.label}
                {isActive && <ChevronRight className="h-3 w-3 ml-auto text-nexus-indigo/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-3 border-t border-border">
          {user && (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors group">
              <Avatar src={user.avatar_url} alt={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ──────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md border-t border-border safe-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[52px]',
                  'transition-all duration-150',
                  isActive ? 'text-nexus-indigo' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-2xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
