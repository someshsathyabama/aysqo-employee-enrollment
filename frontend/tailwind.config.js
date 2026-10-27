/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dce5f1',
          200: '#bdcfe3',
          300: '#91b1d1',
          400: '#608ebc',
          500: '#3e71a5',
          600: '#2e5888',
          700: '#1e3d64',
          800: '#142a47',
          900: '#0c1b30',
          950: '#07101f',
        },
        corporate: {
          blue: '#1b4b8a',
          accent: '#2563eb',
          slate: '#475569',
          border: '#e2e8f0',
          bg: '#f8fafc',
          surface: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
