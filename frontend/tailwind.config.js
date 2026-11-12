/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eva: {
          navy: '#0B1026',
          dark: '#070A18',
          card: '#15142F',
          surface: '#1E1B4B',
          violet: '#8B5CF6',
          purple: '#A855F7',
          fuchsia: '#D946EF',
          blue: '#3B82F6',
          lavender: '#A5B4FC',
          muted: '#94A3B8',
        },
        brand: {
          50: '#f0f4f9',
          100: '#dde6f2',
          200: '#c0d2e7',
          300: '#94b5d7',
          400: '#6293c3',
          500: '#3f75af',
          600: '#2f5c94',
          700: '#274a79',
          800: '#1e385d',
          900: '#0f1f38',
          950: '#0a1424',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
