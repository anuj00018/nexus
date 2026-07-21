// ===================================================================
// Nexus — Shared TypeScript Types & Interfaces
// Central type registry for the entire application
// ===================================================================

// ─── Utility Types ───────────────────────────────────────────────────
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string; // UUID from Supabase

// ─── User & Auth ─────────────────────────────────────────────────────

/** Availability status during an event */
export type AvailabilityStatus = 'available' | 'busy' | 'coffee_break';

/** Privacy setting for discovery */
export type PrivacySetting = 'everyone' | 'matching_interests' | 'invisible';

/** User's role in the platform */
export type UserRole = 'attendee' | 'organizer' | 'admin' | 'founder';

/** Goals / reasons for attending an event */
export type AttendeeGoal =
  | 'networking'
  | 'hiring'
  | 'internship'
  | 'job_seeking'
  | 'co_founder'
  | 'mentoring'
  | 'learning'
  | 'investing';

/** Core user profile */
export interface User {
  id: ID;
  email: string;
  name: string;
  avatar_url: Nullable<string>;
  headline: Nullable<string>;       // e.g. "Software Engineer at Google"
  company: Nullable<string>;        // Current company or college
  linkedin_url: Nullable<string>;   // LinkedIn profile URL
  github_url: Nullable<string>;     // Optional
  portfolio_url: Nullable<string>;  // Optional
  bio: Nullable<string>;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

/** Extended public profile (for discovery cards) */
export interface PublicProfile extends Pick<
  User,
  'id' | 'name' | 'avatar_url' | 'headline' | 'company' | 'linkedin_url' | 'github_url' | 'portfolio_url' | 'bio'
> {
  interests: Interest[];
  goals: AttendeeGoal[];
  skills: string[];
  average_rating: number;
  review_count: number;
  collaborations_count: number;
  distance_meters?: number;         // Only present in nearby queries
}

/** User preferences (per-event or global) */
export interface UserPreference {
  id: ID;
  user_id: ID;
  availability: AvailabilityStatus;
  privacy: PrivacySetting;
  goals: AttendeeGoal[];
  contact_preference: ContactPreference;
  updated_at: string;
}

export type ContactPreference = 'open' | 'selective' | 'closed';

// ─── Interests ───────────────────────────────────────────────────────

/** Interest/tag category */
export type InterestCategory =
  | 'technology'
  | 'design'
  | 'business'
  | 'science'
  | 'arts'
  | 'sports'
  | 'education'
  | 'other';

export interface Interest {
  id: ID;
  name: string;
  slug: string;
  category: InterestCategory;
  icon?: string;  // Emoji or icon name
  color?: string; // Brand color for the tag
}

// ─── Events ──────────────────────────────────────────────────────────

export type EventStatus = 'draft' | 'published' | 'active' | 'ended' | 'cancelled';
export type EventCategory =
  | 'hackathon'
  | 'conference'
  | 'meetup'
  | 'career_fair'
  | 'workshop'
  | 'college_fest'
  | 'startup_event'
  | 'other';

export interface Event {
  id: ID;
  title: string;
  slug: string;
  description: Nullable<string>;
  category: EventCategory;
  status: EventStatus;
  organizer_id: ID;
  cover_image_url: Nullable<string>;
  venue_name: Nullable<string>;
  venue_address: Nullable<string>;
  // Precise location stored server-side only — never exposed to clients
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  start_time: string;   // ISO 8601
  end_time: string;     // ISO 8601
  join_code: string;    // 6-character alphanumeric
  max_attendees: Nullable<number>;
  is_private: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

/** Public event (coordinates stripped) */
export type PublicEvent = Omit<Event, 'latitude' | 'longitude'>;

export interface EventParticipant {
  id: ID;
  event_id: ID;
  user_id: ID;
  joined_at: string;
  left_at: Nullable<string>;
  // Location (approximate — stored with ~100m precision for display)
  last_lat: Nullable<number>;
  last_lng: Nullable<number>;
  last_location_update: Nullable<string>;
}

/** Participant with public profile data for discovery cards */
export interface NearbyPerson extends PublicProfile {
  participant_id: ID;
  distance_meters: number;
  availability: AvailabilityStatus;
  privacy: PrivacySetting;
  joined_at: string;
}

// ─── Profile Views ───────────────────────────────────────────────────

export interface ProfileView {
  id: ID;
  event_id: ID;
  viewer_id: ID;
  viewed_id: ID;
  viewed_at: string;
}

// ─── Ratings & Reviews ───────────────────────────────────────────────

export interface Rating {
  id: ID;
  rater_id: ID;
  rated_id: ID;
  event_id: ID;
  score: 1 | 2 | 3 | 4 | 5;
  review: Nullable<string>;
  created_at: string;
}

// ─── Opportunity Recap ───────────────────────────────────────────────

export interface OpportunityRecap {
  event_id: ID;
  event_title: string;
  profiles_viewed: number;
  profile_views_received: number;
  connections_potential: number; // People who viewed you + you viewed them
  top_matches: PublicProfile[];
  duration_minutes: number;
}

// ─── Heatmap ─────────────────────────────────────────────────────────

export interface HeatmapPoint {
  lat: number;       // Approximate (snapped to 50m grid)
  lng: number;       // Approximate
  weight: number;    // Density weight (0–1)
  count: number;     // Number of people at this point
}

export interface HeatmapData {
  event_id: ID;
  points: HeatmapPoint[];
  generated_at: string;
  total_active_users: number;
}

// ─── Admin / Founder Dashboard ───────────────────────────────────────

export interface PlatformAnalytics {
  total_users: number;
  total_events: number;
  active_events: number;
  total_profile_views: number;
  linkedin_opens: number;
  // Growth (last 30 days)
  new_users_30d: number;
  new_events_30d: number;
  // Engagement
  avg_attendees_per_event: number;
  avg_profiles_viewed_per_user: number;
}

export interface AdminLog {
  id: ID;
  admin_id: ID;
  action: string;
  target_type: 'user' | 'event' | 'announcement' | 'system';
  target_id: Nullable<ID>;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Announcement {
  id: ID;
  title: string;
  message: string;
  target: 'all' | 'event' | 'organizers';
  event_id: Nullable<ID>;
  sent_by: ID;
  sent_at: string;
}

// ─── API Response Types ──────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ─── Form Types ──────────────────────────────────────────────────────

export interface OnboardingFormData {
  goals: AttendeeGoal[];
  interest_ids: ID[];  // Up to 5
  availability: AvailabilityStatus;
  privacy: PrivacySetting;
  bio?: string;
  skills: string[];
  contact_preference: ContactPreference;
}

export interface CreateEventFormData {
  title: string;
  description: string;
  category: EventCategory;
  venue_name: string;
  venue_address: string;
  latitude?: number;
  longitude?: number;
  start_time: string;
  end_time: string;
  max_attendees?: number;
  is_private: boolean;
  tags: string[];
  cover_image?: File;
}

// ─── Navigation ──────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: number;
  isExternal?: boolean;
}

// ─── Component Props Helpers ─────────────────────────────────────────

export interface ClassNameProps {
  className?: string;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface WithClassAndChildren extends ClassNameProps, ChildrenProps {}
