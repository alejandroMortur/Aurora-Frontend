// src/modules/AURORA/hooks/useAuroraState.ts
import { useState } from "react";

export const useAuroraState = () => {
  const [emotion, setEmotion] = useState<
    "neutral" | "happy" | "sad" | "angry" | "surprised" | "scared" | "thinking" | "tired"
  >("neutral");
  const [expression, setExpression] = useState<string>("neutral");
  const [motion, setMotion] = useState<string>("haru_g_idle");

  /**
   * Actualiza los valores del estado emocional desde una respuesta del backend o de AnaCore
   */
  const updateFromResponse = (data: any) => {
    if (!data) return;
    setEmotion(data.emotion || "neutral");
    setExpression(data.expression || "neutral");
    setMotion(data.motion || "haru_g_idle");
  };  

  return { emotion, expression, motion, updateFromResponse };
};
