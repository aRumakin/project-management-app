/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: { max: '480px' },
        sm: { max: '576px' },
        md: { max: '768px' },
        lg: { max: '992px' },
        xl: { max: '1200px' },
        '2xl': { max: '1336px' },
        '3xl': { max: '1576px' },
      },
      colors: {
        primary: {
          700: '#276769',
          500: '#2F7C7E',
          400: '#369294',
          300: '#A1DFD7',
        },
        secondary: {
          500: '#F17110',
        },
        additional: {
          500: '#F7B122',
          300: '#FCDD9E',
        },
        warning: {
          500: '#C2412B',
        },
        chocolate: {
          500: '#613A3B',
        },
        lightcolor: {
          500: '#FBF1ED',
        },
      },
      boxShadow: {
        '3xl': '4px 4px 8px 0px rgba(34, 60, 80, 0.3)',
        '4xl': '4px 4px 8px 0px rgba(34, 60, 80, 0.6)',
      },
    },
    backgroundImage: {
      pattern: 'url("../src/assets/png/pattern.png")',
    },
  },
  plugins: [],
};
