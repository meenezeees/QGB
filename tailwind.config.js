/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#000020',
          deep: '#060614',
          card: '#101026',
        },
        ametista: {
          DEFAULT: '#9448AC',
          light: '#B66BD0',
          glow: '#A852C3',
          dark: '#480355',
          deep: '#300139',
        },
        slate: {
          grey: '#6A6A70',
          dark: '#45454C',
          muted: '#8D8D96',
        },
        surface: {
          light: '#F8F7FA',
          card: '#FFFFFF',
          dark: '#0C0B14',
          cardDark: '#141320',
          borderDark: 'rgba(148, 72, 172, 0.18)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        'brand': '0 10px 30px -10px rgba(148, 72, 172, 0.3)',
        'brand-lg': '0 20px 40px -15px rgba(72, 3, 85, 0.4)',
        'glow': '0 0 25px rgba(148, 72, 172, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
