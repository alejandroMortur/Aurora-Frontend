export interface AuroraVoiceOptions {
  rate?: number; // velocidad de habla
  pitch?: number; // tono
  volume?: number; // volumen
  emotion?: "neutral" | "sweet" | "sad" | "happy"; // matiz emocional
}