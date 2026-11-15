/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        eva: {
          charcoal: '#262B32',
          deep: '#191F24',
          gold: '#B8956B',
          champagne: '#EACBA5',
          bg: '#F6F3EE',
          card: '#FFFDFC',
          beige: '#EDE5D9',
          border: '#DFD0BE',
          text: '#262B32',
          subtext: '#68635D',
          darkgold: '#87613B',
          success: '#237451',
          warning: '#966014',
          error: '#B83D3D',
        },
        campus: {
          charcoal: '#292E35',
          deep: '#222426',
          gold: '#B49168',
          champagne: '#EACBA5',
          bronze: '#926B3C',
          beige: '#EDE5DA',
          cream: '#F8F5F1',
          border: '#E4D9CB',
          secondary: '#706A63',
          card: '#F7EFE6',
        },
        brand: {
          50: '#F6F3EE',
          100: '#EDE5D9',
          200: '#DFD0BE',
          300: '#EACBA5',
          400: '#B8956B',
          500: '#87613B',
          600: '#87613B',
          700: '#87613B',
          800: '#262B32',
          900: '#191F24',
          950: '#101417',
        },
        accent: {
          DEFAULT: '#B8956B',
          hover: '#87613B',
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
