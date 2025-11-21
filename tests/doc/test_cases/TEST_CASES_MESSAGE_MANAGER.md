# Test Cases - AuroraMessageManager

## Descripción
Documento de especificación de casos de prueba para `AuroraMessageManager`, el módulo responsable de procesar entrada de usuario y generar respuestas de Aurora.

## Flujo General
```
User Input → sanitizeText() → generateAuroraResponse() → AuroraVoice.speak() → Output
```

---

## Casos de Prueba Básicos

### Caso de Prueba 1: Procesar mensaje válido
**ID**: MSGMGR-001
**Descripción**: Procesa un mensaje de usuario normal
**Entrada**: `'Hola Aurora, ¿cómo estás?'`
**Salida esperada**: String no vacío, response definida
**Criterio de aceptación**: 
- `result` es tipo `string`
- `result.length > 0`
**Tiempo esperado**: < 100ms

### Caso de Prueba 2: Detectar emoción "feliz"
**ID**: MSGMGR-002
**Descripción**: Responde apropiadamente a entrada con palabra "feliz"
**Entrada**: `'Me siento feliz'`
**Salida esperada**: Contiene `'feliz'` o respuesta relacionada a alegría
**Criterio de aceptación**: 
- Contiene palabra `'feliz'`
- Respuesta emocional positiva
**Pitch esperado**: Mayor (happy emotion)

### Caso de Prueba 3: Detectar emoción "triste"
**ID**: MSGMGR-003
**Descripción**: Responde apropiadamente a entrada con palabra "triste"
**Entrada**: `'Me siento triste'`
**Salida esperada**: Contiene `'contigo'` o respuesta empática
**Criterio de aceptación**:
- Contiene palabra `'contigo'`
- Respuesta empática negativa
**Pitch esperado**: Menor (sad emotion)

### Caso de Prueba 4: Respuesta por defecto para entrada neutral
**ID**: MSGMGR-004
**Descripción**: Devuelve respuesta por defecto para entrada neutra
**Entrada**: `'Hola, ¿qué tal?'`
**Salida esperada**: Response estándar (Lorem ipsum)
**Criterio de aceptación**:
- `result.length > 0`
- No contiene script/HTML
**Emotion**: `'sweet'`

### Caso de Prueba 5: Sanitización antes de procesar
**ID**: MSGMGR-005
**Descripción**: La entrada se sanitiza antes del procesamiento
**Entrada**: `'Hola<script>alert(1)</script>'`
**Salida esperada**: Response sin elementos HTML
**Criterio de aceptación**:
- No contiene `<script>`
- No genera error
- Response válida

### Caso de Prueba 6: Entrada vacía
**ID**: MSGMGR-006
**Descripción**: Maneja string vacío sin errores
**Entrada**: `''`
**Salida esperada**: Response definida
**Criterio de aceptación**:
- Sin excepciones
- Response válida
- Puede ser respuesta por defecto

### Caso de Prueba 7: Entrada solo espacios
**ID**: MSGMGR-007
**Descripción**: Maneja entrada de solo espacios
**Entrada**: `'     '`
**Salida esperada**: Response válida
**Criterio de aceptación**:
- Sin excepciones
- Response definida
- Equivalente a entrada vacía

### Caso de Prueba 8: Palabras prohibidas removidas
**ID**: MSGMGR-008
**Descripción**: Procesa entrada con palabras prohibidas (reemplazadas por 💫)
**Entrada**: `'Eres tonto'`
**Salida esperada**: Response procesada correctamente
**Criterio de aceptación**:
- Sin excepciones
- Input sanitizado antes de procesar
- Response válida

### Caso de Prueba 9: Case-insensitive detección emociones
**ID**: MSGMGR-009
**Descripción**: Detecta emociones sin importar mayúsculas
**Entrada**: `'FELIZ FELIZ FELIZ'`
**Salida esperada**: Response con emoción "happy"
**Criterio de aceptación**:
- Detecta incluso en mayúsculas
- Response positiva
- Pitch aumentado

### Caso de Prueba 10: Entrada muy larga
**ID**: MSGMGR-010
**Descripción**: Maneja entrada con más de 300 caracteres
**Entrada**: `'Hola Aurora ' + 'blablabla '.repeat(50)`
**Salida esperada**: Response válida
**Criterio de aceptación**:
- Input truncado a 300 chars
- Response generada correctamente
- Sin excepciones

---

## Casos de Prueba Funcionales

### Caso de Prueba 11: String no vacío en respuesta
**ID**: MSGMGR-011
**Descripción**: Toda respuesta debe ser no-vacía
**Entradas**: 
- `'Hola'`
- `'Adiós'`
- `'¿Cómo estás?'`
- `'Me siento feliz'`
- `'Me siento triste'`
**Criterio de aceptación**: Todas las respuestas tienen `.trim().length > 0`

### Caso de Prueba 12: Retorna Promise
**ID**: MSGMGR-012
**Descripción**: Función es asincrónica
**Entrada**: `'Prueba'`
**Salida esperada**: `Promise<string>`
**Criterio de aceptación**: 
- `processUserInput(input)` retorna `instanceof Promise`
- Se puede usar `await`

### Caso de Prueba 13: Caracteres españoles preservados
**ID**: MSGMGR-013
**Descripción**: Acentos españoles se procesan correctamente
**Entrada**: `'Me siento muy contento con los acentos: áéíóú'`
**Salida esperada**: Response sin errores
**Criterio de aceptación**:
- Sin excepciones
- Response válida
- Input preservado en sanitización

### Caso de Prueba 14: Estructura de respuesta válida
**ID**: MSGMGR-014
**Descripción**: La respuesta tiene estructura esperada
**Entrada**: `'Prueba general'`
**Criterio de aceptación**:
- `typeof result === 'string'`
- `0 < result.length < 1000`
- No contiene caracteres peligrosos

---

## Casos Límite y Edge Cases

### Caso de Prueba 15: XSS attempt
**ID**: MSGMGR-015
**Descripción**: Bloquea intento de inyección XSS
**Entrada**: `'<img src=x onerror="alert(1)">'`
**Salida esperada**: Response sin HTML/JavaScript
**Criterio de aceptación**:
- No contiene `<`, `>`
- No ejecuta código
- Response segura

### Caso de Prueba 16: SQL Injection attempt
**ID**: MSGMGR-016
**Descripción**: Maneja intento de inyección SQL
**Entrada**: `"'; DROP TABLE users; --"`
**Salida esperada**: Response válida
**Criterio de aceptación**:
- Sin excepciones
- Input sanitizado
- No afecta base de datos (n/a en frontend)

### Caso de Prueba 17: Repetición excesiva
**ID**: MSGMGR-017
**Descripción**: Maneja entrada con caracteres repetidos
**Entrada**: `'a'.repeat(500)`
**Salida esperada**: Response válida
**Criterio de aceptación**:
- Input truncado a 300 chars
- Response procesada
- Sin excepciones

### Caso de Prueba 18: Números y caracteres especiales
**ID**: MSGMGR-018
**Descripción**: Maneja números y símbolos
**Entrada**: `'1234567890!@#$%^&*()'`
**Salida esperada**: Response válida
**Criterio de aceptación**:
- Números preservados
- Símbolos removidos (sanitización)
- Response por defecto

### Caso de Prueba 19: Múltiples puntuaciones
**ID**: MSGMGR-019
**Descripción**: Maneja entrada con exceso de puntuación
**Entrada**: `'¿¿¿Hola??? !!!Aurora!!! ...'`
**Salida esperada**: Response válida normalizada
**Criterio de aceptación**:
- Puntuación preservada
- Espacios normalizados
- Response válida

### Caso de Prueba 20: Saltos de línea y tabulaciones
**ID**: MSGMGR-020
**Descripción**: Maneja diferentes tipos de espacios en blanco
**Entrada**: `'Hola\nAurora\n¿Cómo\nestás?'` y `'Hola\t\t\tAurora'`
**Salida esperada**: Response válida normalizada
**Criterio de aceptación**:
- Sin excepciones
- Espacios normalizados
- Response procesada

### Caso de Prueba 21: Mezcla de idiomas
**ID**: MSGMGR-021
**Descripción**: Maneja entrada con inglés y español
**Entrada**: `'Hello Aurora, ¿cómo estás? I am happy!'`
**Salida esperada**: Response válida
**Criterio de aceptación**:
- Detecta palabra "happy" (si se implementa)
- Response válida
- Sin errores de codificación

### Caso de Prueba 22: Entrada completamente filtrada
**ID**: MSGMGR-022
**Descripción**: Entrada que es solo caracteres especiales
**Entrada**: `'@#$%^&*()[]{}|;:,.<>?/~`'`
**Salida esperada**: Response válida
**Criterio de aceptación**:
- Input convertido a string vacío post-sanitización
- Response por defecto
- Sin excepciones

---

## Casos de Prueba de Integración

### Caso de Prueba 23: Integración sanitización
**ID**: MSGMGR-023
**Descripción**: Valida que la integración con AuroraSanitizer funcione
**Entrada**: `'<b>Hola</b> mundo con <script>injection</script>'`
**Salida esperada**: Response sin script tags
**Criterio de aceptación**:
- Sanitización aplicada antes de response
- No contiene `<script>`
- Response válida

### Caso de Prueba 24: Coherencia de respuestas múltiples
**ID**: MSGMGR-024
**Descripción**: Misma entrada genera respuestas coherentes
**Entrada múltiple**: 
- `'feliz'`
- `'Feliz'`
- `'FELIZ'`
- `'F E L I Z'` (espacio entre caracteres)
**Criterio de aceptación**:
- Primera, segunda, tercera responden "happy"
- Cuarta puede variar (depende de sanitización)
- Todas válidas

### Caso de Prueba 25: Encadenamiento de palabras clave
**ID**: MSGMGR-025
**Descripción**: Entrada con múltiples palabras clave
**Entrada**: `'Me siento feliz y triste'`
**Salida esperada**: Respuesta dominante (feliz o triste)
**Criterio de aceptación**:
- La primera coincidencia gana (feliz aparece primero)
- Response coherente
- Sin excepciones

---

## Tabla de Resumen

| ID | Descripción | Tipo | Prioridad | Estado |
|:---|:-----------|:-----|:----------|:-------|
| MSGMGR-001 | Procesar mensaje válido | Básico | ALTA | ✅ |
| MSGMGR-002 | Detectar "feliz" | Funcionalidad | ALTA | ✅ |
| MSGMGR-003 | Detectar "triste" | Funcionalidad | ALTA | ✅ |
| MSGMGR-004 | Respuesta neutral | Funcionalidad | ALTA | ✅ |
| MSGMGR-005 | Sanitización | Seguridad | ALTA | ✅ |
| MSGMGR-006 | Entrada vacía | Edge Case | MEDIA | ✅ |
| MSGMGR-007 | Solo espacios | Edge Case | MEDIA | ✅ |
| MSGMGR-008 | Palabras prohibidas | Funcionalidad | MEDIA | ✅ |
| MSGMGR-009 | Case-insensitive | Funcionalidad | MEDIA | ✅ |
| MSGMGR-010 | Entrada muy larga | Edge Case | MEDIA | ✅ |
| MSGMGR-011 | String no vacío | Validación | MEDIA | ✅ |
| MSGMGR-012 | Retorna Promise | Validación | ALTA | ✅ |
| MSGMGR-013 | Caracteres españoles | Funcionalidad | ALTA | ✅ |
| MSGMGR-014 | Estructura válida | Validación | MEDIA | ✅ |
| MSGMGR-015 | XSS attempt | Seguridad | ALTA | ✅ |
| MSGMGR-016 | SQL Injection | Seguridad | ALTA | ✅ |
| MSGMGR-017 | Repetición excesiva | DoS Prevention | MEDIA | ✅ |
| MSGMGR-018 | Números/símbolos | Funcionalidad | MEDIA | ✅ |
| MSGMGR-019 | Múltiples puntuaciones | Edge Case | BAJA | ✅ |
| MSGMGR-020 | Espacios en blanco | Funcionalidad | MEDIA | ✅ |
| MSGMGR-021 | Mezcla de idiomas | Funcionalidad | BAJA | ✅ |
| MSGMGR-022 | Entrada filtrada | Edge Case | BAJA | ✅ |
| MSGMGR-023 | Integración sanitización | Integración | ALTA | ✅ |
| MSGMGR-024 | Coherencia múltiple | Validación | MEDIA | ✅ |
| MSGMGR-025 | Múltiples palabras clave | Funcionalidad | MEDIA | ✅ |

---

## Notas de Implementación

### Flujo de Procesamiento Esperado
1. User Input recibido
2. `sanitizeText(input)` - Limpia entrada
3. `generateAuroraResponse(cleanText)` - Genera respuesta
4. `auroraVoice.speak(response, emotionOptions)` - Reproduce audio
5. Retorna string con respuesta

### Variables de Ambiente Requeridas
- `PUBLIC_API_URL` - URL del backend (si se integra)
- `PUBLIC_IA_API_URL` - URL del servicio IA

### Límites de Seguridad
- Longitud máxima: 300 caracteres
- Palabras prohibidas: Extensible en `AuroraSanitizer.ts`
- Regex permitido: `/[^\w\s.,!?¡¿áéíóúÁÉÍÓÚñÑ]/g`

## Ejecución de Tests
```bash
# Todos los tests del mensaje manager
npm test -- tests/modules/aurora-message-manager.test.ts

# Con coverage
npm test -- tests/modules/aurora-message-manager.test.ts --coverage

# En watch mode
npm test -- tests/modules/aurora-message-manager.test.ts --watch
```

## Debugging
Para debugging durante desarrollo:
```typescript
// En AuroraMessageManager.ts
console.log("📥 Texto recibido:", rawInput);
console.log("🧼 Texto sanitizado:", cleanText);
console.log("💬 Respuesta Aurora:", response);
```
