/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      scrollbar: {
        none: "scrollbar-none",
        hide: "scrollbar-hide",
        thin: "scrollbar-thin",
        fat: "scrollbar-fat",
      },
      colors: {
        primary: "#B15A1A",
        secondary: "#FFB479",
      },
      fontFamily: {
        capriola: ["var(--font-capriola)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"], // your default font

        // capriola: ['var(--font-capriola)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
