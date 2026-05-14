/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        sand: {
          50: '#fdf8f0',
          100: '#f9eedb',
          200: '#f2d9aa',
          300: '#e8c070',
          400: '#dda04a',
          500: '#c98228',
          600: '#a8651e',
          700: '#874e1a',
          800: '#6e3e1b',
          900: '#5a3318',
        },
        cerrado: {
          50: '#f2f9f2',
          100: '#dff0df',
          200: '#b8ddb8',
          300: '#82c082',
          400: '#4ea34e',
          500: '#2d852d',
          600: '#1f6a20',
          700: '#1a541b',
          800: '#174318',
          900: '#133715',
        },
        amber: {
          deep: '#B45309',
        },
        sky: {
          cerrado: '#0ea5e9',
        },
        night: '#1a1a0a',
        dusk: '#fdfcfb',
      },
      backgroundImage: {
        'gradient-sand': 'linear-gradient(135deg, #c98228 0%, #e8c070 50%, #dda04a 100%)',
        'gradient-cerrado': 'linear-gradient(180deg, #1a1a0a 0%, #2d1e0a 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
