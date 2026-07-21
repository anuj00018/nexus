/**
 * Nexus Button Component
 *
 * Built with class-variance-authority (cva) for type-safe variant management.
 * Supports loading state, icon slots, and all design system variants.
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Variant Definitions ─────────────────────────────────────────────
const buttonVariants = cva(
  // Base classes — applied to all variants
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium text-sm rounded-lg',
    'transition-all duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:opacity-50 disabled:pointer-events-none',
    'active:scale-[0.98]',
    'select-none',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        // Black button — primary CTA
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          'shadow-sm hover:shadow-md',
        ],
        // Indigo accent button — highlighted actions
        accent: [
          'bg-nexus-indigo text-white',
          'hover:bg-nexus-indigo-dark',
          'shadow-glow-indigo-sm hover:shadow-glow-indigo',
        ],
        // White/light secondary
        secondary: [
          'bg-secondary text-secondary-foreground',
          'border border-border',
          'hover:bg-muted',
        ],
        // Transparent with border
        outline: [
          'bg-transparent text-foreground',
          'border border-border',
          'hover:bg-secondary hover:border-foreground/20',
        ],
        // Completely transparent — text only
        ghost: [
          'bg-transparent text-foreground',
          'hover:bg-secondary',
        ],
        // Destructive — delete, error actions
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90',
          'shadow-sm',
        ],
        // Success — confirm, complete actions
        success: [
          'bg-success text-success-foreground',
          'hover:bg-success/90',
          'shadow-sm',
        ],
        // Link style
        link: [
          'bg-transparent text-nexus-indigo underline-offset-4',
          'hover:underline',
          'h-auto p-0',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
        md: 'h-10 px-4 text-sm rounded-lg',
        lg: 'h-12 px-6 text-base rounded-xl',
        xl: 'h-14 px-8 text-lg rounded-xl font-semibold',
        icon: 'h-10 w-10 p-0 rounded-lg',
        'icon-sm': 'h-8 w-8 p-0 rounded-md',
        'icon-lg': 'h-12 w-12 p-0 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// ─── Button Props ─────────────────────────────────────────────────────
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
  /** Render as child element (e.g. Next.js Link) */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      loadingText,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<any>}
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
            {loadingText ?? children}
          </span>
        ) : leftIcon || rightIcon ? (
          <span className="inline-flex items-center justify-center gap-2">
            {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);


Button.displayName = 'Button';

export { Button, buttonVariants };
