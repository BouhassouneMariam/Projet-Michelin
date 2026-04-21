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
        ink: "#12100d",
        porcelain: "#f7f2e8",
        champagne: "#e7d2a4",
        rouge: "#b22d2d",
        moss: "#425a46"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(18, 16, 13, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
