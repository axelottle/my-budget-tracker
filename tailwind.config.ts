import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        paper: "#F2F3EF", // page background - cool paper, not warm cream
        surface: "#FFFFFF", // card surfaces
        ink: {
          DEFAULT: "#13223B", // primary text / headers, deep ledger-navy
          soft: "#4A5568", // secondary text
          faint: "#8891A0", // tertiary / placeholder text
        },
        line: "#DDE0D6", // hairline rules between ledger rows

        // Semantic accents
        income: {
          DEFAULT: "#1B7A5C", // deep emerald - money in
          soft: "#E4F2ED",
        },
        expense: {
          DEFAULT: "#B3432E", // muted rust-red - money out
          soft: "#F7E9E5",
        },
        budget: {
          DEFAULT: "#B8862E", // brass/gold - budget gauge accent
          soft: "#F6EEDD",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(19, 34, 59, 0.06), 0 1px 0 rgba(19, 34, 59, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
