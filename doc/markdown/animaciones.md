# Catálogo de Animaciones del Avatar

Este documento detalla todas las animaciones y expresiones disponibles para el avatar Live2D de Aurora.

## Motions (animaciones)
Archivos en `public/models/haru/runtime/motion/`:

| Archivo | Descripción | Uso típico |
|---------|-------------|------------|
| `haru_g_idle.motion3.json` | Animación neutral/reposo | Estado por defecto, parpadeo suave y pequeños movimientos |
| `haru_g_m01.motion3.json` | Saludo alegre | Saludar al usuario, inicio de conversación |
| `haru_g_m02.motion3.json` | Inclinación curiosa | Mostrar interés o confusión |
| `haru_g_m03.motion3.json` | Gesto afirmativo | Asentir, mostrar acuerdo |
| `haru_g_m04.motion3.json` | Negación suave | Negar, mostrar desacuerdo amable |
| `haru_g_m05.motion3.json` | Sorpresa | Reacción a información inesperada |
| `haru_g_m06.motion3.json` | Risa contenida | Respuesta a algo gracioso |
| `haru_g_m07.motion3.json` | Pensativa | Durante procesamiento o reflexión |
| `haru_g_m08.motion3.json` | Tímida/avergonzada | Reacción a cumplidos o situaciones incómodas |
| `haru_g_m09.motion3.json` | Energética | Momentos de entusiasmo |
| `haru_g_m17.motion3.json` | Gesto explicativo | Al dar explicaciones o instrucciones |
| `haru_g_m18.motion3.json` | Duda/confusión | Cuando no entiende algo |
| `haru_g_m19.motion3.json` | Satisfacción | Tras completar una tarea exitosamente |
| `haru_g_m20.motion3.json` | Disculpa | Para momentos de error o confusión |
| `haru_g_m21.motion3.json` - `m26.motion3.json` | Variaciones de reacciones | Diferentes intensidades de emociones básicas |

## Expresiones
Archivos en `public/models/haru/runtime/expressions/`:

| Expresión | Descripción | Uso común |
|-----------|-------------|-----------|
| `neutral.exp3.json` | Expresión neutral/base | Estado por defecto |
| `smile.exp3.json` | Sonrisa suave | Interacciones positivas |
| `happy.exp3.json` | Alegría | Momentos de éxito o felicitación |
| `sad.exp3.json` | Tristeza suave | Empatía o disculpas |
| `surprised.exp3.json` | Sorpresa | Reacción a novedades |
| `angry.exp3.json` | Molestia leve | Correcciones o advertencias |
| `worried.exp3.json` | Preocupación | Alertas o advertencias |
| `doubt.exp3.json` | Duda | Cuando necesita clarificación |

## Notas de implementación

### Características clave
- Las expresiones son instantáneas (cambios de parámetros), mientras que los motions son animaciones en el tiempo.
- Puedes combinar expresiones con motions: por ejemplo, `smile.exp3.json` con `haru_g_m01.motion3.json` para un saludo muy amigable.
- El idle (`haru_g_idle.motion3.json`) se usa como base y las demás motions lo interrumpen temporalmente.
- Las expresiones persisten hasta que se cambian, los motions vuelven a idle al terminar.

### Ejemplos de uso

```javascript
// Probar una motion
playMotion("haru_g_m01");  // saludo

// Probar una expresión
playExpression("smile");    // sonrisa

// Combinar ambas
playExpression("happy");
playMotion("haru_g_m06");  // risa feliz
```

### Guía de combinaciones recomendadas

Para lograr efectos más naturales y expresivos, se recomiendan las siguientes combinaciones:

1. Saludo inicial:
   - Motion: `haru_g_m01` (saludo)
   - Expresión: `smile` o `happy`

2. Procesamiento/pensando:
   - Motion: `haru_g_m07` (pensativa)
   - Expresión: `neutral` o `doubt`

3. Explicación:
   - Motion: `haru_g_m17` (explicativa)
   - Expresión: `smile`

4. Error o confusión:
   - Motion: `haru_g_m20` (disculpa)
   - Expresión: `worried` o `sad`

5. Respuesta positiva:
   - Motion: `haru_g_m03` (afirmativo)
   - Expresión: `happy`

6. Respuesta negativa:
   - Motion: `haru_g_m04` (negación)
   - Expresión: `worried` o `doubt`

## Uso en el código

Para implementar estas animaciones en el componente VtuberLive2D, se utilizan las funciones:

```typescript
// En VtuberLive2D.tsx
const playMotion = (motionId: string) => {
    if (model?.current) {
        model.current.motion(motionId);
    }
};

const playExpression = (expressionId: string) => {
    if (model?.current) {
        model.current.expression(expressionId);
    }
};
```

Las animaciones se pueden llamar desde cualquier parte del código que tenga acceso al componente del avatar, típicamente a través de refs o mediante el sistema de gestión de estado.