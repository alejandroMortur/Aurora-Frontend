# Avatar virtual (Live2D)

Este documento explica en detalle el funcionamiento interno del avatar visual (Live2D) para que cualquier desarrollador pueda entender, depurar y extender su comportamiento.

Componente principal: `src/modules/AURORA/components/VtuberLive2D.tsx`

## 1) Panorama general

- Render: el avatar es un modelo Live2D renderizado mediante PIXI.js sobre un canvas HTML.
- Responsabilidades del componente:
  - Inicializar la aplicación PIXI y el modelo Live2D.
  - Mantener el ciclo de render (ticker) y llamadas a `model.update(...)`.
  - Mapear datos de audio/síntesis a parámetros visuales (lip-sync).
  - Reproducir expresiones y motions según el estado global.
  - Proveer herramientas de depuración (playMotion, playExpression).

## 2) Activos y rutas

- Modelo principal: `public/models/haru/runtime/haru_greeter_t05.model3.json`
- Expresiones: `public/models/haru/runtime/expressions/*.exp3.json` (cada archivo describe una expresión)
- Motions: `public/models/haru/runtime/motion/*.motion3.json` (cada archivo describe una animación)
- Recursos de runtime/compatibilidad: `public/webpack/live2d.min.js` y dependencias `pixi.js`, `pixi-live2d-display`

Coloca nuevos archivos en `public/models/haru/runtime/` respetando la estructura: `model3.json`, `expressions/`, `motion/`.

## 3) Inicialización paso a paso

1. Crear `PIXI.Application` con las dimensiones deseadas y `resolution` según `window.devicePixelRatio`.
2. Limpiar y montar el `canvas` en el contenedor `canvasRef`.
3. Cargar el modelo con `await Live2DModel.from(modelPath)`. Este método descarga y parsea el `model3.json` y sus recursos relacionados.
4. Escuchar el evento `model.once('load', ...)` para ejecutar tareas post-carga (detener motions, reset de expresión, detectar parámetros expuestos).
5. Registrar el ticker necesario: `Live2DModel.registerTicker(Ticker)`. Esto enlaza la runtime de Live2D con el sistema de tiempo de PIXI.
6. Añadir el modelo al `app.stage`, fijar `model.scale`, `model.x`, `model.y` y propiedades como `interactive` si se requiere.
7. (Opcional) Añadir un `PIXI.Sprite` como fondo para estética.
8. Añadir un `app.ticker` adicional que invoque `model.update(...)` como redundancia en entornos donde la integración automática no funcione.

## 4) Lip-sync (cómo se mueve la boca)

Explicación técnica:
- La sincronización labial no utiliza reconocimiento fonético; usa una estimación de energía/rms del audio o un valor de activación generado por la capa de voz (`AuroraVoiceLocal`).
- Este valor es un número entre 0 y 1 que representa cuán abierta debería estar la boca.

Implementación y mapeo:
- El componente define una lista `mouthCandidates` con identificadores comunes: `['ParamMouthOpenY','ParamMouthOpen','ParamMouthOpenX','MouthOpen']`.
- Para cada frame de audio, se realiza:
  1. Clamp del valor a [0,1] y aplicar un factor de escala (ej. *0.9).
  2. Intentar escribir el valor en el `coreModel` usando `setParameterValueById(id, value)`.
  3. Si la API anterior no existe, intentar `internalModel.parameters.setValueById(id, value)`.
  4. Si no hay coincidencia, buscar en `coreModel.parameters` un parámetro cuyo id contenga la cadena `mouth` y usarlo.

Pseudocódigo simplificado:

```ts
const v = clamp(frameValue,0,1) * 0.9;
for (id of mouthCandidates) {
  if (coreModel.setParameterValueById) coreModel.setParameterValueById(id, v);
  else if (internalModel.parameters.setValueById) internalModel.parameters.setValueById(id, v);
}
// fallback: search any parameter with /mouth/i
```

Eventos globales:
- También se escucha `window.addEventListener('aurora-lipsync', ...)` que permite inyectar directamente un valor numérico desde otros módulos (útil en pruebas o cuando se sincroniza con TTS externa).

Consejos prácticos:
- Si la boca no responde, inspecciona `console.log` de parámetros detectados (el componente intentará listar parámetros expuestos al cargar).
- Ajusta el factor de escala si la apertura es demasiado intensa (`0.9` por defecto funciona bien en varios modelos).

## 5) Expresiones y motions: estructura y uso

- Expresiones (.exp3.json): describen combinaciones de parámetros para una expresión facial. Se aplican con `expressionManager.setExpression(url)`.
- Motions (.motion3.json): contienen animaciones (parpadeos, movimientos corporales). Se reproducen con `motionManager.startMotion(url, group, priority)`; el componente normalmente detiene todas las motions antes de iniciar una nueva (`stopAllMotions`).

Cómo activar desde el estado:
- El hook `useAuroraState` expone `expression` y `motion`. Cuando cambian, el componente monta la URL y solicita al manager la reproducción.

Buenas prácticas:
- Nombres consistentes: usar convenciones claras (ej. `smile`, `neutral`, `haru_g_idle`) para que el código que solicita motions/expressions no necesite mapeos adicionales.
- Validar que las rutas relativas dentro de `model3.json` y los assets coinciden con `public/models/...`.

## 6) Integración con la IA y flujo de control

Flujo típico:
1. UI envía texto → 2. `AnaCore.processUserMessage()` → 3. Se genera una `instruction` que puede contener `text`, `emotion`, `expression`, `motion` → 4. `applyAuroraInstruction(modelRef,instruction)` aplica cambios al avatar → 5. Si hay voz, `AuroraVoiceLocal.speak(text)` sintetiza audio y emite frames para lip-sync.

Notas:
- `applyAuroraInstruction` centraliza cómo se traducen las instrucciones de alto nivel en cambios de parámetros/gestos del modelo.