// ===================================================================
// Zod Validation Schemas
// Central validation layer — used by React Hook Form + API routes
// ===================================================================
import { z } from 'zod';

// ─── Onboarding Step Schemas ──────────────────────────────────────────

export const goalsSchema = z.object({
  goals: z
    .array(z.enum(['networking','hiring','internship','job_seeking','co_founder','mentoring','learning','investing']))
    .min(1, 'Select at least one goal')
    .max(3, 'Select up to 3 goals'),
});

export const interestsSchema = z.object({
  interest_ids: z
    .array(z.string().uuid())
    .min(1, 'Select at least one interest')
    .max(5, 'Select up to 5 interests'),
});

export const availabilitySchema = z.object({
  availability: z.enum(['available', 'busy', 'coffee_break']),
  privacy: z.enum(['everyone', 'matching_interests', 'invisible']),
});

export const profileSchema = z.object({
  bio: z
    .string()
    .max(300, 'Bio must be 300 characters or less')
    .optional(),
  skills: z
    .array(z.string().min(1).max(50))
    .max(10, 'Add up to 10 skills')
    .default([]),
  contact_preference: z.enum(['open', 'selective', 'closed']).default('open'),
  linkedin_url: z
    .string()
    .regex(/^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/, 'Enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  github_url: z
    .string()
    .regex(/^https:\/\/(www\.)?github\.com\/[\w-]+\/?$/, 'Enter a valid GitHub URL')
    .optional()
    .or(z.literal('')),
  portfolio_url: z
    .string()
    .url('Enter a valid URL')
    .optional()
    .or(z.literal('')),
});

// Full onboarding data (all steps combined)
export const onboardingSchema = goalsSchema
  .merge(interestsSchema)
  .merge(availabilitySchema)
  .merge(profileSchema);

export type OnboardingData = z.infer<typeof onboardingSchema>;

// ─── Event Schemas ────────────────────────────────────────────────────
export const joinEventSchema = z.object({
  join_code: z
    .string()
    .length(6, 'Event code must be 6 characters')
    .toUpperCase()
    .regex(/^[A-Z0-9]{6}$/, 'Code must be letters and numbers only'),
});

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title too short').max(100, 'Title too long'),
  description: z.string().max(2000).optional(),
  category: z.enum(['hackathon','conference','meetup','career_fair','workshop','college_fest','startup_event','other']),
  venue_name: z.string().min(2, 'Enter a venue name').max(200),
  venue_address: z.string().min(5, 'Enter a venue address').max(300),
  start_time: z.string().datetime({ offset: true }),
  end_time: z.string().datetime({ offset: true }),
  max_attendees: z.number().int().positive().optional(),
  is_private: z.boolean().default(false),
  tags: z.array(z.string()).max(10).default([]),
}).refine(d => new Date(d.end_time) > new Date(d.start_time), {
  message: 'End time must be after start time',
  path: ['end_time'],
});

// ─── Profile Update Schema ─────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  headline: z.string().max(220).optional(),
  company: z.string().max(100).optional(),
  bio: z.string().max(300).optional(),
  linkedin_url: z.string().regex(/^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/).optional().or(z.literal('')),
  github_url: z.string().regex(/^https:\/\/(www\.)?github\.com\/[\w-]+\/?$/).optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  skills: z.array(z.string()).max(10).default([]),
});

export type JoinEventData = z.infer<typeof joinEventSchema>;
export type CreateEventData = z.infer<typeof createEventSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
