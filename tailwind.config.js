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
        obsidian: {
          950: '#030509',
          900: '#05070E',
          850: '#080C17',
          800: '#0C1120',
          750: '#11172A',
          700: '#171E36',
          600: '#232C4A',
        },
        cbx: {
          primary: 'var(--cbx-primary, #6366F1)',
          secondary: 'var(--cbx-secondary, #4F46E5)',
          accent: 'var(--cbx-accent, #818CF8)',
          glow: 'var(--cbx-glow, rgba(99, 102, 241, 0.5))',
        }
      },
      animation: {
        'blob-slow': 'blobFloat 25s ease-in-out infinite',
        'blob-reverse': 'blobFloatReverse 30s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        blobFloat: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -60px) scale(1.12)' },
          '66%': { transform: 'translate(-30px, 40px) scale(0.92)' },
        },
        blobFloatReverse: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-50px, 50px) scale(1.08)' },
          '66%': { transform: 'translate(40px, -30px) scale(0.95)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.75' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 15px var(--cbx-glow, rgba(99, 102, 241, 0.4)))' },
          '100%': { filter: 'drop-shadow(0 0 35px var(--cbx-glow, rgba(99, 102, 241, 0.8)))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 12px 48px 0 rgba(0, 0, 0, 0.55)',
        'glow-sm': '0 0 20px -5px var(--cbx-glow, rgba(99, 102, 241, 0.4))',
        'glow-md': '0 0 35px -5px var(--cbx-glow, rgba(99, 102, 241, 0.5))',
        'glow-lg': '0 0 60px -10px var(--cbx-glow, rgba(99, 102, 241, 0.6))',
      }
    },
  },
  plugins: [],
}
