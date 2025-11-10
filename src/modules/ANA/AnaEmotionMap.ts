import emotionDictionary from './data/emotionDictionary.json';
import type { EmotionEntry } from '@/models/EmotionEntry';

/**
 * Busca la emoción más probable en base a palabras clave.
 */
export function analyzeEmotion(text: string) {
  const lower = text.toLowerCase();

  for (const entry of emotionDictionary as EmotionEntry[]) {
    if (entry.keywords.some(keyword => lower.includes(keyword))) {
      // Normalize motion to a base name (haru_g_m01 or haru_g_idle)
      const motion = normalizeMotion(entry.motion);
      console.log(`🎯 Found match: ${entry.emotion} → ${motion}`);
      return {
        emotion: entry.emotion,
        expression: entry.expression,
        motion // base name, e.g. 'haru_g_m01'
      };
    }
  }

  console.log('😐 No matches found → default neutral state.');
  return {
    emotion: 'neutral',
    expression: 'neutral',
    motion: 'haru_g_idle'
  };
}

function normalizeMotion(raw: string | undefined | null): string {
  if (!raw) return 'haru_g_idle';
  // If it's a full path like /models/.../haru_g_m01.motion3.json
  // extract filename and strip known extensions
  try {
    const parts = raw.split('/');
    const file = parts[parts.length - 1] || raw;
    return file.replace(/\.motion3\.json$/i, '').replace(/\.motion3$/i, '').replace(/\.json$/i, '');
  } catch (e) {
    return raw;
  }
}
