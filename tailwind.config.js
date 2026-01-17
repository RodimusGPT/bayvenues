/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f8fa',
          100: '#e6eef3',
          200: '#cddde8',
          300: '#a8c4d6',
          400: '#7da5bf',
          500: '#6b8fad',
          600: '#527291',
          700: '#455e77',
          800: '#3c4f63',
          900: '#354454',
        },
        region: {
          'north-bay': '#8B5CF6',
          'peninsula': '#3B82F6',
          'south-bay': '#10B981',
          'monterey': '#F59E0B',
          'santa-cruz': '#EF4444',
          'carmel': '#EC4899',
        },
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
