/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rainbow: {
          orange: "#FF7A00",
          yellow: "#FFE500",
          pink: "#F063F9",
          darkpink: "#C50099",
          blue: "#2114B5",
          purple: "#260056"
        },
        extra: {
          pink: '#CF47FF'
        }
      },
      fontFamily: {
        'modelica': ['Modelica', 'sans-serif'],
        'modelica-bold': ['Modelica-Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
