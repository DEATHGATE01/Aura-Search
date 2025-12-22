
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        primary: {
          DEFAULT: "#6366f1", // Indigo 500
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#a855f7", // Purple 500
          foreground: "#ffffff",
        },
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(to right, #6366f1, #a855f7, #3b82f6)',
        'aurora-subtle': 'linear-gradient(180deg, rgba(99, 102, 241, 0.15) 0%, rgba(10, 10, 15, 0) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 10s ease infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
