/**
 * Nexus Card Component
 *
 * Composable card with Header, Content, Footer sub-components.
 * Supports multiple visual variants: default, glass, bordered, elevated.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ─── Card Variants ────────────────────────────────────────────────────
const cardVariants = cva(
  'rounded-xl transition-all duration-300',
  {
    variants: {
      variant: {
        // Clean card with subtle border
        default: [
          'bg-card text-card-foreground',
          'border border-border',
          'shadow-card hover:shadow-card-hover',
        ],
        // Premium Glass morphism
        glass: [
          'bg-white/[0.03] dark:bg-white/[0.03]',
          'backdrop-blur-xl',
          'border border-white/[0.06]',
          'shadow-glass',
        ],
        // Strong border — for interactive selection states
        bordered: [
          'bg-card text-card-foreground',
          'border-2 border-border',
          'hover:border-accent/50',
        ],
        // Elevated — floating feel with hover lift
        elevated: [
          'bg-card text-card-foreground',
          'border border-border',
          'shadow-xl hover:shadow-2xl',
          'hover:-translate-y-1 transition-transform duration-300',
        ],
        // Ghost — invisible container with spacing
        ghost: 'bg-transparent',
        // Muted — subtle background, no border
        muted: 'bg-muted text-muted-foreground',
        // Accent — electric blue tinted highlight card
        accent: [
          'bg-accent/5 dark:bg-accent/10',
          'border border-accent/20',
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
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-semibold text-lg leading-tight tracking-tight text-foreground',
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
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
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
    className={cn('flex items-center pt-4 border-t border-border mt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
