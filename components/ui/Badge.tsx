/**
 * Nexus Badge Component
 *
 * Small label chips for status, categories, interests, and skills.
 * Used extensively on profile cards and event listings.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Badge Variants ───────────────────────────────────────────────────
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1',
    'rounded-full font-medium',
    'transition-colors duration-150',
    'select-none',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border border-primary/20',
        accent:  'bg-nexus-indigo/10 text-nexus-indigo border border-nexus-indigo/20 dark:bg-nexus-indigo/20',
        success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
        warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20',
        destructive: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
        muted: 'bg-muted text-muted-foreground border border-border',
        outline: 'bg-transparent border border-border text-foreground',
        // Status-specific badges
        available: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
        busy: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
        coffee: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
        // Goal badges
        hiring: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20',
        seeking: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20',
      },
      size: {
        xs: 'text-2xs px-2 py-0.5',
        sm: 'text-xs px-2.5 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
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
        {icon && (
          <span className="shrink-0 leading-none" aria-hidden="true">
            {icon}
          </span>
        )}

        {children}

        {/* Remove button */}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 rounded-full hover:bg-current/20 p-0.5 transition-colors"
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
