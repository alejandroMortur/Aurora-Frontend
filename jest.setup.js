/* eslint-disable */
/**
 * jest.setup.js
 * Purpose: Global Jest setup script executed before tests. It registers
 * common mocks (SpeechSynthesis, fetch) and installs `@testing-library/jest-dom`
 * matchers so tests can use extended DOM assertions.
 */

// Importar matchers de Testing Library
require('@testing-library/jest-dom');

// Mock de SpeechSynthesis para tests
globalThis.speechSynthesis = {
  getVoices: () => [
    {
      name: 'Google Español',
      lang: 'es-ES',
    },
  ],
  onvoiceschanged: null,
  speak: () => {},
  cancel: () => {},
  pause: () => {},
  resume: () => {},
  pending: false,
  paused: false,
};

globalThis.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
    this.voice = null;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
  }
};

// Mock de fetch para API calls
globalThis.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});
