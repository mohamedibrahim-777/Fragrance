import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#FFFFFF",
        "surface-2": "#FAF4EC",
        ink: {
          DEFAULT: "#2D1810",       // rich espresso text
          muted: "#7A5C42",          // medium brown
        },
        brand: {
          DEFAULT: "#6F4E37",        // coffee brown
          hover: "#4A2E1B",          // dark espresso
          soft: "#F4E8DC",           // warm cream
        },
        sun: {
          DEFAULT: "#A67C52",
          soft: "#F0E4D2",
        },
        // legacy aliases
        brass: {
          DEFAULT: "#6F4E37",
          hover: "#4A2E1B",
          soft: "#F4E8DC",
        },
        ruby: "#4A2E1B",
        maroon: "#3E2517",
        emerald: "#5A8F6E",
        indigo: "#4A6B8F",
        border: "#E8DAC8",
        success: "#5A8F6E",
        danger: "#B85450",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        tamil: ["var(--font-catamaran)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        brass: "0 10px 28px -12px rgba(111, 78, 55, 0.40)",
        soft: "0 6px 24px -10px rgba(45, 24, 16, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
