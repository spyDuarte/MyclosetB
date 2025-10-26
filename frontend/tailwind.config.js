/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: {
          600: '#9333ea'
        },
        secondary: {
          600: '#db2777'
        }
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(to bottom right, #faf5ff, #fdf2f8)'
      }
    }
  },
  plugins: []
};
