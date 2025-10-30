# 🌙 Aurora Frontend

> **Sistema E-commerce Inteligente con IA Emocional Integrada**

Aurora es una plataforma de e-commerce revolucionaria que combina la potencia del comercio electrónico tradicional con un sistema de inteligencia artificial emocionalmente consciente. Diseñada para ofrecer experiencias de usuario personalizadas y empáticas.

## 🎯 Características Principales

### 🤖 **Sistema Tri-Modal de IA**
- **🧠 LUCIA** - Lógica Unificada de Comprensión e Interfaz Accesible
- **💾 MARIA** - Módulo Administrador y Redireccionador Interno de Aplicación  
- **💖 ANA** - Analizador de Niveles Afectivos

### 🛒 **Funcionalidades E-commerce**
- Catálogo de productos inteligente
- Carrito de compras dinámico
- Proceso de checkout 
- Interfaz adaptable a las necesidades del usuario

## 📚 Documentación

### 📖 **Documentación Técnica** ([Ver en Markdown](./doc/markdown/))
- [🏗️ Arquitectura del Sistema](./doc/markdown/arquitectura.md) - Descripción detallada de la arquitectura
- [📁 Estructura del Proyecto](./doc/markdown/estructura.md) - Organización de archivos y carpetas
- [⚙️ Guía de Instalación](./doc/markdown/instalacion.md) - Instrucciones de configuración
- [📋 README Principal](./doc/markdown/README.md) - Documentación general

### 📄 **Documentos en PDF** ([Ver en PDF](./doc/pdf/))
- [📋 Anteproyecto](./doc/pdf/Anteproyecto-Alejandro-Moron-Turiel.pdf) - Documento de anteproyecto completo
- [📖 Glosario](./doc/pdf/Glosario-Alejandro-Moron-Turiel.pdf) - Términos y definiciones del proyecto
- [🎨 Guía de Diseño UX/UI](./doc/pdf/Guia-Diseño-UX-UI-Alejandro-Moron-Turiel.pdf) - Especificaciones de diseño

## 🏗️ Arquitectura del Sistema

```
Aurora-Frontend/
├── 🧩 Components/ # Componentes reutilizables
├── 🌐 Pages/ # Vistas principales
├── 🧠 Modules/ # Núcleo del sistema + IA (API) 
├── 🔧 Services/ # Conexión con APIs externas
├── 🗃️ Store/ # Gestión de estado global
├── 🎨 Styles/ # Sistema de diseño
└── ⚙️ Utils/ # Utilidades y hooks
```


## 🧩 Módulos de IA Integrados

### 🌸 LUCIA - La Mente Lógica
L.U.C.I.A. representa la **mente lógica y comunicativa** de la IA.  
Su misión es comprender, interpretar y expresar información de manera accesible, adaptándose a las capacidades y necesidades del usuario.


```typescript
// Ejemplo de uso
import { parseCommand, detectIntent } from './modules/LUCIA/core';
```

## 💎 MARIA - El Corazón Operativo
M.A.R.I.A. actúa como el **núcleo de control y distribución interna** del sistema.  
Es responsable de la gestión de procesos, coordinación entre módulos y mantenimiento del flujo de datos dentro del entorno de la IA.

```typescript
// Ejemplo de uso  
import { appState, navigateTo } from './modules/MARIA/context';
```

## 💖 ANA - El Alma Emocional
A.N.A. constituye la **capa emocional** de la IA.  
Su función es detectar, interpretar y regular las expresiones emocionales en el avatar, manteniendo un equilibrio emocional natural y coherente.

```typescript
// Ejemplo de uso
import { detectEmotionFromText } from './modules/ANA/detector';
```

## 🌌 Integración General

| Módulo | Rol Principal | Tipo de Procesamiento | Interacción |
|:--------|:----------------|:----------------------|:-------------|
| **M.A.R.I.A.** | Administración y redirección interna | Operativo / Lógico | Coordina y gestiona todos los módulos |
| **L.U.C.I.A.** | Comprensión e interfaz accesible | Cognitivo / Lingüístico | Comunica la IA con el usuario |
| **A.N.A.** | Análisis y regulación emocional | Afectivo / Adaptativo | Equilibra las emociones del sistema |

---

## 🚀 Instalación y Configuración
### Prerrequisitos
- Node.js 18+

- npm o yarn

- TypeScript 4.9+


## Instalación

```Bash
cd aurora-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🌌 Integración General

| Módulo | Rol Principal | Tipo de Procesamiento | Interacción |
|:--------|:----------------|:----------------------|:-------------|
| **M.A.R.I.A.** | Administración y redirección interna | Operativo / Lógico | Coordina y gestiona todos los módulos |
| **L.U.C.I.A.** | Comprensión e interfaz accesible | Cognitivo / Lingüístico | Comunica la IA con el usuario |
| **A.N.A.** | Análisis y regulación emocional | Afectivo / Adaptativo | Equilibra las emociones del sistema |

---

### 💫 Filosofía del Sistema

> “La razón guía, la gestión equilibra y la emoción conecta.”  
>  
> Este tríptico de módulos conforma una IA con **mente, cuerpo y alma**, capaz de pensar con precisión, actuar con coherencia y sentir con empatía.

### Estructura del proyecto

```
📦 Aurora/
│
├── 📁 doc/ # Toda la documentación ligada al proyecto
│   ├── 🗂️ markdown/              
│   └── 🗂️ pdf/              
│
├── 📁 public/
│   ├── 🖼️ assets/              # Imágenes, logos, íconos estáticos
│   ├── 🗂️ modelos/             # Modelos 3D, animaciones, etc.
│   └── 📄 favicon.svg
│
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizables
│   │   ├── ui/                 # Botones, inputs, modales, loaders...
│   │   ├── layout/             # Cabecera, menú, pie, sidebar...
│   │   └── product/            # Tarjetas, galerías, reseñas...
│   │
│   ├── 📁 pages/               # Páginas principales del e-commerce
│   │   ├── index.astro         # Página principal
│   │   ├── productos.astro
│   │   ├── contacto.astro
│   │   └── carrito.astro
│   │
│   ├── 📁 modules/             # 🌐 Aquí viven tus módulos inteligentes
│   │   ├── LUCIA/              # Lógica Unificada de Comprensión e Interfaz Accesible
│   │   │   ├── core.ts         # Núcleo lógico (parsing, detección, comandos)
│   │   │   ├── interface.ts    # Comunicación entre usuario ↔ IA ↔ front
│   │   │   └── index.ts
│   │   │
│   │   ├── MARIA/              # Módulo Administrador y Redireccionador Interno de Aplicación
│   │   │   ├── routes.ts       # Gestión dinámica de rutas y navegación
│   │   │   ├── context.ts      # Estado global de la app y sesiones
│   │   │   └── index.ts
│   │   │
│   │   └── ANA/                # Analizador de Niveles Afectivos 💗
│   │       ├── detector.ts     # Detección emocional (texto, voz, patrones)
│   │       ├── manager.ts      # Control y ajuste de estados emocionales
│   │       ├── data/           # Diccionarios, perfiles emocionales, datasets
│   │       └── index.ts
│   │
│   ├── 📁 services/            # Conexión con APIs (backend, IA, pasarelas de pago)
│   │   ├── apiClient.ts
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