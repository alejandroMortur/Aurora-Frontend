# ⚙️ Guía de Instalación - Aurora Frontend

Esta guía te llevará paso a paso through la instalación y configuración del proyecto Aurora Frontend.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

### 🛠️ Software Requerido
- **Node.js** versión 18 o superior
  - [Descargar Node.js](https://nodejs.org/)
- **npm** o **yarn** como gestor de paquetes
- **Git** para control de versiones
  - [Descargar Git](https://git-scm.com/)

### 🔍 Verificar Instalaciones
```bash
# Verificar Node.js
node --version
# Debe mostrar v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar 8.x.x o superior

# Verificar Git
git --version

## 🚀 Instalación Paso a Paso

### 1. 📥 Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/aurora-frontend.git

# Navegar al directorio del proyecto
cd aurora-frontend
```

### 2. 📦 Instalar Dependencias

```bash
# Usando npm (recomendado)
npm install

# O usando yarn
yarn install
```

### 3. ⚙️ Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env

# Editar el archivo .env con tus configuraciones
# Necesitarás configurar:
# - API endpoints
# - Claves de servicios externos
# - Configuraciones de IA
```

Ejemplo de archivo .env:

```bash
# API Configuration
PUBLIC_API_URL=http://localhost:3000/api
PUBLIC_IA_API_URL=https://api.ia-service.com/v1

# Servicios de IA
PUBLIC_LUCIA_API_KEY=tu_clave_lucia
PUBLIC_ANA_EMOTION_API=tu_clave_emociones

# Configuración de E-commerce
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
PUBLIC_PAYMENT_SUCCESS_URL=http://localhost:4321/success
PUBLIC_PAYMENT_CANCEL_URL=http://localhost:4321/cancel

# Entorno
PUBLIC_NODE_ENV=development
```

## 🎯 Scripts Disponibles

### 🛠️ Desarrollo

```bash 
# Iniciar servidor de desarrollo
npm run dev

# Iniciar con modo inspector
npm run dev:debug

# Construir y previsualizar
npm run build
npm run preview
```

### 🏗️ Producción

```bash
# Construir para producción
npm run build

# Servir construcción de producción
npm run serve

# Análisis del bundle
npm run analyze
```

### 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests e2e
npm run test:e2e

# Generar reporte de cobertura
npm run test:coverage
```

### 🔧 Utilidades
```bash
# Linting y formateo
npm run lint
npm run format

# Type checking
npm run type-check

# Limpiar caché
npm run clean
````

## 🐛 Solución de Problemas Comunes

### ❌ Error: Puerto en Uso

```bash
# Encontrar proceso usando el puerto
lsof -ti:4321

# Terminar proceso
kill -9 $(lsof -ti:4321)

# O usar puerto diferente
npm run dev -- --port 4322
```

### ❌ Error: Dependencias No Encontradas
```bash
# Limpiar cache y reinstalar
npm cache clean --force

rm -rf node_modules

npm install
```

### ❌ Error: Variables de Entorno Faltantes
```bash
# Verificar que .env existe
ls -la .env

# Verificar variables requeridas
npm run env:check
```

### ❌ Error: TypeScript
```bash
# Verificar tipos
npm run type-check

# Reinstalar tipos
npm install @types/node @types/react
```
