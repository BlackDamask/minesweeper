/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'regural-dark-green': '#1e9907',
      },
      fontFamily: {
        customFont: ['"Pixelify"', "sans-serif"],
        // Add more custom font families as needed
      },
    },
  },
  plugins: [],
}

