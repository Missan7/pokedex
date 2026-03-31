import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'stat-fill': 'statFill 1s ease-out forwards',
      },
      keyframes: {
        statFill: {
          from: { width: '0%' },
          to: { width: 'var(--stat-width)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
