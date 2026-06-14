// Tailwind reads this file to know:
//  1. Which files to scan for class names (content)
//  2. What custom tokens to add (theme.extend)
//
// WHY EXTEND instead of replacing?
//  `theme.extend` ADDS to Tailwind's defaults rather than replacing them.
//  You keep all the built-in classes (flex, p-4, text-sm, etc.) AND gain
//  your custom ones (bg-surface, text-ink, font-sans).
//
// HOW CSS VARIABLES CONNECT:
//  globals.css defines:  --ink: #0F172A;
//  This config maps:     ink → var(--ink)
//  Now you can write:    className="text-ink bg-surface"
//  And Tailwind emits:   color: var(--ink); background-color: var(--surface);
//
//  This is powerful because changing the CSS variable (e.g. for dark mode)
//  automatically updates every element using that Tailwind class.
// ─────────────────────────────────────────────────────────────────────────────

import type { Config } from "tailwindcss";

const config: Config = {
  // content: Tell Tailwind which files to scan for class names.
  // It strips unused CSS in production, so it MUST know where your classes live.
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ── Font Families ──────────────────────────────────────────────────────
      // These reference the CSS variables injected by next/font in layout.tsx.
      // When you write className="font-sans", Tailwind outputs:
      //   font-family: var(--font-sans), system-ui, sans-serif;
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      // ── Colours ────────────────────────────────────────────────────────────
      // Each key here becomes a Tailwind colour token.
      // e.g. "ink" → bg-ink, text-ink, border-ink, ring-ink, etc.
      colors: {
        ink: {
          DEFAULT: "var(--ink)",       // text-ink
          muted:   "var(--ink-muted)", // text-ink-muted
          faint:   "var(--ink-faint)", // text-ink-faint
        },
        surface: {
          DEFAULT: "var(--surface)",   // bg-surface
          2:       "var(--surface-2)", // bg-surface-2
          3:       "var(--surface-3)", // bg-surface-3
        },
        accent: {
          DEFAULT: "var(--accent)",      // bg-accent, text-accent
          dark:    "var(--accent-dark)", // hover:bg-accent-dark
        },
        border: {
          DEFAULT: "var(--border)",    // border-border
        },
      },

      // ── Border Radius ──────────────────────────────────────────────────────
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },

      // ── Box Shadows ────────────────────────────────────────────────────────
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },

      // ── Custom Animations ──────────────────────────────────────────────────
      // We define these in globals.css as @keyframes.
      // Here we just register the animation names so Tailwind knows
      // to generate animate-message-in and animate-fade-in classes.
      animation: {
        "message-in": "message-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in":    "fade-in 0.2s ease-out both",
      },
      keyframes: {
        // These MIRROR the @keyframes in globals.css.
        // Tailwind needs them here to generate the animation utilities;
        // globals.css defines them for plain CSS usage.
        "message-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
    },
  },

  plugins: [],
};

export default config;
