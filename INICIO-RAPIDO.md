# 🚀 Inicio Rápido - Admin E-commerce

## URLs Fijas (NO CAMBIAN)

- **Frontend (acceso principal)**: http://localhost:5173
- **Backend API**: http://localhost:8000

## Iniciar el Proyecto

### Opción 1: Scripts Individuales (Recomendado)

**Terminal 1 - Iniciar Backend:**
```bash
cd /Users/macarenapizarro/Documents/GitHub/admin-ecommerce-backend
./start-backend.sh
```

**Terminal 2 - Iniciar Frontend:**
```bash
cd /Users/macarenapizarro/Documents/GitHub/admin-ecommerce-frontend
./start-frontend.sh
```

### Opción 2: Comandos Manuales

**Terminal 1 - Backend:**
```bash
cd /Users/macarenapizarro/Documents/GitHub/admin-ecommerce-backend
php artisan serve --host=127.0.0.1 --port=8000
```

**Terminal 2 - Frontend:**
```bash
cd /Users/macarenapizarro/Documents/GitHub/admin-ecommerce-frontend
npm run dev
```

## Credenciales de Acceso

- **Email**: admin@admin.com
- **Password**: admin123

## Detener los Servidores

Si usaste el script automático: **Ctrl+C** en la terminal

Si iniciaste manual:
1. Buscar procesos: `lsof -i :8000 -i :5173`
2. Detener: `kill -9 [PID]`

O simplemente cierra las terminales.

## Solución de Problemas

### Puerto 8000 ocupado
```bash
lsof -i :8000
kill -9 [PID]
```

### Puerto 5173 ocupado
```bash
lsof -i :5173
kill -9 [PID]
```

### Backend no responde
Verifica que la base de datos SQLite exista:
```bash
ls -lh /Users/macarenapizarro/Documents/GitHub/admin-ecommerce-backend/database/database.sqlite
```

Si no existe, ejecuta:
```bash
cd /Users/macarenapizarro/Documents/GitHub/admin-ecommerce-backend
touch database/database.sqlite
php artisan migrate --seed
```

## Configuración Fija

La configuración de URLs está definida en:

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5173
```

**Backend** (`.env`):
```
APP_URL=http://localhost:8000
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

**⚠️ NO modificar estos valores** - Son las URLs definitivas del proyecto.

## Estructura del Proyecto

```
admin-ecommerce/
├── backend/                 # Laravel 12 + SQLite
│   └── Puerto: 8000
└── frontend/                # Vue 3 + Vite
    └── Puerto: 5173
```

## Stack Tecnológico

### Backend
- Laravel 12 (PHP 8.2+)
- Laravel Sanctum (autenticación)
- SQLite

### Frontend  
- Vue 3 (Composition API)
- Vite
- Tailwind CSS + Flowbite
- Pinia (estado)
- Vue Router

## Siguiente Paso

Si quieres unificar todo en **un solo lenguaje (Node.js)** para evitar conflictos PHP/JS, puedo ayudarte a:

1. Migrar el backend de Laravel a Express.js/NestJS
2. Mantener la misma estructura de API
3. Usar PostgreSQL o MongoDB en lugar de SQLite

Esto tomaría aproximadamente 4-6 horas de trabajo, pero tendrías todo el stack en JavaScript/TypeScript.
