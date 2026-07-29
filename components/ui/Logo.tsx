/**
 * Nexus Logo & Tagline Component
 * Official Tagline: Meet.Connect.Grow
 * High-contrast, vibrant N mark and text visible across dark and light themes.
 */
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  variant?: 'icon' | 'wordmark' | 'full';
  color?: 'dark' | 'light' | 'accent' | 'white';
  className?: string;
  showTagline?: boolean;
}

export function NexusLogo({
  size = 32,
  variant = 'full',
  color = 'light',
  className,
  showTagline = false,
}: LogoProps) {
  const iconColor = {
    dark: '#0A0A0A',
    light: '#4263EB',
    accent: '#4263EB',
    white: '#FFFFFF',
  }[color];

  const textColor = {
    dark: 'text-slate-900',
    light: 'text-white',
    accent: 'text-nexus-electric',
    white: 'text-white',
  }[color];

  const IconMark = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="5" y="6" width="6" height="28" rx="3" fill={iconColor} />
      <rect x="29" y="6" width="6" height="28" rx="3" fill={iconColor} />
      <path
        d="M11 8L29 32"
        stroke={iconColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="3.5" fill="#22D3EE" />
      <circle cx="32" cy="32" r="3.5" fill="#22D3EE" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <span className={cn('inline-flex items-center shrink-0', className)}>
        <IconMark />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span className={cn('inline-flex flex-col', className)}>
        <span className={cn('font-display font-extrabold tracking-tight', textColor)} style={{ fontSize: size * 0.75 }}>
          Nexus
        </span>
        {showTagline && (
          <span className="text-2xs font-semibold text-nexus-electric tracking-wider uppercase">
            Meet.Connect.Grow
          </span>
        )}
      </span>
    );
  }

  // Full: icon + wordmark + optional tagline
  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none shrink-0', className)}>
      <IconMark />
      <span className="flex flex-col">
        <span className={cn('font-display font-extrabold tracking-tight leading-none', textColor)} style={{ fontSize: size * 0.75 }}>
          Nexus
        </span>
        {showTagline && (
          <span className="text-2xs font-bold text-nexus-electric tracking-wider uppercase mt-0.5">
            Meet.Connect.Grow
          </span>
        )}
      </span>
    </span>
  );
}

export function NexusIcon({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-xl shadow-lg shrink-0',
        className
      )}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #0A0F1E 0%, #111827 100%)',
        border: '1px solid rgba(66, 99, 235, 0.3)',
      }}
    >
      <NexusLogo size={size * 0.65} variant="icon" color="accent" />
    </div>
  );
}

export function NexusTagline({ className }: { className?: string }) {
  return (
    <span className={cn('text-2xs font-extrabold tracking-widest uppercase text-nexus-electric', className)}>
      Meet.Connect.Grow
    </span>
  );
}
