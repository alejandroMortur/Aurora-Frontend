// src/main.ts
import { ENV } from './config';

declare global {
  interface Window {
    ENV?: typeof ENV;
  }
}

// Evita redefinir si ya existe
if (typeof window !== 'undefined' && !window.ENV) {
  window.ENV = ENV;
  console.log('🌍 ENV cargado globalmente:', window.ENV);

  const login = localStorage.getItem('login');

  if (login === null) {
    localStorage.setItem('login', 'false');
    console.log('🔒 login inicializado a false');
  }
}
