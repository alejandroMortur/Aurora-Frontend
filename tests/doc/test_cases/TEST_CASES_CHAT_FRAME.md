# Test Cases - AuroraChatFrame (Componente React)

## Descripción
Documento de especificación de casos de prueba para `AuroraChatFrame`, el componente React que renderiza la interfaz del chat con Aurora.

## Componente Testeado
```tsx
export const AuroraChatFrame: React.FC = () => { ... }
```

---

## Casos de Prueba - Renderizado Inicial

### Caso de Prueba 1: Renderización correcta
**ID**: CHATFRAME-001
**Descripción**: El componente se renderiza sin errores
**Setup**: `render(<AuroraChatFrame />)`
**Criterio de aceptación**:
- El componente no lanza excepciones
- El input está presente en el DOM
**Selectores**:
- Input: `placeholder` contiene "Escribe un mensaje"

### Caso de Prueba 2: Botón de envío visible
**ID**: CHATFRAME-002
**Descripción**: El botón de envío se muestra correctamente
**Setup**: `render(<AuroraChatFrame />)`
**Criterio de aceptación**:
- Existe un botón (`role="button"`)
- Texto del botón es `'💌'`
- Es clickeable

### Caso de Prueba 3: Array de mensajes vacío al inicio
**ID**: CHATFRAME-003
**Descripción**: No hay mensajes mostrados inicialmente
**Setup**: `render(<AuroraChatFrame />)`
**Criterio de aceptación**:
- No existen elementos con clase de mensaje
- El área de chat está vacía
- `queryAllByText(/Lorem ipsum|estoy|contigo/)` retorna array vacío

### Caso de Prueba 4: Input vacío al inicio
**ID**: CHATFRAME-004
**Descripción**: El input empieza sin contenido
**Setup**: `render(<AuroraChatFrame />)`
**Criterio de aceptación**:
- Input tiene `value === ''`
- Placeholder visible
- Input enfocable

---

## Casos de Prueba - Interacción de Usuario

### Caso de Prueba 5: Escribir en el input
**ID**: CHATFRAME-005
**Descripción**: El usuario puede escribir en el input
**Pasos**:
1. Render componente
2. `fireEvent.change(input, { target: { value: 'Hola Aurora' } })`
**Criterio de aceptación**:
- Input value es `'Hola Aurora'`
- Value actualiza reactivamente

### Caso de Prueba 6: Enviar mensaje con click
**ID**: CHATFRAME-006
**Descripción**: El mensaje se envía al clickear el botón
**Pasos**:
1. Escribir "Hola"
2. `fireEvent.click(button)`
3. Esperar con `waitFor`
**Criterio de aceptación**:
- Mensaje "Hola" aparece en el DOM
- Respuesta de Aurora también aparece
- Input se limpia después

### Caso de Prueba 7: Enviar mensaje con Enter
**ID**: CHATFRAME-007
**Descripción**: El mensaje se envía al presionar Enter
**Pasos**:
1. Escribir "Prueba"
2. `fireEvent.keyDown(input, { key: 'Enter' })`
3. `waitFor`
**Criterio de aceptación**:
- Mensaje "Prueba" visible
- Respuesta de Aurora visible
- Input limpio

### Caso de Prueba 8: No enviar mensaje vacío
**ID**: CHATFRAME-008
**Descripción**: No se envía un mensaje sin contenido
**Pasos**:
1. Input vacío
2. `fireEvent.click(button)`
**Criterio de aceptación**:
- No hay mensajes en el DOM
- Input sigue vacío
- No se llama `processUserInput`

### Caso de Prueba 9: No enviar solo espacios
**ID**: CHATFRAME-009
**Descripción**: No se envía entrada de solo espacios
**Pasos**:
1. Input: `'     '`
2. Click botón
**Criterio de aceptación**:
- No hay mensajes visibles
- Input se borra (trim)
- Equivalente a mensaje vacío

### Caso de Prueba 10: Limpiar input después de enviar
**ID**: CHATFRAME-010
**Descripción**: El input se vacía tras enviar mensaje
**Pasos**:
1. Escribir "Mensaje"
2. Click botón
3. `waitFor` respuesta
4. Verificar input value
**Criterio de aceptación**:
- `input.value === ''`
- Usuario puede escribir nuevo mensaje

---

## Casos de Prueba - Pipeline de Mensajes

### Caso de Prueba 11: Mostrar mensaje del usuario
**ID**: CHATFRAME-011
**Descripción**: El mensaje del usuario aparece en el chat
**Pasos**:
1. Escribir "Hola"
2. Enviar
3. `waitFor`
**Criterio de aceptación**:
- `getByText('Hola')` existe
- Clase de usuario aplicada (alineado a derecha, color rosa)

### Caso de Prueba 12: Mostrar respuesta de Aurora
**ID**: CHATFRAME-012
**Descripción**: La respuesta del bot aparece en el chat
**Pasos**:
1. Enviar "Hola"
2. `waitFor`
**Criterio de aceptación**:
- `getByText(/Lorem ipsum/)` existe
- Clase de Aurora aplicada (alineado a izquierda, color blanco)

### Caso de Prueba 13: Respuesta con "feliz"
**ID**: CHATFRAME-013
**Descripción**: Detecta emocionalidad en respuesta
**Entrada**: `'Me siento feliz'`
**Criterio de aceptación**:
- `getByText(/Estoy súper feliz/)` existe
- Respuesta emocional positiva

### Caso de Prueba 14: Respuesta con "triste"
**ID**: CHATFRAME-014
**Descripción**: Detecta emocionalidad triste
**Entrada**: `'Me siento triste'`
**Criterio de aceptación**:
- `getByText(/No pasa nada, estoy contigo/)` existe
- Respuesta empática

### Caso de Prueba 15: Mantener historial de múltiples mensajes
**ID**: CHATFRAME-015
**Descripción**: Los mensajes anteriores persisten
**Pasos**:
1. Enviar "Mensaje 1"
2. `waitFor`
3. Enviar "Mensaje 2"
4. `waitFor`
5. Verificar ambos
**Criterio de aceptación**:
- `getByText('Mensaje 1')` sigue visible
- `getByText('Mensaje 2')` visible
- Respuestas también presentes

---

## Casos de Prueba - Límites

### Caso de Prueba 16: Mensaje muy largo
**ID**: CHATFRAME-016
**Descripción**: Maneja mensajes de 500 caracteres
**Entrada**: `'a'.repeat(500)`
**Criterio de aceptación**:
- Mensaje enviado correctamente
- Se muestra en el DOM (aunque truncado visualmente)
- No causa error

### Caso de Prueba 17: Caracteres especiales
**ID**: CHATFRAME-017
**Descripción**: Maneja puntuación especial
**Entrada**: `'¿Hola? ¡Aurora! ¿Cómo estás?'`
**Criterio de aceptación**:
- `getByText(/¿Hola\?.*Aurora.*¿Cómo estás\?/)` existe
- Puntuación preservada
- Se renderiza correctamente

### Caso de Prueba 18: Acentos españoles
**ID**: CHATFRAME-018
**Descripción**: Soporta caracteres acentuados
**Entrada**: `'áéíóú ÁÉÍÓÚ ñ Ñ'`
**Criterio de aceptación**:
- Todos los acentos preservados
- Se muestra correctamente
- Sin errores de encoding

### Caso de Prueba 19: Espacios múltiples
**ID**: CHATFRAME-019
**Descripción**: Maneja entrada con espacios extra
**Entrada**: `'Hola     Aurora     ¿Cómo     estás?'`
**Criterio de aceptación**:
- Mensaje se envía
- Se muestra como fue escrito (frontend no normaliza)
- Backend puede normalizar

### Caso de Prueba 20: Saltos de línea
**ID**: CHATFRAME-020
**Descripción**: Maneja caracteres de nueva línea
**Entrada**: `'Hola\nAurora\n¿Cómo estás?'`
**Criterio de aceptación**:
- Mensaje se envía sin error
- Renderizado según CSS (puede mostrar saltos)
- No causa layout break

---

## Casos de Prueba - Estructura y Estilos

### Caso de Prueba 21: Container tiene clases CSS correctas
**ID**: CHATFRAME-021
**Descripción**: Verifica estructura CSS del contenedor
**Selector**: `.w-[500px]` o primer div
**Criterio de aceptación**:
- Clases: `bg-gray-900/70`, `backdrop-blur-md`, `rounded-2xl`
- Ancho: 500px
- Z-index apropiado

### Caso de Prueba 22: Input tiene placeholder
**ID**: CHATFRAME-022
**Descripción**: El input tiene texto de ayuda
**Criterio de aceptación**:
- Attribute `placeholder` presente
- Texto: "Escribe un mensaje para Aurora..."
- Visible cuando input vacío

### Caso de Prueba 23: Botón tiene estilo correcto
**ID**: CHATFRAME-023
**Descripción**: Botón tiene clases de Tailwind
**Criterio de aceptación**:
- Clases: `bg-pink-500`, `hover:bg-pink-600`
- Texto emoji: `'💌'`
- Transition smooth

### Caso de Prueba 24: Mensajes usuario alineados a derecha
**ID**: CHATFRAME-024
**Descripción**: Mensajes de usuario flotan a la derecha
**Criterio de aceptación**:
- Clase `ml-auto` aplicada
- Color `bg-pink-600/70`
- Text `text-right`

### Caso de Prueba 25: Mensajes Aurora alineados a izquierda
**ID**: CHATFRAME-025
**Descripción**: Mensajes de Aurora flotan a la izquierda
**Criterio de aceptación**:
- Clase `mr-auto` aplicada
- Color `bg-white/10` con border `border-pink-400/30`
- Text default (izquierda)

---

## Tabla de Resumen de Test Cases

| ID | Descripción | Tipo | Prioridad | Estado |
|:---|:-----------|:-----|:----------|:-------|
| CHATFRAME-001 | Renderización | Básico | ALTA | ✅ |
| CHATFRAME-002 | Botón visible | UI | ALTA | ✅ |
| CHATFRAME-003 | Array vacío | Estado | ALTA | ✅ |
| CHATFRAME-004 | Input vacío | Estado | ALTA | ✅ |
| CHATFRAME-005 | Escribir input | Interacción | ALTA | ✅ |
| CHATFRAME-006 | Enviar click | Interacción | ALTA | ✅ |
| CHATFRAME-007 | Enviar Enter | Interacción | ALTA | ✅ |
| CHATFRAME-008 | No enviar vacío | Validación | ALTA | ✅ |
| CHATFRAME-009 | No enviar espacios | Validación | MEDIA | ✅ |
| CHATFRAME-010 | Limpiar input | Funcionalidad | ALTA | ✅ |
| CHATFRAME-011 | Mostrar usuario | Pipeline | ALTA | ✅ |
| CHATFRAME-012 | Mostrar Aurora | Pipeline | ALTA | ✅ |
| CHATFRAME-013 | Respuesta feliz | Emoción | MEDIA | ✅ |
| CHATFRAME-014 | Respuesta triste | Emoción | MEDIA | ✅ |
| CHATFRAME-015 | Historial múltiple | Funcionalidad | ALTA | ✅ |
| CHATFRAME-016 | Mensaje largo | Edge Case | MEDIA | ✅ |
| CHATFRAME-017 | Caracteres especiales | Funcionalidad | MEDIA | ✅ |
| CHATFRAME-018 | Acentos españoles | Funcionalidad | ALTA | ✅ |
| CHATFRAME-019 | Espacios múltiples | Edge Case | BAJA | ✅ |
| CHATFRAME-020 | Saltos de línea | Edge Case | BAJA | ✅ |
| CHATFRAME-021 | Container CSS | Estructura | MEDIA | ✅ |
| CHATFRAME-022 | Input placeholder | Estructura | MEDIA | ✅ |
| CHATFRAME-023 | Botón estilo | Estructura | MEDIA | ✅ |
| CHATFRAME-024 | Usuario derecha | Estructura | MEDIA | ✅ |
| CHATFRAME-025 | Aurora izquierda | Estructura | MEDIA | ✅ |

---

## Notas de Testing

### Librerías Utilizadas
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuroraChatFrame } from '@/modules/AURORA/components/AuroraChatFrame';
```

### Mock de processUserInput
```typescript
jest.mock('@/modules/AURORA/core/AuroraMessageManager', () => ({
  processUserInput: jest.fn(async (input: string) => {
    if (input.includes('feliz')) {
      return '✨ Estoy súper feliz, mi amor ~';
    }
    if (input.includes('triste')) {
      return '💗 No pasa nada, estoy contigo preciosa';
    }
    return 'Lorem ipsum dolor sit amet...';
  }),
}));
```

### Tiempos de Espera
- `waitFor` default: 1000ms
- Para operaciones async: aumentar a 3000ms si es necesario

### Snapshots
Se recomienda crear snapshots de:
1. Estado inicial
2. Después de enviar mensaje
3. Con múltiples mensajes

```typescript
expect(container.firstChild).toMatchSnapshot();
```

---

## Ejecución de Tests

```bash
# Todos los tests del ChatFrame
npm test -- tests/modules/aurora-chat-frame.test.ts

# Con coverage
npm test -- tests/modules/aurora-chat-frame.test.ts --coverage

# En watch mode para desarrollo
npm test -- tests/modules/aurora-chat-frame.test.ts --watch

# Solo tests específicos
npm test -- tests/modules/aurora-chat-frame.test.ts -t "CHATFRAME-001"
```

---

## Debugging de Tests

### Ver qué se renderiza
```typescript
const { debug } = render(<AuroraChatFrame />);
debug(); // Imprime el DOM actual
```

### Verificar eventos
```typescript
const processUserInputMock = require('@/modules/AURORA/core/AuroraMessageManager');
expect(processUserInputMock.processUserInput).toHaveBeenCalledWith('mensaje');
```

### Esperar elementos con custom timeout
```typescript
await waitFor(() => {
  expect(screen.getByText('Hola')).toBeInTheDocument();
}, { timeout: 3000 });
```
