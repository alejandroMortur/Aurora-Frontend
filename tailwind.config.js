/**
 * tailwind.config.js
 * Purpose: Tailwind CSS configuration. Sets `darkMode: 'class'` and
 * provides the content globs and plugin list for the project's
 * utility generation. Kept intentionally simple to align with the
 * project's Tailwind usage in components.
 */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue}",
    "./index.html",
  ],
  theme: {
  	extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}


