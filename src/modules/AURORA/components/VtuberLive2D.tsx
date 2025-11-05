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

          // Intento de descubrimiento de parámetros (útil para debugging de visemas)
          try {
            // muchos modelos Live2D exponen una API coreModel con parámetros
            const core = (model.internalModel.coreModel as any) || {};
            const paramNames = core.getParameterIds?.() || core.parameters?.map((p: any) => p.id) || [];
            if (paramNames && paramNames.length) {
              console.log("🧭 Parámetros del modelo detectados:", paramNames.slice(0, 30));
            }
          } catch (pm) {
            // no crítico
          }
        } catch (e) {}
        console.log("✅ Modelo totalmente cargado y listo.");
      });

  // registrar ticker (necesario) — usar la clase Ticker desde @pixi/ticker
  Live2DModel.registerTicker(Ticker);

      app.stage.addChild(model);
      modelRef.current = model;

      model.interactive = false;
      model.scale.set(0.35);
      model.x = app.renderer.width / 2 - model.width / 2;
      model.y = app.renderer.height / 2 - model.height / 2 + 490;

      // lip-sync: conectar callback estimado
      // Strategy:
      // - AuroraVoiceLocal nos da valores 0..1. Mapeamos y escribimos en el parámetro de boca
      // - Intentamos varios nombres de parámetro comunes y hacemos fallback
      const mouthCandidates = ["ParamMouthOpenY", "ParamMouthOpen", "ParamMouthOpenX", "MouthOpen"];
      const setMouthValue = (val: number) => {
        const m = modelRef.current;
        if (!m) return;
        const clamped = Math.max(0, Math.min(1, val));
        // Escala ligera si hace falta (algunos modelos esperan 0..0.6)
        const scaled = clamped * 0.9;

        for (const id of mouthCandidates) {
          try {
            // API preferida: coreModel.setParameterValueById
            const core: any = m.internalModel.coreModel;
            if (core && typeof core.setParameterValueById === "function") {
              core.setParameterValueById(id, scaled);
              return;
            }
            // fallback a parámetros expuestos
            const params: any = (m.internalModel.parameters as any) || (m.internalModel.coreModel && (m.internalModel.coreModel as any).parameters);
            if (params && typeof params.setValueById === "function") {
              params.setValueById(id, scaled);
              return;
            }
          } catch (e) {
            // intentar siguiente candidate
          }
        }
        // Si no funcionó con los ids, intentar escribir directamente si existe un objeto de parámetros
        try {
          const coreAny: any = m.internalModel.coreModel;
          if (coreAny && coreAny.parameters) {
            // intentar buscar un parámetro que contenga "mouth"
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

      // Fallback: escuchar evento global por si otra parte del código dispatcha visemas
      const onWindowLip = (e: Event) => {
        const detail: any = (e as CustomEvent).detail;
        if (typeof detail === "number") setMouthValue(detail);
      };
      window.addEventListener("aurora-lipsync", onWindowLip as EventListener);

      // opcional: añadir imagen de fondo (ejemplo). Si no existe, no rompe.
      try {
        const bgPath = "/img/frame-background.png"; // cambiar o parametrizar según tus assets
        const sprite = PIXI.Sprite.from(bgPath);
        sprite.zIndex = 0;
        sprite.width = app.renderer.width;
        sprite.height = app.renderer.height;
        sprite.alpha = 0.6;
        app.stage.addChildAt(sprite, 0);
      } catch (e) {
        // no crítico si la imagen no está presente
      }

      // remove listener on cleanup (handled below in return)

      // ticker backup (Live2DModel.registerTicker debería hacerlo, pero dejamos update por seguridad)
      app.ticker.add((delta) => {
        if (model && typeof (model as any).update === "function") {
          (model as any).update(delta * app!.ticker.deltaMS);
        }
      });

      console.log("✅ Modelo cargado correctamente y en ejecución.");
    };

    init();

    return () => {
      console.log("🧹 Destruyendo aplicación PIXI...");
      try {
        window.removeEventListener("aurora-lipsync", () => {});
      } catch (e) {}
      if (model) model.destroy();
      if (app) app.destroy(true);
    };
  }, []);

  // Expresiones
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

    // además pide voz
    if (voiceRef.current) {
      voiceRef.current.speak(instruction?.text ?? instruction?.response ?? "Te escucho, cariño~", { emotion: "sweet", pitch: 1.2 });
    }
  };

  // panel debug
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
