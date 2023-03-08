const plugin = require('tailwindcss/plugin');

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
  // tut nix
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.inline-paragraph': {
          'img + p': {
            display: 'inline',
          },
        },
      });
    }),
  ],
};
