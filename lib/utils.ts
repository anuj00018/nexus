import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind CSS classes safely.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 *
 * Usage: cn('px-4 py-2', isActive && 'bg-blue-500', 'px-2') → 'py-2 bg-blue-500 px-2'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with K/M/B suffix for display.
 * e.g. 1200 → "1.2K", 1_500_000 → "1.5M"
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * Format meters to a human-readable distance string.
 * e.g. 45 → "~45m away", 1200 → "~1.2km away"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    // Round to nearest 10m for privacy
    const approx = Math.round(meters / 10) * 10;
    return `~${approx}m away`;
  }
  return `~${(meters / 1000).toFixed(1)}km away`;
}

/**
 * Haversine formula — calculate distance between two GPS coordinates.
 * Returns distance in meters.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6_371_000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Snap GPS coordinates to a grid for privacy protection.
 * Default: 50m grid (prevents exact location exposure).
 */
export function snapToGrid(
  lat: number,
  lng: number,
  gridMeters = 50
): { lat: number; lng: number } {
  // 1 degree latitude ≈ 111,000 meters
  const latDegPerMeter = 1 / 111_000;
  // 1 degree longitude depends on latitude
  const lngDegPerMeter = 1 / (111_000 * Math.cos((lat * Math.PI) / 180));

  const gridLat = gridMeters * latDegPerMeter;
  const gridLng = gridMeters * lngDegPerMeter;

  return {
    lat: Math.round(lat / gridLat) * gridLat,
    lng: Math.round(lng / gridLng) * gridLng,
  };
}

/**
 * Generate a random alphanumeric event join code.
 * e.g. "X7K2NP"
 */
export function generateJoinCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

/**
 * Slugify a string for URLs.
 * e.g. "Tech Summit 2024!" → "tech-summit-2024"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate a string to a max length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Format a date to a human-readable relative string.
 * e.g. "2 hours ago", "in 3 days"
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: diffDays > 365 ? 'numeric' : undefined,
  });
}

/**
 * Format an ISO date to a friendly event date string.
 * e.g. "Jul 20, 2024 · 10:00 AM"
 */
export function formatEventDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' · ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get initials from a name for avatar fallback.
 * e.g. "John Doe" → "JD", "Alice" → "AL"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return name.slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Check if a LinkedIn URL is valid.
 */
export function isValidLinkedInUrl(url: string): boolean {
  return /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(url);
}

/**
 * Debounce a function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Wait for a given number of milliseconds.
 * Useful in async flows.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Capitalize the first letter of each word.
 */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Strip trailing slash from a URL.
 */
export function stripTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}
