/**
 * Nexus Card Component — Cyber Aurora Edition
 *
 * Composable card with Header, Content, Footer sub-components.
 * Supports multiple visual variants: default, glass, cyber, elevated.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ─── Card Variants ────────────────────────────────────────────────────
const cardVariants = cva(
  'rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        // Deep obsidian cyber card
        default: [
          'bg-[#0A0F22]/85 text-card-foreground',
          'border border-white/[0.08]',
          'shadow-2xl hover:border-cyan-500/40 hover:shadow-glow-card',
        ],
        // Premium Glass morphism
        glass: [
          'bg-[#090D1E]/75',
          'backdrop-blur-2xl',
          'border border-white/[0.08]',
          'shadow-2xl hover:border-violet-500/40 hover:shadow-glow-violet',
        ],
        // Cyber Aurora Highlight Card
        cyber: [
          'bg-gradient-to-br from-[#0D1430]/90 to-[#070B1A]/90',
          'backdrop-blur-2xl',
          'border border-cyan-500/30',
          'shadow-glow-aurora',
        ],
        // Strong border — for interactive selection states
        bordered: [
          'bg-[#0A0F22] text-card-foreground',
          'border border-cyan-500/30',
          'hover:border-cyan-400/60 hover:shadow-glow-cyan',
        ],
        // Elevated — floating feel with smooth hover lift
        elevated: [
          'bg-[#0B1028] text-card-foreground',
          'border border-white/[0.08]',
          'shadow-2xl',
          'hover:-translate-y-1.5 hover:border-cyan-500/40 hover:shadow-glow-aurora transition-all duration-300',
        ],
        // Ghost — invisible container with spacing
        ghost: 'bg-transparent',
        // Muted — subtle background, no border
        muted: 'bg-[#080D1D] text-muted-foreground',
        // Accent — electric violet highlight card
        accent: [
          'bg-violet-950/20',
          'border border-violet-500/30',
          'text-card-foreground',
        ],
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-card-hover active:scale-[0.99]',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

// ─── Card Props ───────────────────────────────────────────────────────
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

// ─── Card ─────────────────────────────────────────────────────────────
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive, className }))}
      {...props}
    />
  )
);
Card.displayName = 'Card';

// ─── Card Header ──────────────────────────────────────────────────────
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// ─── Card Title ───────────────────────────────────────────────────────
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-display font-bold text-lg leading-tight tracking-tight text-white',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// ─── Card Description ─────────────────────────────────────────────────
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-400 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// ─── Card Content ─────────────────────────────────────────────────────
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

// ─── Card Footer ──────────────────────────────────────────────────────
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-white/[0.06]', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
