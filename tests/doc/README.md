# 🧪 Aurora Chatbot - Test Suite Documentation

## Descripción General

Este directorio contiene la suite de tests para la funcionalidad del chatbot (AURORA) del proyecto Aurora Frontend. Los tests cubren:

- **AuroraSanitizer**: Limpieza y seguridad de entrada de usuario
- **AuroraMessageManager**: Procesamiento de mensajes y generación de respuestas
- **AuroraChatFrame**: Componente React del interfaz del chat

## Estructura de Archivos

```
tests/
├── modules/
│   ├── aurora-sanitizer.test.ts          # Tests unitarios del sanitizador
│   ├── aurora-message-manager.test.ts    # Tests del procesador de mensajes
│   ├── aurora-chat-frame.test.ts         # Tests del componente UI
│   ├── ana.test.ts                       # Tests del módulo ANA (emociones)
│   ├── lucia.test.ts                     # Tests del módulo LUCIA (lógica)
│   └── maria.test.ts                     # Tests del módulo MARIA (orchestración)
├── e2e/
│   ├── cart.test.ts                      # Tests E2E del carrito
│   └── checkout.test.ts                  # Tests E2E del checkout
├── TEST_CASES_SANITIZER.md               # Documentación: 20 casos de prueba
├── TEST_CASES_MESSAGE_MANAGER.md         # Documentación: 25 casos de prueba
├── TEST_CASES_CHAT_FRAME.md              # Documentación: 25 casos de prueba
└── README.md                             # Este archivo
```

## Documentación de Test Cases

### 1️⃣ AuroraSanitizer
**Archivo**: `TEST_CASES_SANITIZER.md`

**Propósito**: Validar que la entrada de usuario se limpia correctamente de caracteres maliciosos y se normaliza.

**Casos cubiertos** (20):
- ✅ Limpiar caracteres peligrosos (XSS, HTML)
- ✅ Preservar caracteres válidos (letras, números, acentos)
- ✅ Normalizar espacios en blanco
- ✅ Truncar texto largo (>300 caracteres)
- ✅ Reemplazar palabras prohibidas
- ✅ Case-insensitive para prohibidas
- ✅ Soportar caracteres españoles (áéíóú ñ)
- ✅ Eliminar símbolos especiales
- ✅ Preservar puntuación básica
- ✅ Manejar edge cases (vacío, solo espacios, SQL injection)

**Ejemplo de ejecución**:
```bash
npm test -- tests/modules/aurora-sanitizer.test.ts
```

---

### 2️⃣ AuroraMessageManager
**Archivo**: `TEST_CASES_MESSAGE_MANAGER.md`

**Propósito**: Validar el pipeline de procesamiento de mensajes del usuario y generación de respuestas.

**Casos cubiertos** (25):
- ✅ Procesar mensaje válido
- ✅ Detectar emociones ("feliz", "triste")
- ✅ Respuesta por defecto para entrada neutral
- ✅ Sanitización antes de procesar
- ✅ Manejar entradas vacías y solo espacios
- ✅ Case-insensitive en detección de emociones
- ✅ Entradas muy largas
- ✅ Retorna Promise
- ✅ Caracteres españoles y acentos
- ✅ XSS y SQL Injection attempts
- ✅ Integración con AuroraSanitizer
- ✅ Coherencia de respuestas múltiples

**Flujo de procesamiento**:
```
User Input
   ↓
sanitizeText()          [Limpia entrada]
   ↓
generateAuroraResponse() [Genera respuesta]
   ↓
auroraVoice.speak()    [Reproduce audio]
   ↓
Return string
```

**Ejemplo de ejecución**:
```bash
npm test -- tests/modules/aurora-message-manager.test.ts --watch
```

---

### 3️⃣ AuroraChatFrame (React Component)
**Archivo**: `TEST_CASES_CHAT_FRAME.md`

**Propósito**: Validar la interacción del usuario con el interfaz del chat y el renderizado de React.

**Casos cubiertos** (25):
- ✅ Renderización inicial correcta
- ✅ Input y botón visibles
- ✅ Array vacío de mensajes al inicio
- ✅ Escribir en el input
- ✅ Enviar mensaje con click y Enter
- ✅ No enviar mensajes vacíos
- ✅ Limpiar input después de enviar
- ✅ Mostrar historial de múltiples mensajes
- ✅ Aplicar estilos CSS correctos
- ✅ Alineación de mensajes (usuario derecha, Aurora izquierda)
- ✅ Manejar caracteres especiales y acentos
- ✅ Detección de emocionalidad en respuestas

**Testing libraries**:
- `@testing-library/react` - Render y queries
- `fireEvent` - Simular eventos de usuario
- `waitFor` - Esperar operaciones async

**Ejemplo de ejecución**:
```bash
npm test -- tests/modules/aurora-chat-frame.test.ts --coverage
```

---

## Cómo Ejecutar los Tests

### Instalación de Dependencias
```bash
npm install --save-dev @types/jest jest ts-jest @testing-library/react @testing-library/jest-dom
```

### Ejecutar Todos los Tests
```bash
npm test
```

### Ejecutar Tests Específicos
```bash
# Tests del chatbot
npm test -- tests/modules/aurora-*.test.ts

# Solo AuroraSanitizer
npm test -- tests/modules/aurora-sanitizer.test.ts

# Solo AuroraMessageManager
npm test -- tests/modules/aurora-message-manager.test.ts

# Solo AuroraChatFrame
npm test -- tests/modules/aurora-chat-frame.test.ts
```

### Ejecutar en Watch Mode (Desarrollo)
```bash
npm test -- --watch

# O solo para un archivo
npm test -- tests/modules/aurora-sanitizer.test.ts --watch
```

### Reporte de Cobertura
```bash
npm test -- --coverage

# Solo archivos específicos
npm test -- tests/modules/aurora-*.test.ts --coverage
```

### Ejecutar Tests por Patrón
```bash
# Tests que contienen "sanitize"
npm test -- -t "sanitize"

# Tests de casos límite
npm test -- -t "edge case"
```

---

## Configuración de Jest

**Archivo**: `jest.config.js`

Configuración para:
- TypeScript compilación (`ts-jest`)
- Entorno jsdom para componentes React
- Path aliases (`@/*`)
- Module mapping para imports
- Coverage collection

**Setup**: `jest.setup.js`
- Mocks globales de `SpeechSynthesis`
- Mocks de `fetch` para API calls
- Limpieza entre tests

---

## Convenciones de Testing

### Estructura de Tests
```typescript
describe('Módulo', () => {
  describe('Caso de uso específico', () => {
    it('descripción del comportamiento esperado', () => {
      // Arrange
      const input = 'valor de entrada';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('valor esperado');
    });
  });
});
```

### Nomenclatura de Test Cases
- **ID único**: `MODULO-###` (ej: `SANITIZER-001`)
- **Descripción clara**: Qué se prueba
- **Entrada y salida**: Valores específicos
- **Criterios de aceptación**: Condiciones exactas

### Mocking
```typescript
jest.mock('@/modules/AURORA/core/AuroraMessageManager', () => ({
  processUserInput: jest.fn(async (input: string) => {
    return 'respuesta mock';
  }),
}));
```

---

## Casos de Prueba Críticos

### Seguridad (ALTA PRIORIDAD)
- [ ] `SANITIZER-001` - Limpiar XSS
- [ ] `SANITIZER-005` - Truncar texto (DoS)
- [ ] `MSGMGR-015` - XSS attempt
- [ ] `MSGMGR-016` - SQL Injection

### Funcionalidad Core (ALTA PRIORIDAD)
- [ ] `MSGMGR-001` - Procesar mensaje
- [ ] `MSGMGR-002` - Detectar "feliz"
- [ ] `MSGMGR-003` - Detectar "triste"
- [ ] `CHATFRAME-006` - Enviar con click
- [ ] `CHATFRAME-007` - Enviar con Enter
- [ ] `CHATFRAME-012` - Mostrar respuesta

### Internacionalización (ALTA PRIORIDAD)
- [ ] `SANITIZER-008` - Acentos españoles
- [ ] `MSGMGR-013` - Caracteres españoles
- [ ] `CHATFRAME-018` - Acentos en UI

---

## Debugging de Tests

### Ver el DOM renderizado
```typescript
const { debug } = render(<AuroraChatFrame />);
debug();
```

### Imprimir información de debug
```typescript
console.log('Input value:', (input as HTMLInputElement).value);
console.log('Messages:', screen.queryAllByText(/.*/).length);
```

### Aumentar timeout
```typescript
await waitFor(() => {
  expect(screen.getByText('texto')).toBeInTheDocument();
}, { timeout: 5000 });
```

### Verificar llamadas a mocks
```typescript
expect(processUserInputMock).toHaveBeenCalledWith('mensaje');
expect(processUserInputMock).toHaveBeenCalledTimes(1);
```

---

## Próximos Pasos - Casos No Implementados

### E2E Tests (Pendientes)
- `tests/e2e/cart.test.ts` - Tests de carrito
- `tests/e2e/checkout.test.ts` - Tests de checkout

### Módulos ANA, LUCIA, MARIA
- `tests/modules/ana.test.ts` - Tests del analizador emocional
- `tests/modules/lucia.test.ts` - Tests de procesamiento lógico
- `tests/modules/maria.test.ts` - Tests de orquestación

### Integración
- Tests de integración entre módulos
- Tests de API calls con backend
- Tests de voice synthesis

---

## Recursos

### Documentación de Modules
- `doc/markdown/arquitectura.md` - Arquitectura del sistema
- `doc/markdown/animaciones.md` - Sistema de animaciones

### Código Testeado
- `src/modules/AURORA/core/AuroraSanitizer.ts`
- `src/modules/AURORA/core/AuroraMessageManager.ts`
- `src/modules/AURORA/components/AuroraChatFrame.tsx`
- `src/modules/AURORA/components/ChatWrapper.tsx`

### Ejemplos de Jest
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing async code](https://jestjs.io/docs/asynchronous)

---

## Contribución

Al añadir nuevos tests:

1. ✅ Seguir estructura `describe > describe > it`
2. ✅ Usar IDs únicos (ej: `NEWMODULE-###`)
3. ✅ Documentar en archivo .md correspondiente
4. ✅ Incluir criterios de aceptación claros
5. ✅ Manejar edge cases y casos límite
6. ✅ Usar mocks para dependencias externas

---

**Última actualización**: Noviembre 2024
**Versión**: 1.0
**Cobertura target**: 80%+
