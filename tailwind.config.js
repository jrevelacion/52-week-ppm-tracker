/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a7ea4',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        background: '#ffffff',
        surface: '#f5f5f5',
        foreground: '#11181c',
        muted: '#687076',
        border: '#e5e7eb',
      },
    },
  },
  plugins: [],
}
