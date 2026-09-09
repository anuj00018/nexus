import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Brand Color Palette: Cyber Aurora (Electric Violet + Neon Cyan + Cosmic Obsidian) ─
      colors: {
        // Base
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Card
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Popover
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Primary: Electric Violet & Neon Cyan
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        // Secondary
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Muted
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        // Accent
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6', // Electric Violet
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },

        // Success (Neon Emerald)
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },

        // Destructive (Electric Rose / Coral)
        destructive: {
          DEFAULT: '#F43F5E',
          foreground: '#FFFFFF',
        },

        // Border and ring
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Cyber Aurora Brand Specific Tokens
        cyber: {
          violet: '#8B5CF6',
          'violet-light': '#A78BFA',
          'violet-dark': '#6D28D9',
          cyan: '#06B6D4',
          'cyan-light': '#22D3EE',
          'cyan-dark': '#0891B2',
          blue: '#3B82F6',
          'blue-dark': '#1D4ED8',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
          cosmic: '#030712',
          surface: '#070B19',
          elevated: '#0D1326',
          card: '#0F172A',
        },

        // Nexus backward compatibility tokens (mapped to Cyber Aurora)
        nexus: {
          black: '#030712',
          'black-warm': '#060813',
          'black-card': '#0B0F1F',
          'black-surface': '#0F1629',
          navy: '#030712',
          'navy-light': '#0A0E22',
          white: '#FFFFFF',
          'white-soft': '#F8FAFC',
          'white-muted': '#CBD5E1',
          'white-dim': '#94A3B8',
          sage: '#8B5CF6',
          'sage-light': '#A78BFA',
          'sage-dark': '#7C3AED',
          'sage-muted': '#C4B5FD',
          'sage-subtle': 'rgba(139, 92, 246, 0.12)',
          indigo: '#8B5CF6',
          'indigo-dark': '#6D28D9',
          electric: '#06B6D4',
          'electric-light': '#22D3EE',
          cyan: '#06B6D4',
          'cyan-dark': '#0891B2',
          purple: '#8B5CF6',
          'purple-dark': '#7C3AED',
          emerald: '#10B981',
          'soft-red': '#F43F5E',
          gray: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
            950: '#030712',
          },
        },
      },

      // ─── Typography ────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.15' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },

      // ─── Box Shadows (Cyber Aurora Glows) ──────────────────────────
      boxShadow: {
        'glow-violet': '0 0 25px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.45)',
        'glow-aurora': '0 0 35px rgba(139, 92, 246, 0.35), 0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.45)',
        'glow-subtle': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glow-card': '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.1)',
      },

      // ─── Animations & Keyframes ────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'radar-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'radar-pulse': {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '50%': { transform: 'scale(1.4)', opacity: '0.3' },
          '100%': { transform: 'scale(2.0)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-8px) translateX(4px)' },
          '50%': { transform: 'translateY(-4px) translateX(-4px)' },
          '75%': { transform: 'translateY(-12px) translateX(2px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'shimmer-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'radar-spin': 'radar-spin 4s linear infinite',
        'radar-pulse': 'radar-pulse 2.5s ease-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease-in-out infinite',
        'border-beam': 'border-beam 6s linear infinite',
        'shimmer-slide': 'shimmer-slide 2.5s ease-in-out infinite',
      },

      // ─── Backdrop Blur ─────────────────────────────────────────────
      backdropBlur: {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
        'glass-sm': '8px',
        'glass': '16px',
        'glass-md': '24px',
        'glass-xl': '40px',
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function({ addUtilities }: any) {
      addUtilities({
        '.text-balance': { textWrap: 'balance' },
        '.text-pretty': { textWrap: 'pretty' },
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        '.glass-cyber': {
          'background': 'rgba(11, 15, 31, 0.72)',
          'backdrop-filter': 'blur(24px)',
          '-webkit-backdrop-filter': 'blur(24px)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.glass-aurora': {
          'background': 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.05) 50%, rgba(11, 15, 31, 0.8) 100%)',
          'backdrop-filter': 'blur(28px)',
          '-webkit-backdrop-filter': 'blur(28px)',
          'border': '1px solid rgba(139, 92, 246, 0.25)',
          'box-shadow': '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.12)',
        },
      });
    }),
  ],
};

export default config;
