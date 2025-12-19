# Conexión Frontend-Backend - Admin Ecommerce

## Estado Actual ✅

La conexión entre el frontend (Vue 3) y el backend (Laravel) está **completamente funcional** y probada.

## Configuración

### Backend
- **URL:** `http://localhost:8000`
- **Framework:** Laravel con Sanctum
- **Base de datos:** MySQL
- **Ubicación:** `C:\Users\mpizarro\Documents\GitHub\admin-ecommerce-backend`

### Frontend
- **URL:** `http://localhost:5173`
- **Framework:** Vue 3 + Vite
- **Ubicación:** `C:\Users\mpizarro\Documents\GitHub\admin-ecommerce-frontend`

### Variables de Entorno
Archivo `.env` en el frontend:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="Admin Ecommerce"
VITE_APP_URL=http://localhost:5173
```

## Servicios Corriendo

Ambos servicios están corriendo como **jobs en background** en PowerShell:

```powershell
# Ver estado de los servicios
Get-Job

# Ver logs del backend
Receive-Job -Name 'Laravel-Backend' -Keep

# Ver logs del frontend
Receive-Job -Name 'Vite-Frontend' -Keep

# Detener servicios
Stop-Job -Name 'Laravel-Backend'
Stop-Job -Name 'Vite-Frontend'
```

## Iniciar Servicios Manualmente

### Backend
```powershell
Start-Job -Name "Laravel-Backend" -ScriptBlock { 
    Set-Location "C:\Users\mpizarro\Documents\GitHub\admin-ecommerce-backend"
    php artisan serve --host=127.0.0.1 --port=8000
}
```

### Frontend
```powershell
Start-Job -Name "Vite-Frontend" -ScriptBlock { 
    Set-Location "C:\Users\mpizarro\Documents\GitHub\admin-ecommerce-frontend"
    npm run dev
}
```

## Autenticación

### Credenciales de Prueba
- **Email:** admin@admin.com
- **Password:** admin123

### Flujo de Autenticación
1. Login en `/api/auth/login` retorna un token Bearer
2. El token se guarda en `localStorage`
3. Axios interceptor agrega el token automáticamente a todas las peticiones
4. El backend valida el token con Sanctum

## Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/logout` - Logout de usuario
- `GET /api/me` - Obtener usuario autenticado

### Datos para Selectores (Protegidos)
Todos estos endpoints requieren autenticación:

- `GET /api/admin/categories/active/all` - Categorías activas (6 items)
- `GET /api/admin/brands/active/all` - Marcas activas (15 items)
- `GET /api/admin/colors/active/all` - Colores activos (22 items)
- `GET /api/admin/series/active/all` - Series activas (8 items)
- `GET /api/admin/materials/active/all` - Materiales activos (22 items)

### Productos
- `GET /api/admin/products` - Listar productos
- `POST /api/admin/products` - Crear producto
- `GET /api/admin/products/{id}` - Ver producto
- `PUT /api/admin/products/{id}` - Actualizar producto
- `DELETE /api/admin/products/{id}` - Eliminar producto
- `POST /api/admin/products/sku` - Generar SKU automático

## Componente GeneralSection

### Estado de Carga
El componente ahora incluye:

- ✅ **Loading state** para dropdowns
- ✅ Placeholder dinámico "Cargando..." durante carga de datos
- ✅ Deshabilita dropdowns mientras carga
- ✅ Validación de campos requeridos
- ✅ Mensajes de advertencia para generación con IA
- ✅ Estilos disabled para mejor UX

### Uso del Composable
```javascript
import { useSelectOptions } from '@/composables/useSelectOptions'

const { 
  categories, 
  brands, 
  series, 
  colors, 
  materials, 
  loading,  // <-- Estado de carga
  error,    // <-- Errores
  loadOptions 
} = useSelectOptions()

// Cargar opciones al montar
onMounted(() => {
  loadOptions()
})
```

## Pruebas Realizadas

### ✅ Test de Conexión
```powershell
# Test completo de endpoints
$body = @{ email = "admin@admin.com"; password = "admin123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.data.token
$headers = @{"Authorization"="Bearer $token"}

# Probar endpoints
Invoke-RestMethod -Uri "http://localhost:8000/api/admin/categories/active/all" -Headers $headers
```

### ✅ Build del Frontend
```bash
npm run build
# ✓ 116 modules transformed
# ✓ built in 3.42s
```

## Últimos Cambios

### Commit: feat: mejorar UX de selectores
- Agregado loading state para deshabilitar dropdowns
- Placeholder dinámico "Cargando..." durante carga
- Estilos disabled para selectores
- Validación y mensajes de advertencia mejorados
- Inicialización de loading en true

## Próximos Pasos Recomendados

1. **Testing en navegador:**
   - Abrir http://localhost:5173
   - Hacer login con admin@admin.com / admin123
   - Verificar que los dropdowns cargan correctamente

2. **Validación de formulario:**
   - Probar creación de producto completo
   - Verificar generación automática de SKU
   - Validar generación de descripciones con IA

3. **Manejo de errores:**
   - Probar sin conexión al backend
   - Verificar mensajes de error apropiados
   - Validar reautenticación en caso de token expirado

## Troubleshooting

### Backend no responde
```powershell
# Verificar que el job está corriendo
Get-Job -Name 'Laravel-Backend'

# Ver logs de error
Receive-Job -Name 'Laravel-Backend' -Keep

# Reiniciar si es necesario
Stop-Job -Name 'Laravel-Backend'
Remove-Job -Name 'Laravel-Backend'
# Luego iniciar nuevamente
```

### Frontend no carga datos
1. Verificar que el token está en localStorage
2. Abrir DevTools > Console para ver errores
3. Verificar Network tab para ver peticiones fallidas
4. Confirmar que VITE_API_URL apunta a http://localhost:8000

### CORS Errors
El backend ya está configurado con CORS. Si aparecen errores, verificar:
- `config/cors.php` en el backend
- Middleware de CORS en `app/Http/Kernel.php`

## Recursos

- **Axios Config:** `src/services/api.js`
- **Auth Service:** `src/services/auth.service.js`
- **Products Service:** `src/services/products.service.js`
- **Select Options Composable:** `src/composables/useSelectOptions.js`
- **Backend Routes:** `admin-ecommerce-backend/routes/api.php`
