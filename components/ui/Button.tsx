/**
 * Nexus Button Component — Cyber Aurora Edition
 *
 * Built with class-variance-authority (cva) for type-safe variant management.
 * Supports loading state, icon slots, shimmering aurora effects, and micro-animations.
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
    'font-medium text-sm rounded-xl',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]',
    'disabled:opacity-50 disabled:pointer-events-none',
    'active:scale-[0.97]',
    'select-none',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        // Cyber Aurora primary CTA (Violet to Cyan gradient with energetic glow)
        primary: [
          'bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white font-bold',
          'hover:brightness-110 hover:shadow-glow-aurora',
          'border border-white/15',
        ],
        // Electric Violet accent button
        accent: [
          'bg-[#8B5CF6] text-white font-bold',
          'hover:bg-[#7C3AED] hover:shadow-glow-violet',
          'border border-violet-400/30',
        ],
        // Neon Cyan highlight button
        cyan: [
          'bg-[#06B6D4] text-white font-bold',
          'hover:bg-[#0891B2] hover:shadow-glow-cyan',
          'border border-cyan-300/30',
        ],
        // Frosted obsidian cyber glass secondary
        secondary: [
          'bg-[#0F172A]/80 text-white font-semibold',
          'border border-white/10',
          'hover:bg-[#1E293B] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
        ],
        // Transparent outline with cyber border
        outline: [
          'bg-transparent text-slate-200 font-semibold',
          'border border-white/15',
          'hover:border-violet-500/50 hover:bg-violet-950/20 hover:text-white',
        ],
        // Clean transparent
        ghost: [
          'bg-transparent text-slate-300',
          'hover:bg-white/[0.07] hover:text-white',
        ],
        // Destructive
        destructive: [
          'bg-rose-600 text-white font-semibold',
          'hover:bg-rose-700 shadow-md',
        ],
        // Success
        success: [
          'bg-emerald-600 text-white font-semibold',
          'hover:bg-emerald-500 shadow-md',
        ],
        // Link style
        link: [
          'bg-transparent text-[#06B6D4] underline-offset-4',
          'hover:underline',
          'h-auto p-0',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
        md: 'h-11 px-5 text-sm rounded-xl',
        lg: 'h-12 px-6 text-base rounded-xl',
        xl: 'h-14 px-8 text-base rounded-2xl font-bold',
        icon: 'h-10 w-10 p-0 rounded-xl',
        'icon-sm': 'h-8 w-8 p-0 rounded-lg',
        'icon-lg': 'h-12 w-12 p-0 rounded-2xl',
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
    const Comp = asChild ? Slot : 'button';

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth }), className)}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            {loadingText ? <span>{loadingText}</span> : children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
