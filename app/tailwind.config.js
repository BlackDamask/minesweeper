/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'regural-dark-green': '#1e9907',
        'background-green':'#158a00',
        'dark-tile': '#28ccoa',
        'light-tile': '#39ff13',
      },
      
      fontFamily: {
        customFont: ['"Pixelify"', "sans-serif"],
        pixelFont: ['"Timer"', "sans-serif"],
        ubuntuFont: ['"Ubuntu"', "sans-serif"]
        // Add more custom font families as needed
      },
    },
    variants: {
      extend: {
        margin: ["responsive"], // Ensure margin supports responsiveness
      },
    },
  },
  plugins: [],
}

