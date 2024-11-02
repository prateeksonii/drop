const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Giphurs', ...fontFamily.sans],
      },
      colors: {
        primary: {
          100: '#0085ff',
          200: '#69b4ff',
          300: '#e0ffff',
        },
        accent: {
          100: '#006fff',
          200: '#e1ffff',
        },
        text: {
          100: '#FFFFFF',
          200: '#9e9e9e',
        },
        bg: {
          100: '#1E1E1E',
          200: '#2d2d2d',
          300: '#454545',
        },
      },
    },
  },
  plugins: [],
};
