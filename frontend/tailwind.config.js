/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CAT brand palette
        cat: {
          yellow: "#FFCD11",
          "yellow-dark": "#F0B400",
          black: "#1A1A1A",
        },
      },
      animation: {
        // Gentle pulse for the safety banner (less jarring than default)
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
