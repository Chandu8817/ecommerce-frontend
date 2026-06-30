/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        // Primary "ink" surface — premium near-black, used for CTAs and emphasis.
        ink: {
          DEFAULT: '#0a0a0a',
          900: '#111113',
          800: '#1c1c1f',
          700: '#2a2a2e',
        },
        // Warm accent for highlights, links and active states.
        accent: {
          50: '#fff8ed',
          100: '#ffefd4',
          400: '#fbbf4a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
