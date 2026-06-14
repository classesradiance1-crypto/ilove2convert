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
        primary: {
          50: "#fff1f1",
          100: "#ffe1e1",
          500: "#e8394d",
          600: "#d42a3e",
          700: "#b21e30",
        },
      },
    },
  },
  plugins: [],
};
export default config;
