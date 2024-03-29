/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#192126',
        secondary: '#bbf246',
      },
      fontFamily: {
        headline: ['F1-Regular'],
        boldHeadline: ['F1-Bold'],
      },
      width: {
        '45%': '45%',
      },
      fontSize: {
        xxs: '0.60rem',
      },
      animation: {
        'ping-once': 'ping 1s linear',
      },
      transitionProperty: {
        'height': 'height',
        'maxHeight': 'maxHeight',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [require('daisyui')],
};
