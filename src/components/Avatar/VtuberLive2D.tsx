"use client";
import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";

const VtuberLive2D: React.FC = () => {
  // Referencia al contenedor del canvas donde Pixi.js montará el modelo
  const canvasRef = useRef<HTMLDivElement>(null);

  // Tamaño máximo del canvas (puedes ajustar según tu layout)
  const maxWidth = 500;
  const maxHeight = 1000;

  useEffect(() => {
    let app: PIXI.Application;
    let model: Live2DModel;

    const init = async () => {
      try {
        console.log("🟦 Iniciando aplicación PIXI...");

        // Crear la aplicación PIXI
        app = new PIXI.Application({
          width: maxWidth,
          height: maxHeight,
          backgroundAlpha: 0, // fondo transparente
          autoDensity: true,  // adapta a pantallas retina
          resolution: window.devicePixelRatio || 1,
        });

        console.log("✅ PIXI Application creada:", app);

        // Limpia el contenido anterior y añade el canvas al contenedor
        if (canvasRef.current) {
          console.log("🟩 Montando canvas en el DOM...");
          canvasRef.current.innerHTML = "";
          canvasRef.current.appendChild(app.view as HTMLCanvasElement);
        }

        // Cargar el modelo Live2D
        console.log("🟨 Cargando modelo Live2D...");
        model = await Live2DModel.from("/models/haru/runtime/haru_greeter_t05.model3.json");
        console.log("✅ Modelo cargado correctamente:", model);

        // Escalado del modelo (ajústalo a gusto)
        model.scale.set(0.35);

        // Posicionamiento centrado + desplazado hacia abajo
        model.x = app.renderer.width / 2 - model.width / 2;
        model.y = app.renderer.height / 2 - model.height / 2 + 300; // +300 = lo baja en pantalla
        console.log("📐 Posición del modelo:", { x: model.x, y: model.y });

        // Añadir modelo al escenario
        app.stage.addChild(model);
        console.log("🎨 Modelo añadido al escenario.");

        // Animación del modelo (se actualiza en cada frame)
        app.ticker.add((delta) => {
          model.update(delta * app.ticker.deltaMS);
        });
        console.log("🌀 Animación iniciada con ticker PIXI.");
      } catch (error) {
        console.error("❌ Error al inicializar el modelo Live2D:", error);
      }
    };

    init();

    // Cleanup al desmontar el componente
    return () => {
      console.log("🧹 Destruyendo aplicación PIXI...");
      if (app) app.destroy(true, true);
    };
  }, []);

  // Contenedor del canvas donde se renderiza el modelo
  return <div ref={canvasRef} style={{ width: maxWidth, height: maxHeight }} />;
};

export default VtuberLive2D;
