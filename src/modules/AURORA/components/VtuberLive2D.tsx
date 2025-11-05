"use client";
import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
// Use the standalone ticker class that pixi-live2d-display expects
import { Ticker } from "@pixi/ticker";
import { Live2DModel } from "pixi-live2d-display";
import { AnaCore } from "../../ANA/AnaCore";
import { applyAuroraInstruction } from "../controller/AuroraController";
import { useAuroraState } from "../hook/useAuroraState";
import { AuroraChatFrame } from "./AuroraChatFrame";
import { AuroraVoiceLocal } from "../core/AuroraVoice";

// Main component that mounts a PIXI canvas and loads a Live2D model.
// Responsibilities:
// - Initialize the PIXI application and the Live2D model.
// - Map audio input (visemes) to the model's mouth parameters.
// - Apply expressions and motions coming from Aurora's state.
// - Provide debug helpers to play motions/expressions manually.
const VtuberLive2D: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<Live2DModel | null>(null);
  const { emotion, expression, motion, updateFromResponse } = useAuroraState();
  const voiceRef = useRef<AuroraVoiceLocal | null>(null);

  const maxWidth = 500;
  const maxHeight = 1200;

  useEffect(() => {
    voiceRef.current = new AuroraVoiceLocal();
  }, []);

  useEffect(() => {
    let app: PIXI.Application | null = null;
    let model: Live2DModel | null = null;

    const init = async () => {
      console.log("🟦 Iniciando aplicación PIXI...");
      app = new PIXI.Application({
        width: maxWidth,
        height: maxHeight,
        backgroundAlpha: 0,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      });

      if (!canvasRef.current) return;
      canvasRef.current.innerHTML = "";
      canvasRef.current.appendChild(app.view as HTMLCanvasElement);

      console.log("🟨 Cargando modelo Live2D...");
      model = await Live2DModel.from("/models/haru/runtime/haru_greeter_t05.model3.json");

      model.once("load", () => {
        try {
          model.internalModel.motionManager.stopAllMotions();
          if (model.internalModel.expressionManager) {
            model.internalModel.expressionManager.setExpression(null);
          }

          // Attempt to discover model parameters to help debug viseme
          // mapping (mouth parameters). This is non-critical: some models
          // don't expose `coreModel` or use vendor-specific structures.
          try {
            // Many Live2D models expose a `coreModel` API with parameter info
            const core = (model.internalModel.coreModel as any) || {};
            const paramNames = core.getParameterIds?.() || core.parameters?.map((p: any) => p.id) || [];
            if (paramNames && paramNames.length) {
              console.log("🧭 Parámetros del modelo detectados:", paramNames.slice(0, 30));
            }
          } catch (pm) {
            // If inspection fails, continue without blocking the load.
          }
        } catch (e) {}
        console.log("✅ Modelo totalmente cargado y listo.");
      });

  // Register the Ticker class required by pixi-live2d-display.
  // This makes sure the Live2D runtime receives regular time updates.
  Live2DModel.registerTicker(Ticker);

      app.stage.addChild(model);
      modelRef.current = model;

      model.interactive = false;
      model.scale.set(0.35);
      model.x = app.renderer.width / 2 - model.width / 2;
      model.y = app.renderer.height / 2 - model.height / 2 + 490;

      // Lip-sync setup: receive estimated audio-frame values and map them
      // to the model's mouth parameter(s). We try several common parameter
      // ids and fall back to alternative parameter APIs when needed.
      const mouthCandidates = ["ParamMouthOpenY", "ParamMouthOpen", "ParamMouthOpenX", "MouthOpen"];
      const setMouthValue = (val: number) => {
        const m = modelRef.current;
        if (!m) return;
        const clamped = Math.max(0, Math.min(1, val));

        // Slight scaling because some models expect smaller ranges (e.g. 0..0.6)
        const scaled = clamped * 0.9;

        for (const id of mouthCandidates) {
          try {
            // Preferred API: coreModel.setParameterValueById
            const core: any = m.internalModel.coreModel;
            if (core && typeof core.setParameterValueById === "function") {
              core.setParameterValueById(id, scaled);
              return;
            }
            // Fallback to exposed `parameters` APIs
            const params: any = (m.internalModel.parameters as any) || (m.internalModel.coreModel && (m.internalModel.coreModel as any).parameters);
            if (params && typeof params.setValueById === "function") {
              params.setValueById(id, scaled);
              return;
            }
          } catch (e) {
            // Try next candidate on error
          }
        }
        // If no candidate IDs worked, try to find any parameter whose id
        // contains 'mouth' and set that value directly.
        try {
          const coreAny: any = m.internalModel.coreModel;
          if (coreAny && coreAny.parameters) {
            // attempt to find a parameter that contains "mouth" in its id
            const found = coreAny.parameters.find((p: any) => /mouth/i.test(p.id));
            if (found && typeof coreAny.setParameterValueById === "function") {
              coreAny.setParameterValueById(found.id, scaled);
            }
          }
        } catch (e) {}
      };

      if (voiceRef.current) {
        voiceRef.current.setOnAudioFrameCallback((v) => setMouthValue(v));
      }

      // Fallback: listen for a global event if other parts of the app
      // dispatch viseme values. Expect a CustomEvent 'aurora-lipsync' with a
      // numeric `detail` (0..1).
      const onWindowLip = (e: Event) => {
        const detail: any = (e as CustomEvent).detail;
        if (typeof detail === "number") setMouthValue(detail);
      };
      window.addEventListener("aurora-lipsync", onWindowLip as EventListener);

      // Optional: try to add a background image for the canvas. If the asset
      // is missing, catch the error and continue without a background.
      try {
        const bgPath = "/img/frame-background.png"; // change or parametrize as needed
        const sprite = PIXI.Sprite.from(bgPath);
        sprite.zIndex = 0;
        sprite.width = app.renderer.width;
        sprite.height = app.renderer.height;
        sprite.alpha = 0.6;
        app.stage.addChildAt(sprite, 0);
      } catch (e) {
        // Non-critical if background asset is missing
      }

      // remove listener on cleanup (handled below in return)

      // Ticker backup: ensure the model receives update calls. The registered
      // ticker normally handles updates, but this guarantees `model.update`
      // is called in environments where automatic updates may not run.
      app.ticker.add((delta) => {
        if (model && typeof (model as any).update === "function") {
          (model as any).update(delta * app!.ticker.deltaMS);
        }
      });

      console.log("✅ Modelo cargado correctamente y en ejecución.");
    };

    init();

    return () => {
      // Cleanup: remove listeners and destroy PIXI/Live2D instances to free
      // memory and stop animations when the component unmounts.
      console.log("🧹 Destruyendo aplicación PIXI...");
      try {
        window.removeEventListener("aurora-lipsync", () => {});
      } catch (e) {}
      if (model) model.destroy();
      if (app) app.destroy(true);
    };
  }, []);

  // Expressions
  useEffect(() => {
    const m = modelRef.current;
    if (!m || !expression) return;
    const expUrl = `/models/haru/runtime/expressions/${expression}.exp3.json`;
    m.internalModel.expressionManager
      .setExpression(expUrl)
      .catch(() => console.warn("⚠️ No se encontró la expresión:", expression));
  }, [expression]);

  // Motions
  useEffect(() => {
    const m = modelRef.current;
    if (!m || !motion) return;
    const motionUrl = `/models/haru/runtime/motion/${motion}.motion3.json`;
    m.internalModel.motionManager.stopAllMotions();
    m.internalModel.motionManager.startMotion(motionUrl, 0, 1)
      .catch(() => console.warn("⚠️ No se encontró el motion:", motion));
  }, [motion]);

  const handleMessage = async (message: string) => {
    const instruction = await AnaCore.processUserMessage(message);
    updateFromResponse(instruction);
    applyAuroraInstruction(modelRef, instruction);

    // Also request local voice output so the avatar speaks. Uses optional
    // emotion and pitch parameters.
    if (voiceRef.current) {
      voiceRef.current.speak(instruction?.text ?? instruction?.response ?? "Te escucho, cariño~", { emotion: "sweet", pitch: 1.2 });
    }
  };

  // Debug panel
  const playMotion = (name: string) => {
    const m = modelRef.current;
    if (!m) return;
    const motionUrl = `/models/haru/runtime/motion/${name}.motion3.json`;
    m.internalModel.motionManager.stopAllMotions();
    m.internalModel.motionManager.startMotion(motionUrl, 0, 1);
  };

  const playExpression = (name: string) => {
    const m = modelRef.current;
    if (!m) return;
    const expUrl = `/models/haru/runtime/expressions/${name}.exp3.json`;
    m.internalModel.expressionManager.setExpression(expUrl);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div ref={canvasRef} style={{ width: maxWidth, height: maxHeight }} />

      <div className="absolute top-2 right-2 z-50 bg-black/40 backdrop-blur-md p-3 rounded-xl text-white text-sm space-y-2 pointer-events-auto">
        <p className="font-bold text-pink-300 text-center">🎭 Animaciones</p>

        <button onClick={() => playMotion("haru_g_idle")} className="bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded">Idle</button>
        <button onClick={() => playMotion("haru_g_m01")} className="bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded">Motion 1</button>

        <p className="font-bold text-pink-300 text-center mt-2">😊 Expresiones</p>
        <button onClick={() => playExpression("neutral")} className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded">Neutral</button>
        <button onClick={() => playExpression("smile")} className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded">Sonrisa 😊</button>
      </div>

      <div className="absolute bottom-0 left-0 w-full flex justify-center z-50 pointer-events-auto pb-0">
        <AuroraChatFrame onSend={handleMessage} />
      </div>
    </div>
  );
};

export default VtuberLive2D;
