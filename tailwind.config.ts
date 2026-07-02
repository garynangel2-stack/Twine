import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Loopline brand palette
        ink: "#0f1115",
        paper: "#f7f6f2",
        brand: {
          50: "#eefaf4",
          100: "#d6f2e4",
          200: "#aee4cb",
          300: "#77d0ab",
          400: "#3fb587",
          500: "#1c9a6c",
          600: "#0f7c56",
          700: "#0c6346",
          800: "#0c4f39",
          900: "#0a4130",
        },
        accent: "#f2a900",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,17,21,0.04), 0 8px 24px rgba(15,17,21,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
