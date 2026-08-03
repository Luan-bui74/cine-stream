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
        brand: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-light': 'var(--color-surface-light)',
          'surface-border': 'var(--color-surface-border)',
          accent: '#ff3b5c',
          'accent-hover': '#e02848',
          'accent-glow': 'rgba(255, 59, 92, 0.25)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          dim: 'var(--color-dim)',
          gold: '#eab308',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      aspectRatio: {
        'poster': '2/3',
        'backdrop': '16/9',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'accent-glow': '0 0 20px -3px rgba(255, 59, 92, 0.4)',
        'card-hover': '0 12px 30px -10px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
