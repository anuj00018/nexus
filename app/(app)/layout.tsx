// ===================================================================
// Protected App Layout — wraps all authenticated app pages
// Sidebar navigation + topbar
// ===================================================================
import type { Metadata } from 'next';
import { AppNav } from '@/components/layout/AppNav';

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s · Nexus' },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#0C0D0C] text-[#F6F7F3]">
      <AppNav />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
