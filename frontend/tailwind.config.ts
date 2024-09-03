import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#FBF5DF",
        cardBg: "#1D1E22",
        primary: "#6C63FF",
        secondary: "#14FFA5",
      },
    },
  },
  plugins: [],
};
export default config;
