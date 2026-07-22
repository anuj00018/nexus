/**
 * Nexus Logo & Tagline Component
 * Official Tagline: Meet.Connect.Grow
 */
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  variant?: 'icon' | 'wordmark' | 'full';
  color?: 'dark' | 'light' | 'accent';
  className?: string;
  showTagline?: boolean;
}

export function NexusLogo({
  size = 32,
  variant = 'full',
  color = 'dark',
  className,
  showTagline = false,
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
      <rect x="5" y="6" width="6" height="28" rx="3" fill={iconColor} />
      <rect x="29" y="6" width="6" height="28" rx="3" fill={iconColor} />
      <path
        d="M11 8L29 32"
        stroke={iconColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="3.5" fill={color === 'accent' ? '#5B5FD6' : iconColor} />
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
      <span className={cn('inline-flex flex-col', className)}>
        <span className={cn('font-bold tracking-tight', textColor)} style={{ fontSize: size * 0.75 }}>
          Nexus
        </span>
        {showTagline && (
          <span className="text-2xs font-semibold text-nexus-indigo tracking-wider uppercase">
            Meet.Connect.Grow
          </span>
        )}
      </span>
    );
  }

  // Full: icon + wordmark + optional tagline
  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <IconMark />
      <span className="flex flex-col">
        <span className={cn('font-bold tracking-tight leading-none', textColor)} style={{ fontSize: size * 0.7 }}>
          Nexus
        </span>
        {showTagline && (
          <span className="text-2xs font-bold text-nexus-indigo tracking-wider uppercase mt-0.5">
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
        'inline-flex items-center justify-center bg-nexus-black dark:bg-white rounded-xl shadow-md',
        className
      )}
      style={{ width: size, height: size }}
    >
      <NexusLogo size={size * 0.65} variant="icon" color="light" />
    </div>
  );
}

export function NexusTagline({ className }: { className?: string }) {
  return (
    <span className={cn('text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo', className)}>
      Meet.Connect.Grow
    </span>
  );
}
