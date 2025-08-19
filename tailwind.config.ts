import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // enables dark mode via class="dark"
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",   // App Router
    "./pages/**/*.{js,ts,jsx,tsx}",     // Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", // Components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;