/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#0D0D0D',
          card:    '#161616',
          border:  '#2A2A2A',
          gold:    '#D4A853',
          accent:  '#E8B866',
          muted:   '#888888',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
