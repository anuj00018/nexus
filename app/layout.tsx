import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// ─── Font Loading ────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  // Load all weights for design flexibility
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

// ─── SEO Metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://nexus.app'),
  title: {
    default: 'Nexus — Discover Relevant People at Every Event',
    template: '%s | Nexus',
  },
  description:
    'Nexus helps you discover and connect with relevant people at events, hackathons, and meetups — with one tap. Never miss the right connection.',
  keywords: [
    'networking',
    'events',
    'hackathon',
    'conference',
    'LinkedIn',
    'connect',
    'professional',
    'startup',
    'Nexus',
  ],
  authors: [{ name: 'Nexus' }],
  creator: 'Nexus',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Nexus — Discover Relevant People at Every Event',
    description:
      'Discover and connect with relevant people at events using LinkedIn. One tap to the right connection.',
    siteName: 'Nexus',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nexus — Event Networking Reimagined',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus — Discover Relevant People at Every Event',
    description:
      'Discover and connect with relevant people at events using LinkedIn. One tap to the right connection.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

// ─── Viewport ────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// ─── Root Layout ─────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
