import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      sidebar: "var(--color-sidebar)",
      surface: "var(--color-surface)",
      textPrimary: "var(--color-text-primary)",
      textSecondary: "var(--color-text-secondary)",
    },
  },
} satisfies Config;
