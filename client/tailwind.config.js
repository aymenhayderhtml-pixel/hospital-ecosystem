/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
        hospital: {
          green: '#10b981',
          blue: '#0ea5e9',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}
