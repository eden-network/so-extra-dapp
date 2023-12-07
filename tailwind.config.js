/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'glitter-shadow': '0 35px 60px -15px rgba(0, 0, 0, 1.0)'
      },
      dropShadow: {
        'glitter-shadow': '10px 10px 10px rgba(0, 0, 0, 1.0)',
      }
    },
  },
  plugins: [],
}
