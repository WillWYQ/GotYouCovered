import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        card: "var(--card)",
        line: "var(--line)",
        accent: "var(--accent)",
        accent2: "var(--accent2)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: ["var(--font-display)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono]
      },
      boxShadow: {
        glow: "0 0 0 1px var(--line), 0 20px 60px -30px var(--accent)"
      },
      borderRadius: {
        xl: "16px",
        lg: "14px",
        md: "12px",
        sm: "10px"
      },
      backgroundImage: {
        "wafer-grid":
          "linear-gradient(90deg, color-mix(in srgb, var(--line) 30%, transparent) 1px, transparent 1px), linear-gradient(0deg, color-mix(in srgb, var(--line) 30%, transparent) 1px, transparent 1px)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 700ms ease 1"
      }
    }
  },
  plugins: []
};

export default config;
