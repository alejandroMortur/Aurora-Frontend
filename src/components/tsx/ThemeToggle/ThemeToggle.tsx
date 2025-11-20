/**
 * Theme Toggle Component
 * 
 * Top-level wrapper for theme toggling functionality. Initializes dark mode state
 * on component mount based on:
 * 1. Previously saved theme preference in localStorage
 * 2. System color scheme preference (prefers-color-scheme media query)
 * 3. Default to light mode if no preference found
 * 
 * The component only renders after hydration to prevent SSR mismatch,
 * then delegates UI rendering to the smaller AnimatedThemeToggler component.
 * 
 * Architecture:
 * - ThemeToggle (wrapper) - initializes theme and handles mount state
 * - AnimatedThemeToggler (child) - renders the actual toggle UI with animations
 */

import React, { useState, useEffect } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

/**
 * ThemeToggle - Theme initialization and wrapper component
 * 
 * Lifecycle:
 * 1. Component mounts (useState initialized with mounted=false)
 * 2. useEffect fires (component now in browser environment)
 * 3. Check localStorage for saved theme preference
 * 4. Check system color scheme if no saved preference
 * 5. Apply theme class to document root (html element)
 * 6. Set mounted flag to true and render AnimatedThemeToggler
 * 
 * @component
 * @returns JSX.Element | null - Animated theme toggle button or null during SSR
 */
const ThemeToggle: React.FC = () => {
  // Track component mount state (for SSR safety)
  const [mounted, setMounted] = useState(false);

  /**
   * Initialize theme preference on component mount
   * 
   * Runs only in browser environment (not during SSR).
   * 
   * Process:
   * 1. Get saved theme from localStorage (key: "theme")
   * 2. Get system color scheme preference via matchMedia
   * 3. Determine initial theme:
   *    - Use localStorage value if exists
   *    - Else use system preference
   *    - Else default to "light"
   * 4. Apply theme class to document root:
   *    - "dark" class = enable dark mode styles
   *    - No "dark" class = light mode (default)
   * 5. Set mounted flag to prevent SSR mismatch
   */
  useEffect(() => {
    // Mark component as mounted in browser environment
    setMounted(true);

    // Get theme from localStorage or use system preference
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (systemDark ? "dark" : "light");

    // Apply theme to document root for CSS styling
    const html = document.documentElement;
    if (initial === "dark") {
      // Add "dark" class to enable dark mode Tailwind styles
      html.classList.add("dark");
    } else {
      // Remove "dark" class to use light mode (default Tailwind styles)
      html.classList.remove("dark");
    }
  }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  // Only render after component mounts in browser
  if (!mounted) return null;

  return (
    <div className="w-10 h-10 cursor-pointer flex items-center justify-center">
      {/* Delegated UI rendering to animated child component */}
      <AnimatedThemeToggler />
    </div>
  );
};

export default ThemeToggle;

