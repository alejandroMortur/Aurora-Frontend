import { analyzeEmotion } from './AnaEmotionMap';
import { fetchBackendResponse } from '../../services/apiClient';
import type { AuroraInstruction } from '@/models/AuroraInstruction';

export class AnaCore {
  /**
   * Procesa el mensaje del usuario → obtiene respuesta del backend → analiza emoción.
   */
  static async processUserMessage(message: string): Promise<AuroraInstruction> {
    try {
      // 1️⃣ Llamar al backend
      const backendResponse = await fetchBackendResponse(message);

      // 2️⃣ Analizar emoción a partir del texto recibido
      const emotionData = analyzeEmotion(backendResponse.text);

      // 3️⃣ Retornar una instrucción compatible con AURORA
      return {
        emotion: emotionData.emotion,
        expression: emotionData.expression,
        motion: emotionData.motion,
        text: backendResponse.text
      };
    } catch (error) {
      console.error("❌ Error en AnaCore:", error);
      return { emotion: 'neutral', expression: 'neutral', motion: 'haru_g_idle' };
    }
  }
}
