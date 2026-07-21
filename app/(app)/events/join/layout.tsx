// ===================================================================
// JOIN EVENT — App layout wrapper
// ===================================================================
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Event',
  description: 'Enter your event code to start discovering people nearby.',
};

export default function JoinEventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
