# WARP.md

Este archivo proporciona orientación a WARP (warp.dev) al trabajar con código en este repositorio.

## Información del Proyecto

Panel de administración frontend para e-commerce desarrollado con Vue 3, Vite, Tailwind CSS y Flowbite. Se conecta a un backend Laravel mediante API REST.

## Comandos de Desarrollo

### Iniciar servidor de desarrollo
```powershell
npm run dev
```
El servidor se iniciará en `http://localhost:5173`

### Construir para producción
```powershell
npm run build
```
La compilación genera archivos en el directorio `dist/`

### Lint
```powershell
npm run lint
```
Ejecuta ESLint con corrección automática en archivos `.vue`, `.js`, `.jsx`, `.cjs`, `.mjs`

### Vista previa de producción
```powershell
npm run preview
```

## Arquitectura del Proyecto

### Stack Tecnológico
- **Framework**: Vue 3 (Composition API)
- **Gestión de estado**: Pinia
- **Enrutamiento**: Vue Router con guards de autenticación
- **UI**: Tailwind CSS + Flowbite Vue
- **HTTP Client**: Axios con interceptores configurados
- **Build**: Vite

### Estructura de Directorios

```
src/
├── components/        # Componentes reutilizables
│   ├── Form/         # Inputs y selects personalizados
│   ├── Products/     # Componentes específicos de productos
│   └── Toast/        # Sistema de notificaciones
├── composables/      # Lógica reutilizable (Composition API)
├── layouts/          # Layouts de página
├── pages/           # Vistas/páginas por módulo
│   ├── admin/
│   ├── auth/
│   ├── products/
│   ├── orders/
│   ├── inventory/
│   └── customers/
├── router/          # Configuración de rutas
├── services/        # Servicios de API
└── stores/          # Stores de Pinia
```

### Sistema de Autenticación

- Store centralizado en `src/stores/auth.js`
- Token almacenado en localStorage
- Interceptores de Axios configurados para:
  - Agregar token automáticamente a requests
  - Redirigir a login en caso de 401
  - Manejar FormData automáticamente
- Router guard en `src/router/index.js` que protege rutas con `meta.requiresAuth`

### Servicios de API

**Configuración Base** (`src/services/api.js`):
- Base URL configurable vía `VITE_API_URL` (default: `http://192.168.56.56`)
- Todos los endpoints usan prefijo `/api`
- Interceptores para autenticación y manejo de errores

**Proxy de Desarrollo** (`vite.config.js`):
- Las requests a `/api` se redirigen al backend configurado en `VITE_API_URL`

### Sistema de Productos

**Composable Principal** (`src/composables/useProducts.js`):
- Maneja paginación frontend (7 items por página)
- Carga 1000 productos del backend y pagina localmente
- Lógica de eliminación con fallback: si un producto tiene ventas asociadas, se deshabilita en lugar de eliminarse
- Integrado con sistema de notificaciones toast

**Generación de Descripciones IA** (`src/services/openai.service.js`):
- Integración con OpenAI GPT-4
- Genera dos descripciones: completa (400 chars max) y corta (140 chars max)
- Requiere `VITE_OPENAI_API_KEY` en variables de entorno

### Sistema de Notificaciones

Composable `useNotification` proporciona métodos:
- `success(message)`: notificación verde
- `error(message)`: notificación roja
- `warning(message)`: notificación amarilla

Usado extensivamente en operaciones CRUD.

### Variables de Entorno

Crear archivo `.env` basado en `.env.example`:
```
VITE_API_URL=http://app.admin-ecommerce-backend
VITE_APP_NAME="Admin Ecommerce"
VITE_APP_URL=http://localhost:5173
VITE_OPENAI_API_KEY=sk-...  # Opcional, para generación de descripciones
```

## Patrones y Convenciones

### Composition API
El proyecto usa exclusivamente Composition API con sintaxis `<script setup>` (cuando aplique).

### Alias de Importación
Se usa `@/` como alias para `src/`:
```javascript
import { useAuthStore } from '@/stores/auth'
import ProductForm from '@/components/Products/ProductForm.vue'
```

### Gestión de Estado
- Estado de autenticación: centralizado en Pinia store `auth`
- Estado de productos: manejado por composable `useProducts` (sin store dedicado)
- Preferir composables sobre stores para lógica de negocio específica

### Estilos
- Tailwind CSS para todos los estilos
- Flowbite Vue para componentes UI complejos
- Modo oscuro soportado con clase `dark:` de Tailwind
- Tema de colores primario: escala de azul personalizada

### Manejo de Formularios
- Composable `useFormValidation` para validaciones
- Componentes FormInput y FormSelect para consistencia
- FormData usado para requests con archivos/imágenes

### Paginación
La paginación se realiza en el **frontend** para productos:
1. Se cargan todos los productos (límite 1000) del backend
2. Se divide en páginas de 7 items
3. `currentPage`, `totalPages`, `totalItems` gestionados en composable

## Consideraciones Importantes

### Eliminación vs Deshabilitación
Al eliminar productos, el sistema verifica automáticamente si tienen ventas asociadas. Si las tienen, el producto se deshabilita en lugar de eliminarse (integridad referencial).

### Compilación
**SIEMPRE** ejecutar `npm run build` antes de hacer commits en cambios que afecten el código de producción. Verificar que la compilación termine sin errores.

### Puerto de Desarrollo
El servidor se ejecuta en puerto `5173` (configurado en `vite.config.js`).

### Compatibilidad de Shell
Todos los comandos deben ejecutarse en **PowerShell** en Windows. Verificar sintaxis de comandos antes de ejecutar.
