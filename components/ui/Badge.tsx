/**
 * Nexus Badge Component — Cyber Aurora Edition
 *
 * Luminous micro-badges for status, interests, match percentages, and skills.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Badge Variants ───────────────────────────────────────────────────
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-full font-semibold',
    'transition-all duration-150',
    'select-none',
  ],
  {
    variants: {
      variant: {
        default: 'bg-white/[0.08] text-white border border-white/[0.12]',
        accent:  'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
        cyan:    'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
        violet:  'bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]',
        aurora:  'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
        sage:    'bg-violet-500/15 text-violet-300 border border-violet-500/30',
        success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
        warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        destructive: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
        muted: 'bg-white/[0.04] text-slate-400 border border-white/[0.06]',
        outline: 'bg-transparent border border-white/[0.15] text-white',
        glass: 'bg-[#0F172A]/70 text-slate-200 border border-white/[0.1] backdrop-blur-md',
        // Status-specific badges
        available: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
        busy: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
        coffee: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        // Goal badges
        hiring: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
        seeking: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
      },
      size: {
        xs: 'text-2xs px-2 py-0.5',
        sm: 'text-xs px-2.5 py-0.5',
        md: 'text-xs px-3 py-1',
        lg: 'text-sm px-3.5 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

// ─── Badge Props ──────────────────────────────────────────────────────
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Leading icon or emoji */
  icon?: React.ReactNode;
  /** Show a remove/clear button */
  removable?: boolean;
  /** Callback when remove is clicked */
  onRemove?: () => void;
  /** Dot indicator */
  dot?: boolean;
  /** Dot color class */
  dotColor?: string;
}

// ─── Badge Component ──────────────────────────────────────────────────
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      removable,
      onRemove,
      dot,
      dotColor = 'bg-current',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {/* Status dot */}
        {dot && (
          <span
            className={cn('inline-block rounded-full shrink-0', dotColor, {
              'w-1.5 h-1.5': size === 'xs' || size === 'sm',
              'w-2 h-2': size === 'md' || size === 'lg',
            })}
          />
        )}

        {/* Leading icon */}
        {icon && <span className="shrink-0">{icon}</span>}

        {/* Content */}
        <span>{children}</span>

        {/* Remove button */}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 hover:opacity-80 rounded-full focus:outline-none"
            aria-label="Remove"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
