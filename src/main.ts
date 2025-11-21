/**
 * Main Entry Point Module
 * 
 * Initializes global environment configuration when the application loads.
 * Makes the ENV configuration object available globally on the window object.
 */

import { ENV } from './config';

/**
 * Global window interface extension
 * Allows TypeScript to recognize the ENV property on the window object
 */
declare global {
  interface Window {
    /** Global environment configuration (assigned at runtime) */
    ENV?: typeof ENV;
  }
}

/**
 * Initialize global ENV configuration
 * 
 * Checks if code is running in browser environment and if ENV is not already defined.
 * This prevents redefining ENV if module is imported multiple times.
 */
if (typeof window !== 'undefined' && !window.ENV) {
  // Attach ENV to global window object for access throughout the app
  window.ENV = ENV;
  // Log confirmation that environment is loaded
  console.log('🌍 ENV cargado globalmente:', window.ENV);
}
