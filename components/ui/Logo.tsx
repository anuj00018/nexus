/**
 * Nexus Logo & Tagline Component — Cyber Aurora Edition
 * Official Tagline: MEET · CONNECT · GROW
 * Luminous gradient N monogram with cyber violet & neon cyan flare.
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
  const gradientId = `nexus-grad-${size}`;

  const IconMark = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]"
    >
      <defs>
        <linearGradient id={gradientId} x1="5" y1="6" x2="35" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      {/* Left Pillar */}
      <rect x="5" y="6" width="6.5" height="28" rx="3.25" fill={`url(#${gradientId})`} />
      {/* Right Pillar */}
      <rect x="28.5" y="6" width="6.5" height="28" rx="3.25" fill={`url(#${gradientId})`} />
      {/* Dynamic Diagonal Bridge */}
      <path
        d="M10.5 8L29.5 32"
        stroke={`url(#${gradientId})`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Signal Nodes with Cyan/Violet Glow */}
      <circle cx="8.25" cy="8.25" r="3.75" fill="#22D3EE" />
      <circle cx="31.75" cy="31.75" r="3.75" fill="#A78BFA" />
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
        <span className="font-display font-extrabold tracking-tight text-white" style={{ fontSize: size * 0.75 }}>
          Nexus
        </span>
        {showTagline && (
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#06B6D4] uppercase">
            MEET · CONNECT · GROW
          </span>
        )}
      </span>
    );
  }

  // Full: icon + wordmark + optional tagline
  return (
    <span className={cn('inline-flex items-center gap-3 select-none shrink-0', className)}>
      <IconMark />
      <span className="flex flex-col">
        <span className="font-display font-extrabold tracking-tight text-white leading-none flex items-center gap-1" style={{ fontSize: size * 0.75 }}>
          Nexus
          <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
        </span>
        {showTagline && (
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#06B6D4] uppercase mt-0.5">
            MEET · CONNECT · GROW
          </span>
        )}
      </span>
    </span>
  );
}

export function NexusIcon({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-2xl shadow-glow-violet shrink-0 transition-all duration-300 hover:scale-105',
        className
      )}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(139, 92, 246, 0.3)',
      }}
    >
      <NexusLogo size={size * 0.62} variant="icon" />
    </div>
  );
}

export function NexusTagline({ className }: { className?: string }) {
  return (
    <span className={cn('text-2xs font-extrabold tracking-[0.22em] uppercase text-[#06B6D4]', className)}>
      MEET · CONNECT · GROW
    </span>
  );
}
