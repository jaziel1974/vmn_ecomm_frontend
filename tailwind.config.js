// filepath: /home/jaziel/NextJs/ecommerce/ecommerce-front/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'], // Use the CSS variable
      },
    },
  },
  plugins: [],
}