/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#F97316',
        },
        yellow: {
          500: '#EAB308',
        },
      },
    },
  },
  plugins: [],
}
