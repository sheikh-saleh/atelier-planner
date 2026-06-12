import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#FCFAF6",
          100: "#FAF7F2",
          200: "#F2EDE3",
          300: "#E8E2D5",
          400: "#D9D0BD",
        },
        ink: {
          50: "#F5F4F2",
          100: "#E2DFD9",
          200: "#A8A39A",
          300: "#6B6862",
          400: "#3F3D38",
          500: "#2C2A26",
          600: "#1F1E1B",
          700: "#171612",
        },
        sage: {
          50: "#F1F4F0",
          100: "#DCE5DB",
          200: "#B6C8B3",
          300: "#8FA68E",
          400: "#6B8569",
          500: "#4F674D",
        },
        blue: {
          dusty: {
            50: "#EEF2F6",
            100: "#D6DFE8",
            200: "#A8BCCE",
            300: "#7B96B0",
            400: "#5A7794",
            500: "#3E5876",
          },
        },
        gold: {
          50: "#F8F2E7",
          100: "#EDDFC5",
          200: "#D9BE94",
          300: "#B8956A",
          400: "#9A7A52",
          500: "#7A5F3F",
        },
        burgundy: {
          50: "#F5E8E5",
          100: "#E5C2BC",
          200: "#C58A82",
          300: "#9B5E55",
          400: "#6E3F38",
        },
        sepia: {
          50: "#FAF7F0",
          100: "#F5F0E6",
          200: "#EDE7D8",
          300: "#D8D0C2",
          400: "#A89E8C",
          500: "#706858",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(var(--shadow) / 0.04), 0 4px 12px rgba(var(--shadow) / 0.06)",
        card: "0 1px 3px rgba(var(--shadow) / 0.05), 0 8px 24px rgba(var(--shadow) / 0.08)",
        ring: "inset 0 0 0 1px rgba(184, 149, 106, 0.4)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
