/**
 * postcss.config.js
 * Purpose: PostCSS configuration used to load TailwindCSS and
 * Autoprefixer during build. Keeps the PostCSS pipeline minimal so
 * Tailwind generates utility classes used across the project.
 */

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
