/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      Garamond: ["Garamond"],
    },

    extend: {
      colors: {
        cinder: {
          50: "#f5f5fa",
          100: "#e9e9f5",
          200: "#cfd1e8",
          300: "#a4a8d5",
          400: "#737abd",
          500: "#5259a5",
          600: "#3f448a",
          700: "#343770",
          800: "#2e305e",
          900: "#2a2b50",
          950: "#090911",
        },
        indigo: {
          50: "#f2f5fc",
          100: "#e2e8f7",
          200: "#cbd6f2",
          300: "#a8bce8",
          400: "#7e9adc",
          500: "#5f7ad2",
          600: "#4a5ec4",
          700: "#414eb4",
          800: "#3a4293",
          900: "#333a75",
          950: "#232548",
        },
        kimberly: {
          50: "#f4f6f9",
          100: "#eaf0f5",
          200: "#d9e2ec",
          300: "#c1cfe0",
          400: "#a8b6d1",
          500: "#919fc3",
          600: "#7a84b1",
          700: "#6f779f",
          800: "#565d7d",
          900: "#494f66",
          950: "#2b2e3b",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
