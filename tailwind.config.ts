import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#191919",
        porcelain: "#F5F4F2",
        champagne: "#FFFFFF",
        rouge: "#BA0B2F",
        moss: "#425a46"
      },
      boxShadow: {
        premium: "0 2px 12px rgba(0, 0, 0, 0.04)"
      }
    }
  },
  plugins: []
};

export default config;
