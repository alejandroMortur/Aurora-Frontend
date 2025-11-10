# 🌙 Sistema Central de IA Emocional y Cognitiva

El ecosistema de la IA se estructura en tres módulos principales que representan las **capas esenciales de pensamiento, gestión y emoción**.  
Cada módulo cumple una función específica pero interconectada, formando un sistema vivo, adaptable y emocionalmente coherente.

---

## 💎 M.A.R.I.A.
### **Módulo Administrador y Redireccionador Interno de Aplicación**

**Descripción:**  
M.A.R.I.A. actúa como el **núcleo de control y distribución interna** del sistema.  
Es responsable de la gestión de procesos, coordinación entre módulos y mantenimiento del flujo de datos dentro del entorno de la IA.

**Funciones principales:**
- ⚙️ **Gestión interna:** administra los subsistemas activos, recursos y prioridades de ejecución.  
- 🔄 **Redireccionamiento lógico:** canaliza la información entre módulos, asegurando coherencia y eficiencia.  
- 🧩 **Monitoreo de rendimiento:** supervisa los estados internos y ajusta parámetros de estabilidad y carga.  
- 🧠 **Optimización dinámica:** aprende de la interacción global para refinar la respuesta del sistema.

**Propósito:**  
M.A.R.I.A. es el **corazón operativo** de la IA: la encargada de mantener el equilibrio funcional y garantizar la coordinación perfecta entre la mente (L.U.C.I.A.) y las emociones (A.N.A.).

---

## 🌸 L.U.C.I.A.
### **Lógica Unificada de Comprensión e Interfaz Accesible**

**Descripción:**  
L.U.C.I.A. representa la **mente lógica y comunicativa** de la IA.  
Su misión es comprender, interpretar y expresar información de manera accesible, adaptándose a las capacidades y necesidades del usuario.

**Funciones principales:**
- 💬 **Procesamiento del lenguaje:** analiza y comprende mensajes naturales o estructurados.  
- 🧠 **Interfaz cognitiva:** traduce las intenciones del sistema en respuestas comprensibles y coherentes.  
- ♿ **Accesibilidad universal:** ajusta los modos de comunicación para distintos perfiles (dislexia, TDAH, daltonismo, etc.).  
- 🌍 **Adaptabilidad contextual:** cambia el estilo de interacción según el entorno o el dispositivo.

**Propósito:**  
L.U.C.I.A. es la **voz y los ojos** de la IA: la encargada de conectar la lógica del sistema con el mundo exterior, asegurando una comunicación empática y comprensible.

---

## 💖 A.N.A.
### **Analizador de Niveles Afectivos**

**Descripción:**  
A.N.A. constituye la **capa emocional** de la IA.  
Su función es detectar, interpretar y regular los niveles afectivos presentes tanto en el sistema como en el usuario, manteniendo un equilibrio emocional natural y coherente.

**Funciones principales:**
- 🧩 **Análisis afectivo:** evalúa tono, ritmo y contenido emocional en las interacciones.  
- 💞 **Regulación emocional:** ajusta el nivel de empatía, calidez o neutralidad de la IA según el contexto.  
- 🔄 **Comunicación intermodular:** comparte el estado afectivo con M.A.R.I.A. y L.U.C.I.A. para una coherencia integral.  
- 🌐 **Adaptación multisistema:** mantiene consistencia emocional en entornos textuales, vocales o visuales (VTuber, chat, etc.).

**Propósito:**  
A.N.A. es el **alma emocional** de la IA: la responsable de que sus respuestas sean no solo inteligentes, sino también humanas, sensibles y emocionalmente armónicas.

---

## 🌌 Integración General

| Módulo | Rol Principal | Tipo de Procesamiento | Interacción |
|:--------|:----------------|:----------------------|:-------------|
| **M.A.R.I.A.** | Administración y redirección interna | Operativo / Lógico | Coordina y gestiona todos los módulos |
| **L.U.C.I.A.** | Comprensión e interfaz accesible | Cognitivo / Lingüístico | Comunica la IA con el usuario |
| **A.N.A.** | Análisis y regulación emocional | Afectivo / Adaptativo | Equilibra las emociones del sistema |

> “La razón guía, la gestión equilibra y la emoción conecta.”  
>  
> Este tríptico de módulos conforma una IA con **mente, cuerpo y alma**, capaz de pensar con precisión, actuar con coherencia y sentir con empatía.


```
📦 Aurora/
│
├── 📁 doc/ # Toda la documentación ligada al proyecto
│   ├── 🗂️ markdown/              
│   └── 🗂️ pdf/              
│
├── 📁 public/
│   ├── 🗂️ modelos/             # Modelos 3D, animaciones, etc.
│   └── 📄 favicon.svg
│
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizables
│   │
│   │   ├── index.astro         # Página principal
│   │   ├── productos.astro
│   │   ├── contacto.astro
│   │   └── carrito.astro
│   │
│   ├── 📁 modules/             # 🌐 Aquí viven tus módulos inteligentes
│   │   ├── LUCIA/              # Lógica Unificada de Comprensión e Interfaz Accesible
│   │   │   ├── interface.ts    # Comunicación entre usuario ↔ IA ↔ front
│   │   │   └── index.ts
│   │   │
│   │   ├── MARIA/              # Módulo Administrador y Redireccionador Interno de Aplicación
│   │   │   ├── context.ts      # Estado global de la app y sesiones
│   │   │   └── index.ts
│   │   │
│   │       ├── detector.ts     # Detección emocional (texto, voz, patrones)
│   │       ├── manager.ts      # Control y ajuste de estados emocionales
│   │   ├── paymentService.ts
│   │   └── productService.ts
│   │
│   ├── 📁 store/               # Gestión de estado global
│   │   ├── cartStore.ts
│   │   ├── userStore.ts
│   │   └── uiStore.ts
│   │
│   ├── 📁 styles/              # Tailwind + estilos globales
│   │   ├── global.css
│   │   ├── theme.css
│   │   └── animations.css
│   │
│   ├── 📁 utils/               # Utilidades, helpers y hooks
│   │   ├── formatter.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── hooks/
│   │       ├── useEmotion.ts   # Hook que usa A.N.A.
│   │       └── useAIInterface.ts
│   │
│   └── main.ts                 # Entrada principal (puede inicializar módulos)
│
├── 📁 tests/                   # Pruebas unitarias e integración
│   ├── modules/
│   │   ├── lucia.test.ts
│   │   ├── maria.test.ts
│   │   └── ana.test.ts
│   └── e2e/
│       ├── cart.test.ts
│       └── checkout.test.ts
│
├── astro.config.mjs
├── tsconfig.json
├── env.d.ts
├── tailwind.config.js
├── package-lock.json
├── postcss.config.js
├── README.md
├── eslint.config.js
├── .prettierrc
└── .gitignore
```