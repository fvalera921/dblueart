import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#03080f",
        night: "#060d1f",
        cobalt: "#1a3a6e",
        wave: "#2a5cbf",
        sky: "#4a8fd4",
        mist: "#e8eef8"
      },
      fontFamily: {
        display: ["var(--font-cinzel)"],
        body: ["var(--font-inter)"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 12, 28, 0.45)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(74,143,212,0.28), transparent 32%), linear-gradient(135deg, rgba(26,58,110,0.26), transparent 55%)"
      }
    }
  },
  plugins: []
};

export default config;
