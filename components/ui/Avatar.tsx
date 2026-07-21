/**
 * Nexus Avatar Component
 *
 * Displays a user's profile photo with fallback initials.
 * Supports size variants, status dot overlay, and online indicators.
 */

import * as React from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, getInitials } from '@/lib/utils';
import type { AvailabilityStatus } from '@/types';

// ─── Avatar Size Variants ─────────────────────────────────────────────
const avatarVariants = cva(
  [
    'relative inline-flex shrink-0',
    'items-center justify-center',
    'rounded-full overflow-hidden',
    'bg-muted ring-2 ring-border',
    'font-medium select-none',
  ],
  {
    variants: {
      size: {
        '2xs': 'h-6 w-6 text-2xs ring-1',
        xs: 'h-8 w-8 text-xs ring-1',
        sm: 'h-10 w-10 text-sm',
        md: 'h-12 w-12 text-base',
        lg: 'h-16 w-16 text-lg',
        xl: 'h-20 w-20 text-xl',
        '2xl': 'h-24 w-24 text-2xl',
        '3xl': 'h-32 w-32 text-3xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Status dot size map
const statusDotSize: Record<string, string> = {
  '2xs': 'h-1.5 w-1.5 ring-1',
  xs:    'h-2 w-2 ring-1',
  sm:    'h-2.5 w-2.5 ring-2',
  md:    'h-3 w-3 ring-2',
  lg:    'h-3.5 w-3.5 ring-2',
  xl:    'h-4 w-4 ring-2',
  '2xl': 'h-4 w-4 ring-2',
  '3xl': 'h-5 w-5 ring-2',
};

const statusDotColor: Record<AvailabilityStatus, string> = {
  available:    'bg-emerald-500',
  busy:         'bg-red-500',
  coffee_break: 'bg-amber-500',
};

// ─── Avatar Props ─────────────────────────────────────────────────────
export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  /** Image URL */
  src?: string | null;
  /** Alt text (user's name) */
  alt: string;
  /** Show status dot */
  status?: AvailabilityStatus;
  /** Additional class for the container */
  className?: string;
  /** Priority load (for above-the-fold avatars) */
  priority?: boolean;
}

// ─── Avatar Component ─────────────────────────────────────────────────
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, status, size = 'md', className, priority = false }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    const initials = getInitials(alt);

    // Pixel size for next/image
    const pixelSize: Record<string, number> = {
      '2xs': 24, xs: 32, sm: 40, md: 48, lg: 64, xl: 80, '2xl': 96, '3xl': 128,
    };
    const px = pixelSize[size ?? 'md'] ?? 48;

    return (
      <div ref={ref} className={cn(avatarVariants({ size }), 'relative', className)}>
        {/* Image */}
        {src && !imgError ? (
          <Image
            src={src}
            alt={alt}
            width={px}
            height={px}
            className="object-cover w-full h-full"
            priority={priority}
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback: Initials on gradient background
          <span
            className="flex items-center justify-center w-full h-full
                       bg-gradient-to-br from-nexus-indigo/80 to-nexus-indigo
                       text-white font-semibold"
            aria-label={`Avatar for ${alt}`}
          >
            {initials}
          </span>
        )}

        {/* Status dot */}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0',
              'rounded-full ring-background',
              statusDotSize[size ?? 'md'],
              statusDotColor[status]
            )}
            aria-label={`Status: ${status.replace('_', ' ')}`}
            title={status.replace('_', ' ')}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// ─── Avatar Group ─────────────────────────────────────────────────────
interface AvatarGroupProps {
  avatars: { src?: string | null; alt: string }[];
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

const AvatarGroup = ({ avatars, max = 4, size = 'sm', className }: AvatarGroupProps) => {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          className="ring-2 ring-background"
        />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            avatarVariants({ size }),
            'bg-muted text-muted-foreground ring-2 ring-background text-xs font-medium'
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
