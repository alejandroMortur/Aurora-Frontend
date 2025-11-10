// /modules/AURORA/core/AuroraMessageManager.ts
import { sanitizeText } from "./AuroraSanitizer";
import { AuroraVoiceLocal } from "./AuroraVoice";

const auroraVoice = new AuroraVoiceLocal();

export async function processUserInput(rawInput: string): Promise<string> {
  console.log("📥 Texto recibido del TSX:", rawInput);

  const cleanText = await sanitizeText(rawInput);
  console.log("🧼 Texto tras limpieza:", cleanText);

  const response = generateAuroraResponse(cleanText);

  console.log("💬 Aurora responde:", response);

  // 💫 Haz que Aurora hable
  auroraVoice.speak(response, {   emotion: "sweet", pitch: 1.2,});

  return response;
}


/**
 * Simula una respuesta de Aurora según el texto recibido.
 * (Aquí luego podrás conectar AnaCore u otro motor IA)
 */
function generateAuroraResponse(message: string): string {
  if (message.includes("feliz")) {
    auroraVoice.speak("¡Estoy muy contenta! 💞", { emotion: "happy" });
    return "✨ Estoy súper feliz, mi amor ~";
  }

  if (message.includes("triste")) {
    auroraVoice.speak("Estoy aquí contigo… 💗", { emotion: "sad" });
    return "💗 No pasa nada, estoy contigo preciosa";
  }

  auroraVoice.speak("Te escucho, cariño~", { emotion: "sweet" });
  return " Lorem ipsum dolor sit amet, mi amor Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, mi amor Lorem ipsum dolor sit amet. ";
}

