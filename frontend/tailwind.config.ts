import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'system-ui', 'sans-serif'],
        display: ['"Noto Sans Thai"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          50: '#ffffff',
          100: '#f9fafb',
          200: '#f3f4f6',
          300: '#e5e7eb',
          400: '#d1d5db',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        accent: {
          purple: '#7c3aed',
          pink: '#db2777',
          cyan: '#0891b2',
        },
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(1.3)', opacity: '0.8' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(245, 158, 11, 0.2)' },
          '50%': { boxShadow: '0 0 28px rgba(245, 158, 11, 0.35)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
