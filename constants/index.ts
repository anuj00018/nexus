// ===================================================================
// Nexus — Application Constants
// Centralized configuration — no magic strings anywhere
// ===================================================================

// ─── Brand ───────────────────────────────────────────────────────────
export const APP_NAME = 'Nexus' as const;
export const APP_TAGLINE = 'Never miss the right connection at an event.' as const;
export const APP_DESCRIPTION =
  'Discover and connect with relevant people at events, hackathons, and meetups.' as const;

// ─── Routes ──────────────────────────────────────────────────────────
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  // Auth flow
  LINKEDIN_AUTH: '/auth/linkedin',
  AUTH_CALLBACK: '/auth/callback',
  // App
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  JOIN_EVENT: '/events/join',
  EVENT: (id: string) => `/events/${id}`,
  EVENT_NEARBY: (id: string) => `/events/${id}/nearby`,
  EVENT_HEATMAP: (id: string) => `/events/${id}/heatmap`,
  EVENT_RECAP: (id: string) => `/events/${id}/recap`,
  PROFILE: (id: string) => `/profile/${id}`,
  SETTINGS: '/settings',
  // Admin
  ADMIN: '/admin',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_ANNOUNCEMENTS: '/admin/announcements',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_LOGS: '/admin/logs',
} as const;

// ─── API Routes ───────────────────────────────────────────────────────
export const API_ROUTES = {
  AUTH_LINKEDIN: '/api/auth/linkedin',
  EVENTS_JOIN: (id: string) => `/api/events/${id}/join`,
  EVENTS_NEARBY: (id: string) => `/api/events/${id}/nearby`,
  USERS_PROFILE: (id: string) => `/api/users/${id}`,
  LOCATION_UPDATE: '/api/location/update',
  EVENTS_HEATMAP: (id: string) => `/api/events/${id}/heatmap`,
  EVENTS_SUMMARY: (id: string) => `/api/events/${id}/summary`,
} as const;

// ─── Nearby Detection ─────────────────────────────────────────────────
export const NEARBY_CONFIG = {
  /** Default radius in meters */
  DEFAULT_RADIUS_METERS: 100,
  /** Minimum configurable radius */
  MIN_RADIUS_METERS: 20,
  /** Maximum configurable radius */
  MAX_RADIUS_METERS: 500,
  /** Location update interval in milliseconds */
  UPDATE_INTERVAL_MS: 20_000, // 20 seconds
  /** Maximum number of nearby people to show at once */
  MAX_NEARBY_COUNT: 50,
  /** Geolocation options */
  GEO_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 10_000,
    maximumAge: 15_000,
  },
  /** Grid snap precision for privacy (meters) */
  LOCATION_SNAP_METERS: 50,
} as const;

// ─── Onboarding ───────────────────────────────────────────────────────
export const ONBOARDING = {
  MAX_INTERESTS: 5,
  MAX_SKILLS: 10,
  MAX_BIO_LENGTH: 300,
  MAX_GOALS: 3,
} as const;

// ─── Event ────────────────────────────────────────────────────────────
export const EVENT_CONFIG = {
  JOIN_CODE_LENGTH: 6,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_TAGS: 10,
} as const;

// ─── Validation ───────────────────────────────────────────────────────
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_HEADLINE_LENGTH: 220,
  MAX_COMPANY_LENGTH: 100,
  MAX_BIO_LENGTH: 300,
  LINKEDIN_URL_REGEX: /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
  GITHUB_URL_REGEX: /^https:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
} as const;

// ─── UI ──────────────────────────────────────────────────────────────
export const UI = {
  TOAST_DURATION: 4000,
  ANIMATION_DURATION_MS: 300,
  DEBOUNCE_DELAY_MS: 300,
  SEARCH_DEBOUNCE_MS: 400,
} as const;

// ─── Attendee Goals with labels ───────────────────────────────────────
export const ATTENDEE_GOALS = [
  { value: 'networking', label: 'Networking', emoji: '🤝' },
  { value: 'hiring', label: 'Hiring', emoji: '👔' },
  { value: 'internship', label: 'Looking for Internship', emoji: '🎓' },
  { value: 'job_seeking', label: 'Looking for a Job', emoji: '🔍' },
  { value: 'co_founder', label: 'Finding Co-founder', emoji: '🚀' },
  { value: 'mentoring', label: 'Mentoring / Being Mentored', emoji: '💡' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'investing', label: 'Investing', emoji: '💰' },
] as const;

// ─── Availability Options ─────────────────────────────────────────────
export const AVAILABILITY_OPTIONS = [
  {
    value: 'available',
    label: 'Available',
    description: 'Open to meet and chat anytime',
    color: 'text-emerald-600',
    dotClass: 'status-dot-online',
  },
  {
    value: 'busy',
    label: 'Busy',
    description: 'Focused, please don\'t disturb',
    color: 'text-red-500',
    dotClass: 'status-dot-busy',
  },
  {
    value: 'coffee_break',
    label: 'Coffee Break Only',
    description: 'Available during breaks only',
    color: 'text-yellow-600',
    dotClass: 'status-dot-away',
  },
] as const;

// ─── Privacy Options ──────────────────────────────────────────────────
export const PRIVACY_OPTIONS = [
  {
    value: 'everyone',
    label: 'Everyone',
    description: 'All event attendees can discover you',
    icon: '🌍',
  },
  {
    value: 'matching_interests',
    label: 'Matching Interests',
    description: 'Only people with shared interests can see you',
    icon: '🎯',
  },
  {
    value: 'invisible',
    label: 'Invisible',
    description: 'You won\'t appear in discovery',
    icon: '👻',
  },
] as const;

// ─── Event Categories ─────────────────────────────────────────────────
export const EVENT_CATEGORIES = [
  { value: 'hackathon', label: 'Hackathon', emoji: '⚡' },
  { value: 'conference', label: 'Conference', emoji: '🎤' },
  { value: 'meetup', label: 'Meetup', emoji: '☕' },
  { value: 'career_fair', label: 'Career Fair', emoji: '💼' },
  { value: 'workshop', label: 'Workshop', emoji: '🛠️' },
  { value: 'college_fest', label: 'College Fest', emoji: '🎓' },
  { value: 'startup_event', label: 'Startup Event', emoji: '🚀' },
  { value: 'other', label: 'Other', emoji: '📅' },
] as const;

// ─── Query Keys ───────────────────────────────────────────────────────
export const QUERY_KEYS = {
  USER: (id: string) => ['user', id],
  CURRENT_USER: ['current-user'],
  EVENTS: ['events'],
  EVENT: (id: string) => ['event', id],
  NEARBY: (eventId: string) => ['nearby', eventId],
  HEATMAP: (eventId: string) => ['heatmap', eventId],
  RECAP: (eventId: string) => ['recap', eventId],
  INTERESTS: ['interests'],
  PROFILE_VIEWS: (eventId: string) => ['profile-views', eventId],
  // Admin
  ADMIN_ANALYTICS: ['admin-analytics'],
  ADMIN_USERS: ['admin-users'],
  ADMIN_EVENTS: ['admin-events'],
  ADMIN_LOGS: ['admin-logs'],
} as const;

// ─── Supabase Table Names ─────────────────────────────────────────────
export const DB_TABLES = {
  USERS: 'users',
  USER_PREFERENCES: 'user_preferences',
  USER_INTERESTS: 'user_interests',
  INTERESTS: 'interests',
  EVENTS: 'events',
  EVENT_PARTICIPANTS: 'event_participants',
  PROFILE_VIEWS: 'profile_views',
  RATINGS: 'ratings',
  ANNOUNCEMENTS: 'announcements',
  ADMIN_LOGS: 'admin_logs',
} as const;

// ─── Error Codes ──────────────────────────────────────────────────────
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  EVENT_FULL: 'EVENT_FULL',
  INVALID_JOIN_CODE: 'INVALID_JOIN_CODE',
  LOCATION_DENIED: 'LOCATION_DENIED',
  LINKEDIN_AUTH_FAILED: 'LINKEDIN_AUTH_FAILED',
} as const;
