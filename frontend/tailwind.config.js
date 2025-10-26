/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 10px 30px rgba(147, 51, 234, 0.25)'
      }
    }
  },
  darkMode: 'class',
  plugins: []
};
