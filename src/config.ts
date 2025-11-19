// src/config.ts
function getEnvVariable(name: keyof ImportMetaEnv, defaultValue?: string): string {
  const value = import.meta.env[name]
  if (!value) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`❌ La variable de entorno "${name}" no está definida.`)
  }
  return value
}

export const ENV = {
  // API
  API_URL: getEnvVariable('PUBLIC_API_URL'),

  // Servicios de IA
  LUCIA_API_KEY: getEnvVariable('PUBLIC_LUCIA_API_KEY'),
  ANA_EMOTION_API: getEnvVariable('PUBLIC_ANA_EMOTION_API'),

  // E-commerce
  STRIPE_PUBLISHABLE_KEY: getEnvVariable('PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  PAYMENT_SUCCESS_URL: getEnvVariable('PUBLIC_PAYMENT_SUCCESS_URL'),
  PAYMENT_CANCEL_URL: getEnvVariable('PUBLIC_PAYMENT_CANCEL_URL'),

  // Entorno
  NODE_ENV: getEnvVariable('NODE_ENV', 'development') as 'development' | 'production',
}

/*Llamada*/

/**
 * import { ENV } from './config.ts'
 * 
 * console.log('API URL:', ENV.API_URL)
 * console.log('Stripe Key:', ENV.STRIPE_PUBLISHABLE_KEY)
 * console.log('Entorno:', ENV.NODE_ENV)
 */
