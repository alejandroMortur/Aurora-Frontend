/**
 * Environment Configuration Module
 * 
 * Centralized configuration for all environment variables used throughout the application.
 * This module validates that required environment variables are defined at runtime.
 * 
 * All environment variables must be prefixed with PUBLIC_ to be accessible in the browser.
 * Variables are loaded from .env files at build time.
 */

/**
 * Helper function to safely retrieve environment variables
 * 
 * @param name - The environment variable name
 * @param defaultValue - Optional fallback value if variable is not defined
 * @returns The environment variable value or default value
 * @throws Error if variable is not defined and no default provided
 */
function getEnvVariable(name: string, defaultValue?: string): string {
  // Attempt to retrieve the environment variable from import.meta.env
  const value = (import.meta.env as Record<string, string>)[name]
  
  // If variable doesn't exist, check for default value
  if (!value) {
    if (defaultValue !== undefined) return defaultValue
    // Throw error if both variable and default are missing
    throw new Error(`Environment variable "${name}" is not defined.`)
  }
  return value
}

/**
 * Global environment configuration object
 * 
 * Contains all configuration values needed by the application:
 * - API endpoints for backend communication
 * - AI service credentials (LUCIA, ANA)
 * - Payment service credentials (Stripe)
 * - Application runtime environment
 */
export const ENV = {
  // ===== BACKEND API =====
  /** Base URL for all backend API calls */
  API_URL: getEnvVariable('PUBLIC_API_URL'),

  // ===== AI SERVICES =====
  /** API key for LUCIA (Logic/Language module) */
  LUCIA_API_KEY: getEnvVariable('PUBLIC_LUCIA_API_KEY'),
  /** API endpoint for ANA (Emotion Analysis module) */
  ANA_EMOTION_API: getEnvVariable('PUBLIC_ANA_EMOTION_API'),

  // ===== PAYMENT SERVICES =====
  /** Stripe publishable key for frontend payment processing */
  STRIPE_PUBLISHABLE_KEY: getEnvVariable('PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  /** Redirect URL after successful payment */
  PAYMENT_SUCCESS_URL: getEnvVariable('PUBLIC_PAYMENT_SUCCESS_URL'),
  /** Redirect URL after cancelled payment */
  PAYMENT_CANCEL_URL: getEnvVariable('PUBLIC_PAYMENT_CANCEL_URL'),

  // ===== APPLICATION ENVIRONMENT =====
  /** Current runtime environment: 'development' or 'production' */
  NODE_ENV: getEnvVariable('NODE_ENV', 'development') as 'development' | 'production',
}

/**
 * Usage Example:
 * 
 * import { ENV } from './config'
 * 
 * console.log('API URL:', ENV.API_URL)
 * console.log('Stripe Key:', ENV.STRIPE_PUBLISHABLE_KEY)
 * console.log('Environment:', ENV.NODE_ENV)
 */
