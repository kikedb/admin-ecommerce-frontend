# Admin Ecommerce Frontend - Arquitectura

## Visión General

SPA (Single Page Application) construido con **Vue 3 + Vite** que actúa como panel administrativo para un backend ecommerce en Laravel. Implementa un diseño profesional basado en Flowbite con soporte para dark mode.

## Stack Tecnológico

- **Vue 3.3.4** - Framework frontend moderno
- **Vite 5.0.2** - Build tool ultrarrápido
- **Vue Router 4.2.5** - Enrutamiento con guards de autenticación
- **Pinia 2.1.4** - Gestión centralizada de estado
- **Axios 1.5.0** - Cliente HTTP con interceptores
- **Tailwind CSS 3.3.5** - Framework de estilos utilitarios
- **Flowbite Vue 0.0.11** - Componentes UI predefinidos
- **Chart.js** - Visualización de datos
- **Date-fns** - Manejo de fechas

## Estructura de Carpetas

```
src/
├── components/              # Componentes reutilizables
│   ├── Navbar.vue          # Barra de navegación superior
│   └── Sidebar.vue         # Menú lateral con navegación
│
├── layouts/                 # Layouts principales
│   └── MainLayout.vue      # Layout para rutas autenticadas
│
├── pages/                   # Vistas/Páginas por módulo
│   ├── admin/
│   │   └── AdminDashboard.vue
│   ├── auth/
│   │   └── LoginPage.vue
│   ├── products/
│   │   └── ProductsPage.vue
│   ├── orders/
│   │   └── OrdersPage.vue
│   ├── inventory/
│   │   └── InventoryPage.vue
│   └── customers/
│       └── CustomersPage.vue
│
├── router/                  # Configuración de rutas
│   └── index.js
│
├── services/                # Lógica de integración con API
│   ├── api.js              # Instancia Axios con interceptores
│   └── auth.service.js     # Métodos de autenticación
│
├── stores/                  # Estado global (Pinia)
│   └── auth.js             # Store de autenticación
│
├── App.vue                 # Componente raíz
├── main.js                 # Punto de entrada
└── index.css              # Estilos globales
```

## Autenticación

### Flujo de Login
1. Usuario ingresa credenciales en `LoginPage.vue`
2. `auth.service.js` envía POST a `/api/auth/login`
3. Servidor retorna token JWT y datos del usuario
4. `auth.js` (Pinia store) persiste en localStorage
5. Router guard permite acceso a rutas `/admin/*`

### Interceptores HTTP
- **Request**: Añade header `Authorization: Bearer {token}`
- **Response**: Si 401, limpia storage y redirige a `/login`

## Componentes Principales

### Navbar (`src/components/Navbar.vue`)
- Logo y marca de la aplicación
- Buscador de productos (desktop)
- Dropdown de notificaciones con 3 notificaciones mock
- Dropdown de usuario (perfil, configuración, logout)
- Botón de menú móvil

**Props**: Ninguno (acceso a auth store)  
**Emits**: Ninguno

### Sidebar (`src/components/Sidebar.vue`)
- Información del usuario logueado
- Acciones rápidas (Perfil, Pagos, Soporte)
- Menú principal con submenús colapsables:
  - Inicio (Dashboard)
  - Productos (con submenu: Lista, Categorías, Marcas, Colores)
  - Órdenes (con submenu: Lista, Completadas, Pendientes)
  - Inventario
  - Clientes
- Sección de configuración (Configuración, Logout)
- Responsive (colapsable en móvil)

**Props**: Ninguno (acceso a auth store y router)  
**Emits**: Ninguno

### MainLayout (`src/layouts/MainLayout.vue`)
- Envuelve Navbar y Sidebar
- Proporciona slot para contenido principal
- Padding responsive en main content
- Soporte para dark mode

**Props**: Ninguno  
**Slots**: `default` para contenido principal

### AdminDashboard (`src/pages/admin/AdminDashboard.vue`)
- Header con título y descripción
- 4 KPI cards (Productos, Órdenes, Ventas, Stock)
- Sección de accesos rápidos con 4 botones a módulos principales
- Estilos preparados para conexión con API

## Rutas

| Ruta | Nombre | Componente | Auth Requerido |
|------|--------|-----------|---|
| `/login` | Login | LoginPage | ❌ |
| `/admin` | AdminDashboard | AdminDashboard | ✅ |
| `/admin/products` | ProductsList | ProductsPage | ✅ |
| `/admin/categories` | Categories | ProductsPage | ✅ |
| `/admin/brands` | Brands | ProductsPage | ✅ |
| `/admin/colors` | Colors | ProductsPage | ✅ |
| `/admin/orders` | OrdersList | OrdersPage | ✅ |
| `/admin/orders/completed` | CompletedOrders | OrdersPage | ✅ |
| `/admin/orders/pending` | PendingOrders | OrdersPage | ✅ |
| `/admin/inventory` | Inventory | InventoryPage | ✅ |
| `/admin/customers` | Customers | CustomersPage | ✅ |
| `/` | - | Redirect | - |
| `/*` | NotFound | Redirect | - |

## Dark Mode

Tailwind está configurado con `darkMode: 'class'`. Para activar dark mode:
1. Agregar clase `dark` al elemento `<html>`
2. Todos los componentes usan clases `dark:*` para estilos oscuros

## Variables de Entorno

```
VITE_API_URL=http://app.admin-ecommerce-backend      # URL base del backend
VITE_APP_NAME="Admin Ecommerce"                      # Nombre de la aplicación
VITE_APP_URL=http://localhost:5173                   # URL del frontend en desarrollo
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (puerto 5173)
npm run dev

# Build para producción
npm run build

# Previsualizar build
npm run preview

# Linting
npm run lint
```

## Próximos Pasos (Fase 2)

### Módulos CRUD
- [ ] Implementar servicio de productos (`src/services/products.service.js`)
- [ ] Crear tabla de datos reutilizable (`src/components/DataTable.vue`)
- [ ] Implementar CRUD de productos
- [ ] Crear formularios con validación
- [ ] Integrar con API backend

### Componentes Comunes
- [ ] Modal component
- [ ] Toast/Notification system
- [ ] Spinner/Loading states
- [ ] Breadcrumbs
- [ ] Pagination

### Dashboard Real
- [ ] Conectar KPIs a API
- [ ] Agregar gráficos con Chart.js
- [ ] Resumen de ventas y tendencias

### Testing
- [ ] Unit tests (Vitest)
- [ ] End-to-end tests (Playwright)

### Optimización
- [ ] Lazy loading de rutas
- [ ] Code splitting
- [ ] Compresión de imágenes
- [ ] PWA (Progressive Web App)

## Notas de Desarrollo

- El backend debe estar corriendo en `http://app.admin-ecommerce-backend`
- Las credenciales de login son las del backend Laravel
- Todos los componentes soportan dark mode con Tailwind
- El sidebar es responsivo y colapsable en móvil
- Los estilos siguen la paleta de colores primaria (azul) de Tailwind
