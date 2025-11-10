// src/modules/AURORA/controller/AuroraController.ts
import type { Live2DModel } from "pixi-live2d-display";
import type { AuroraInstruction } from "@/models/AuroraInstruction";
import type { MutableRefObject } from "react";

/**
 * Aplica una instrucción emocional al modelo Live2D cargado.
 */
export function applyAuroraInstruction(
  modelRef: MutableRefObject<Live2DModel | null>,
  instruction: AuroraInstruction
) {
  if (!modelRef.current) {
    console.warn("⚠️ No hay modelo Live2D cargado para aplicar la instrucción.");
    return;
  }

  const { motion, expression } = instruction;

  console.log("🎭 Aplicando instrucción:", instruction);

  try {
    // Reproduce la animación/motion si está disponible
    if (motion) {
      // Aceptamos tanto nombres base (haru_g_m01) como rutas completas (/models/..../haru_g_m01.motion3.json)
      const isPath = motion.includes("/") || motion.toLowerCase().endsWith(".json");
      const motionUrl = isPath ? motion : `/models/haru/runtime/motion/${motion}.motion3.json`;
      console.log("▶️ Ejecutando motion (url):", motionUrl);
      try {
        // preferimos usar motionManager para reproducir la animación por URL
        const mm: any = modelRef.current.internalModel?.motionManager;
        mm?.stopAllMotions?.();
        if (typeof mm?.startMotion === "function") {
          mm.startMotion(motionUrl, 0, 1);
        } else if (typeof (modelRef.current as any).motion === "function") {
          // fallback a API convenience
          const motionName = motionUrl.replace(/\.motion3\.json$/i, "").split('/').pop();
          (modelRef.current as any).motion(motionName);
        }
      } catch (e) {
        console.warn("⚠️ No se pudo reproducir el motion con motionManager, intentando fallback:", e);
        try {
          const motionName = motion.replace(/\.motion3\.json$/i, "");
          (modelRef.current as any).motion(motionName);
        } catch (ee) {
          console.error("❌ Error reproduciendo motion (fallback):", ee);
        }
      }
    }

    // Cambia la expresión (si el modelo lo soporta)
    if (expression) {
      try {
        const em = modelRef.current.internalModel?.expressionManager as any;
        if (em && typeof em.setExpression === "function") {
          const expUrl = `/models/haru/runtime/expressions/${expression}.exp3.json`;
          em.setExpression(expUrl).catch?.(() => console.warn("⚠️ No se encontró la expresión:", expression));
        } else {
          // no hay expressionManager: dejar que quien llame use parámetros o motions como fallback
          console.debug("ℹ️ expressionManager no disponible — usa parámetros o motions para la expresión.");
        }
      } catch (err) {
        console.warn("⚠️ Error aplicando expresión:", err);
      }
    }
  } catch (err) {
    console.error("❌ Error aplicando la instrucción de Aurora:", err);
  }
}
