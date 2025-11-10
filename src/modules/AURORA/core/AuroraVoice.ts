// /src/modules/AURORA/core/AuroraVoice.ts
import type { AuroraVoiceOptions } from "@/models/AuroraVoiceOptions";

/**
 * AuroraVoiceLocal (text-driven lip-sync)
 * - Usa SpeechSynthesis para hablar
 * - Genera lip-sync estimado a partir del texto y la duración estimada del utterance
 * - Expone setOnAudioFrameCallback(cb) para quien quiera animar la boca
 */
export class AuroraVoiceLocal {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;

  // callback para cada "frame audio" (valor 0..1)
  private onAudioFrame: ((value: number) => void) | null = null;

  // control interno del scheduler
  private _lipTimerId: number | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoice();
  }

  public setOnAudioFrameCallback(cb: (value: number) => void) {
    this.onAudioFrame = cb;
  }

  private loadVoice() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.voice =
        voices.find((v) => v.lang.startsWith("es") && /female|mujer|Helena|Conchita|Lucia|Google Español/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith("es")) ||
        voices[0] ||
        null;
      console.log("🎤 Voz seleccionada para Aurora:", this.voice?.name);
    };

    if (this.synth.getVoices().length === 0) {
      this.synth.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }

  /**
   * Pista: SpeechSynthesis no permite capturar el audio en un MediaStream.
   * Aquí estimamos la actividad de la boca a partir del texto (vocales/sílabas)
   * y la duración aproximada del utterance.
   */
  speak(text: string, options: AuroraVoiceOptions = {}) {
    if (!this.voice) this.loadVoice();

    // añadir pausas cálidas cortas
    const preparedText = this._addWarmPauses(text);
    const utterance = new SpeechSynthesisUtterance(preparedText);

    if (this.voice) utterance.voice = this.voice;
    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = options.pitch ?? 1.25;
    utterance.volume = options.volume ?? 1;

    // emocionales ligeros
    switch (options.emotion) {
      case "sweet":
        utterance.pitch += 0.12;
        utterance.rate -= 0.03;
        break;
      case "sad":
        utterance.pitch -= 0.15;
        utterance.rate -= 0.08;
        utterance.volume = 0.85;
        break;
      case "happy":
        utterance.pitch += 0.18;
        utterance.rate += 0.06;
        break;
    }

    // cancelamos cualquier utterance anterior y scheduler
    this.synth.cancel();
    this._stopLipTimer();

    // Estimación de duración (ms) basada en chars y rate
    // baseCharsPerSecond = 12 (ajustable)
    const baseCps = 12;
    const chars = preparedText.replace(/\s+/g, " ").length;
    const rateFactor = utterance.rate ?? 1;
    const estimatedSeconds = Math.max(0.8, chars / (baseCps * rateFactor));
    const estimatedMs = estimatedSeconds * 1000;

    // Construimos "chunks" aproximados por sílabas/vocales para animar visemas
    const chunks = this._textToChunks(preparedText);

    utterance.onstart = () => {
      // schedule lip frames to match chunks over estimatedMs
      const total = chunks.length || 1;
      const msPerChunk = estimatedMs / total;

      let idx = 0;
      const step = () => {
        // valor entre 0 y 1 según contenido de chunk (más vocales -> más abertura)
        const chunk = chunks[idx] || "";
        const v = this._chunkOpenValue(chunk);

        // callback directo
        if (this.onAudioFrame) this.onAudioFrame(v);

        // also dispatch window event for compatibility
        try {
          window.dispatchEvent(new CustomEvent("aurora-lipsync", { detail: v }));
        } catch (e) {
          /* no importante */
        }

        idx++;
        if (idx < total) {
          this._lipTimerId = window.setTimeout(step, msPerChunk);
        } else {
          // schedule a small decay to close mouth softly
          this._lipTimerId = window.setTimeout(() => {
            if (this.onAudioFrame) this.onAudioFrame(0);
            try {
              window.dispatchEvent(new CustomEvent("aurora-lipsync", { detail: 0 }));
            } catch (e) {}
            this._lipTimerId = null;
          }, 80);
        }
      };

      // inicio inmediato
      step();
    };

    utterance.onend = () => {
      // asegurar cierre
      if (this.onAudioFrame) this.onAudioFrame(0);
      try {
        window.dispatchEvent(new CustomEvent("aurora-lipsync", { detail: 0 }));
      } catch (e) {}
      this._stopLipTimer();
    };

    this.synth.speak(utterance);
  }

  private _stopLipTimer() {
    if (this._lipTimerId != null) {
      clearTimeout(this._lipTimerId);
      this._lipTimerId = null;
    }
  }

  // convierte texto en "chunks" aproximadas (divide por pausas y silabas simples)
  private _textToChunks(text: string): string[] {
    // normalized: remove double spaces
    const clean = text
      .replace(/[…—\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // split by small words/punctuation to simulate syllable groups
    const parts = clean.split(/[\s,.;!?]+/).filter(Boolean);

    // further split long words into smaller groups (~2-4 chars)
    const chunks: string[] = [];
    parts.forEach((p) => {
      if (p.length <= 4) chunks.push(p);
      else {
        for (let i = 0; i < p.length; i += 3) {
          chunks.push(p.slice(i, i + 3));
        }
      }
    });

    // ensure at least some items
    return chunks.length ? chunks : [clean || "a"];
  }

  // heurística simple: más vocales => más abertura
  private _chunkOpenValue(chunk: string): number {
    const vowels = (chunk.match(/[aeiouáéíóúüAEIOU]/g) || []).length;
    const len = Math.max(1, chunk.replace(/[^a-zA-Z0-9áéíóúüÁÉÍÓÚÜ]/g, "").length);
    const ratio = vowels / len;
    // map ratio (0..1) to openness (0.05 .. 1)
    const v = Math.min(1, Math.max(0.02, ratio * 1.6));
    // add little random variance to avoid robotic regularity
    return Math.min(1, Math.max(0, v + (Math.random() - 0.5) * 0.12));
  }

  private _addWarmPauses(text: string): string {
    return text
      .replace(/([,;])/g, "$1 …")
      .replace(/([.!?])\s*/g, "$1 … ")
      .replace(/(\bquerida\b|\bcariño\b|\bmi amor\b)/gi, "… $1 …");
  }
}
