/**
 * Nexus Logo Component
 *
 * Design: A geometric "N" built from two diagonal strokes connected
 * by a central diagonal — representing connection between people.
 * Clean, flat, works in black and white, scalable as SVG.
 */

import { cn } from '@/lib/utils';

interface LogoProps {
  /** Size in pixels (width = height) */
  size?: number;
  /** Text variant shows wordmark beside icon */
  variant?: 'icon' | 'wordmark' | 'full';
  /** Color variant */
  color?: 'dark' | 'light' | 'accent';
  className?: string;
}

export function NexusLogo({
  size = 32,
  variant = 'full',
  color = 'dark',
  className,
}: LogoProps) {
  const iconColor = {
    dark: '#0A0A0A',
    light: '#FAFAFA',
    accent: '#5B5FD6',
  }[color];

  const textColor = {
    dark: 'text-nexus-black dark:text-nexus-white',
    light: 'text-nexus-white',
    accent: 'text-nexus-indigo',
  }[color];

  const IconMark = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/*
        N shape:
        - Left vertical stroke
        - Right vertical stroke
        - Diagonal connector from top-left to bottom-right
        Two "nodes" at the connection points representing people
      */}

      {/* Left vertical bar */}
      <rect x="5" y="6" width="6" height="28" rx="3" fill={iconColor} />

      {/* Right vertical bar */}
      <rect x="29" y="6" width="6" height="28" rx="3" fill={iconColor} />

      {/* Diagonal stroke — the "connection" */}
      <path
        d="M11 8L29 32"
        stroke={iconColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top node — person A */}
      <circle cx="8" cy="8" r="3.5" fill={color === 'accent' ? '#5B5FD6' : iconColor} />

      {/* Bottom node — person B */}
      <circle cx="32" cy="32" r="3.5" fill={color === 'accent' ? '#5B5FD6' : iconColor} />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <span className={cn('inline-flex items-center', className)}>
        <IconMark />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={cn(
          'inline-flex items-center font-bold tracking-tight',
          textColor,
          className
        )}
        style={{ fontSize: size * 0.75 }}
      >
        Nexus
      </span>
    );
  }

  // Full: icon + wordmark
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-bold tracking-tight select-none',
        textColor,
        className
      )}
    >
      <IconMark />
      <span style={{ fontSize: size * 0.7, lineHeight: 1 }}>Nexus</span>
    </span>
  );
}

// ─── Favicon / App Icon variant ───────────────────────────────────────
export function NexusIcon({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center bg-nexus-black dark:bg-white rounded-xl',
        className
      )}
      style={{ width: size, height: size }}
    >
      <NexusLogo size={size * 0.65} variant="icon" color="light" />
    </div>
  );
}
