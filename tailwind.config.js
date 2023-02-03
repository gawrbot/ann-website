/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        heroine: "url('../public/hw1.jpg')",
      },
      scale: {
        10: '0.1',
      },
    },
  },
  plugins: [require('@vivgui/tailwindcss-hyphens')],
};
