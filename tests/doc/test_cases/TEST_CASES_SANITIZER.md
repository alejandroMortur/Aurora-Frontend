# Test Cases - AuroraSanitizer

## Descripción
Este documento describe todos los casos de prueba para el módulo `AuroraSanitizer`, responsable de limpiar y validar la entrada de usuarios.

## Caso de Prueba 1: Limpiar caracteres especiales peligrosos
**ID**: SANITIZER-001
**Descripción**: Verifica que caracteres HTML/script peligrosos sean removidos
**Entrada**: `'Hola<script>alert("XSS")</script>'`
**Salida esperada**: `'Hola'` (sin caracteres `<` o `>`)
**Criterio de aceptación**: No contiene `<` ni `>`
**Riesgo**: XSS (Cross-Site Scripting)

## Caso de Prueba 2: Preservar caracteres alfanuméricos válidos
**ID**: SANITIZER-002
**Descripción**: Asegura que texto normal no sea alterado
**Entrada**: `'Hola mundo, ¿cómo estás?'`
**Salida esperada**: `'Hola mundo cómo estás'` (sin caracteres especiales)
**Criterio de aceptación**: Contiene palabras originales
**Notas**: Los signos de puntuación se preservan (`,`, `?`, `!`)

## Caso de Prueba 3: Trimear espacios
**ID**: SANITIZER-003
**Descripción**: Elimina espacios en blanco al inicio y final
**Entrada**: `'   Hola mundo   '`
**Salida esperada**: `'Hola mundo'`
**Criterio de aceptación**: Sin espacios al inicio/final

## Caso de Prueba 4: Normalizar espacios múltiples
**ID**: SANITIZER-004
**Descripción**: Reemplaza múltiples espacios con uno solo
**Entrada**: `'Hola    mundo    cómo   estás'`
**Salida esperada**: `'Hola mundo cómo estás'`
**Criterio de aceptación**: Máximo un espacio entre palabras

## Caso de Prueba 5: Truncar texto muy largo
**ID**: SANITIZER-005
**Descripción**: Limita la longitud máxima del texto
**Entrada**: 350 caracteres `'a'`
**Salida esperada**: Máximo 303 caracteres (300 + "...")
**Criterio de aceptación**: `result.length <= 303`
**Riesgo**: DoS (Denegación de Servicio)

## Caso de Prueba 6: Reemplazar palabras prohibidas
**ID**: SANITIZER-006
**Descripción**: Detecta palabras inapropiadas y las reemplaza
**Entrada**: `'Esto es tonto e idiota'`
**Salida esperada**: `'Esto es 💫 e 💫'`
**Palabras prohibidas**: `['tonto', 'idiota', 'estúpido']`
**Criterio de aceptación**: Contiene `💫`, sin palabras prohibidas

## Caso de Prueba 7: Case-insensitive para palabras prohibidas
**ID**: SANITIZER-007
**Descripción**: Detecta palabras prohibidas sin importar mayúsculas
**Entrada**: `'TONTO es una palabra prohibida'`
**Salida esperada**: `'💫 es una palabra prohibida'`
**Criterio de aceptación**: Detecta aunque esté en mayúsculas

## Caso de Prueba 8: Aceptar caracteres acentuados españoles
**ID**: SANITIZER-008
**Descripción**: Preserva caracteres españoles con acento
**Entrada**: `'áéíóú ÁÉÍÓÚ ñ Ñ'`
**Salida esperada**: `'áéíóú ÁÉÍÓÚ ñ Ñ'`
**Criterio de aceptación**: Contiene todos los caracteres acentuados
**Importancia**: Crítico para soporte multiidioma

## Caso de Prueba 9: Eliminar símbolos y caracteres especiales
**ID**: SANITIZER-009
**Descripción**: Remueve símbolos como @, #, $, %, etc.
**Entrada**: `'Hola @#$%^&*()[]{})'`
**Salida esperada**: `'Hola'`
**Criterio de aceptación**: No contiene ningún símbolo especial

## Caso de Prueba 10: Preservar puntuación básica
**ID**: SANITIZER-010
**Descripción**: Mantiene caracteres de puntuación esenciales
**Entrada**: `'Hola, ¿cómo estás? ¡Bien!'`
**Salida esperada**: Contiene `,`, `?`, `!`
**Criterio de aceptación**: Mantiene puntuación válida

## Caso de Prueba 11: String vacío
**ID**: SANITIZER-011
**Descripción**: Maneja entrada vacía sin errores
**Entrada**: `''`
**Salida esperada**: `''`
**Criterio de aceptación**: No genera excepciones

## Caso de Prueba 12: Solo espacios en blanco
**ID**: SANITIZER-012
**Descripción**: Convierte espacios en string vacío
**Entrada**: `'     '`
**Salida esperada**: `''`
**Criterio de aceptación**: Resultado vacío

## Caso de Prueba 13: Combinación de múltiples casos
**ID**: SANITIZER-013
**Descripción**: Testa múltiples reglas de sanitización a la vez
**Entrada**: `'   ¡Hola mundo!   <script>eres estúpido</script>   '`
**Salida esperada**: Sin `<>`, sin palabras prohibidas, trimado
**Criterio de aceptación**: Todas las reglas aplicadas correctamente

## Caso de Prueba 14: Emojis no deberían pasar
**ID**: SANITIZER-014
**Descripción**: Verifica que emojis se filtren
**Entrada**: `'Hola 👋 mundo 🌍 ¿cómo estás? 💫'`
**Salida esperada**: Sin emojis (excepto los que usamos internamente)
**Criterio de aceptación**: No contiene emojis exteriores

## Caso de Prueba 15: Preservar números
**ID**: SANITIZER-015
**Descripción**: Mantiene números en el texto
**Entrada**: `'El año 2024 es genial, ¿vamos al 100% de productividad?'`
**Salida esperada**: Contiene `2024` y `100`
**Criterio de aceptación**: Números preservados

## Caso de Prueba 16: URLs (debería remover caracteres especiales)
**ID**: SANITIZER-016
**Descripción**: Elimina URLs y caracteres de protocolo
**Entrada**: `'Visita www.example.com para más info'`
**Salida esperada**: Sin `://`, sin `.`
**Criterio de aceptación**: URL no se mantiene

## Caso de Prueba 17: SQL injection attempt
**ID**: SANITIZER-017
**Descripción**: Maneja intento de inyección SQL
**Entrada**: `"'; DROP TABLE users; --"`
**Salida esperada**: Sin caracteres SQL peligrosos
**Criterio de aceptación**: No contiene `'`, `;`, `-`
**Riesgo**: SQL Injection

## Caso de Prueba 18: XSS attempt con atributos
**ID**: SANITIZER-018
**Descripción**: Filtra intentos de XSS con atributos HTML
**Entrada**: `'<img src=x onerror="alert(1)">'`
**Salida esperada**: Sin `<`, `>`, `=`
**Criterio de aceptación**: No contiene caracteres HTML

## Caso de Prueba 19: Repetición excesiva
**ID**: SANITIZER-019
**Descripción**: Maneja entradas con caracteres repetidos
**Entrada**: 500 caracteres `'a'`
**Salida esperada**: Máximo 303 caracteres
**Criterio de aceptación**: Truncado a límite

## Caso de Prueba 20: Mezcla de espacios, puntuación y saltos de línea
**ID**: SANITIZER-020
**Descripción**: Maneja entrada con múltiples tipos de espacios en blanco
**Entrada**: `'Hola , , , mundo . . .'`
**Salida esperada**: Normalizado a `'Hola mundo'`
**Criterio de aceptación**: Espacios normalizados

## Tabla de Resumen

| ID | Descripción | Tipo | Prioridad | Estado |
|:---|:-----------|:-----|:----------|:-------|
| SANITIZER-001 | Limpiar caracteres especiales | Seguridad | ALTA | ✅ |
| SANITIZER-002 | Preservar caracteres válidos | Funcionalidad | ALTA | ✅ |
| SANITIZER-003 | Trimear espacios | Funcionalidad | MEDIA | ✅ |
| SANITIZER-004 | Normalizar espacios | Funcionalidad | MEDIA | ✅ |
| SANITIZER-005 | Truncar texto largo | Seguridad | ALTA | ✅ |
| SANITIZER-006 | Palabras prohibidas | Moderación | MEDIA | ✅ |
| SANITIZER-007 | Case-insensitive prohibidas | Moderación | MEDIA | ✅ |
| SANITIZER-008 | Acentos españoles | Funcionalidad | ALTA | ✅ |
| SANITIZER-009 | Eliminar símbolos | Seguridad | MEDIA | ✅ |
| SANITIZER-010 | Preservar puntuación | Funcionalidad | MEDIA | ✅ |
| SANITIZER-011 | String vacío | Edge Case | BAJA | ✅ |
| SANITIZER-012 | Solo espacios | Edge Case | BAJA | ✅ |
| SANITIZER-013 | Combinación múltiple | Funcionalidad | ALTA | ✅ |
| SANITIZER-014 | Filtrar emojis | Funcionalidad | BAJA | ✅ |
| SANITIZER-015 | Preservar números | Funcionalidad | MEDIA | ✅ |
| SANITIZER-016 | URLs | Seguridad | BAJA | ✅ |
| SANITIZER-017 | SQL Injection | Seguridad | ALTA | ✅ |
| SANITIZER-018 | XSS HTML | Seguridad | ALTA | ✅ |
| SANITIZER-019 | Repetición excesiva | DoS Prevention | MEDIA | ✅ |
| SANITIZER-020 | Espacios complejos | Edge Case | BAJA | ✅ |

## Notas de Implementación
- Todos los tests utilizan entrada asincrónica: `await sanitizeText(input)`
- El regex utilizado es: `/[^\w\s.,!?¡¿áéíóúÁÉÍÓÚñÑ]/g`
- Límite de longitud: 300 caracteres
- Palabras prohibidas: `['tonto', 'idiota', 'estúpido']` (extensible)

## Ejecución de Tests
```bash
npm test -- tests/modules/aurora-sanitizer.test.ts
```
