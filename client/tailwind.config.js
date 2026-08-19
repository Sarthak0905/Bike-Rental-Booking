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
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981', // Emerald 500
          600: '#059669', // Emerald 600
          700: '#047857', // Emerald 700
          900: '#064e3b',
        },
        dark: {
          800: '#1e293b', // Slate 800
          900: '#0f172a', // Slate 900
          950: '#020617', // Slate 950
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}
