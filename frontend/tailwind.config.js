import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grayish: '#5A5A5A',
        background: '#FAF3E0',
        text: '#2E2E2E',
        button: '#D96C3F',
        secondary: '#5D8AA8',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          /* Hide scrollbar for Webkit browsers */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge */
          '-ms-overflow-style': 'none',
          /* Hide scrollbar for Firefox */
          'scrollbar-width': 'none',
        },
      });
    }),
  ],
}
