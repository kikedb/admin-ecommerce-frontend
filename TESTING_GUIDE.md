# Guía de Testing - Sistema de Productos

## Estado Actual
✅ **Backend**: Completamente implementado con validaciones y manejo de relaciones
✅ **Frontend**: Componentes creados, modal funcional, store Pinia configurado
✅ **Build**: Compila sin errores

## Requisitos Previos
- Servidor de desarrollo Frontend: `npm run dev` (puerto 5174)
- Backend Laravel ejecutándose y accesible
- Usuario autenticado en la aplicación

## Características Implementadas

### 1. Pinia Store (`src/stores/product.js`)
- Estado centralizado con 76 campos para todos los datos del producto
- Función `clearInputs()` para limpiar el formulario
- Compatible con composables de Vue 3

### 2. Componentes de Secciones
#### GeneralSection.vue
- Nombre del producto
- SKU y códigos de barras
- Descripciones (corta y completa)
- Stock y stock crítico
- Precio y tipo de moneda
- Dropdowns dinámicas para: categorías, marcas, series, colores, materiales
- Modelo, condición, IVA, estado activo, URL YouTube

#### ImagesSection.vue
- Carga de imagen principal con preview
- Galería de imágenes múltiples
- Eliminación de imágenes individuales
- Vista previa en tiempo real

#### LogisticSection.vue
- Dimensiones: alto, ancho, largo, profundidad
- Peso y unidad de peso
- Clase logística, costo y método de envío
- Opción de retiro en persona
- Garantía: tipo, tiempo, unidad de tiempo

#### FeaturesSection.vue
- Información básica: rango edad, grupo edad, capacidad, piezas
- Características de seguridad: sonidos, baterías, luces, piezas pequeñas, hipoalergénico, etc.
- Características de cocina: seguro microondas, lavavajillas
- Características de diseño: forma, estilo decoración, tipo hogar
- Información adicional: unidades, peso máximo, características especiales

### 3. Modal Principal (ProductFormModal.vue)
- Sistema de 4 pestañas (General, Imágenes, Logística, Características)
- Navegación entre secciones
- Soporte para crear y editar productos
- Validación básica (requerida en campos obligatorios)
- Carga de datos existentes en modo edición

### 4. Integración en ProductsPage.vue
- Botón "+ Nuevo Producto" abre el modal
- Botón "Editar" carga producto en modo edición
- Modal se cierra automáticamente al guardar
- Refresca la lista de productos automáticamente

## Flujo de Testing

### Test 1: Crear Producto Nuevo
1. Navega a la página de Productos
2. Haz clic en "+ Nuevo Producto"
3. Completa la sección General:
   - Nombre: "Producto Test"
   - SKU: "TEST-001"
   - Código de Barras: "1234567890"
   - Descripción: "Descripción de prueba"
   - Stock: 10
   - Stock Crítico: 5
   - Precio: 99.99
   - Selecciona Categoría, Marca (requerido)
4. Ve a sección Imágenes:
   - Carga una imagen como imagen principal
   - Carga 2-3 imágenes para la galería
5. Ve a sección Logística:
   - Dimensiones: 10x20x30 cm
   - Peso: 5 kg
   - Garantía: Garantía del Fabricante, 12 meses
6. Ve a sección Características:
   - Completa algunos campos (opcional)
7. Haz clic en "Crear"
8. Verifica que el producto aparezca en la tabla

### Test 2: Editar Producto Existente
1. En la tabla de productos, haz clic en el botón "Editar" de cualquier producto
2. Verifica que los datos se cargen correctamente en el modal
3. Modifica algunos valores:
   - Nombre
   - Precio
   - Stock
4. Carga una nueva imagen
5. Haz clic en "Actualizar"
6. Verifica que los cambios se reflejen en la tabla

### Test 3: Validaciones
**Campos requeridos (Backend validará):**
- name
- sku (debe ser único)
- price
- critical_stock
- brand_id

Intenta crear un producto sin estos campos - el backend debe retornar error 422.

### Test 4: Manejo de Imágenes
1. En ImagesSection, carga una imagen principal
2. Verifica que se muestre el preview
3. Haz clic en "Cambiar Imagen" para reemplazarla
4. Carga múltiples imágenes en la galería
5. Pasa el mouse sobre una imagen para ver el botón X
6. Elimina una imagen y verifica que desaparezca

### Test 5: Validación de Relaciones
1. En GeneralSection, selecciona:
   - Una categoría
   - Una marca
   - Una serie (opcional)
   - Un color (opcional)
   - Un material (opcional)
2. Crea el producto
3. Al recuperar el producto, verifica que las relaciones se hayan guardado correctamente

## Validaciones Implementadas (Backend)

```
name: required|string
sku: required|string|unique:products,sku
price: required|numeric|min:0
critical_stock: required|integer|min:0
brand_id: required|exists:brands,id
category_id: exists:categories,id
serie_id: exists:series,id
color_id: exists:colors,id
material_id: exists:materials,id
images: array|max:10
images.*: image|mimes:jpeg,png,jpg,gif|max:2048
```

## API Endpoints Utilizados

### Productos
- `POST /api/admin/products` - Crear producto
- `PUT /api/admin/products/{id}` - Actualizar producto
- `GET /api/admin/products` - Listar productos
- `DELETE /api/admin/products/{id}` - Eliminar producto

### Catálogos (para dropdowns)
- `GET /api/admin/categories` - Categorías
- `GET /api/admin/brands` - Marcas
- `GET /api/admin/series` - Series
- `GET /api/admin/colors` - Colores
- `GET /api/admin/materials` - Materiales

## Estructura de Datos Enviada al Backend

El ProductFormModal construye un FormData con:
- Campos generales (name, sku, description, etc.)
- Campos de logística (weight, height, width, etc.)
- Campos de garantía (warranty_type, warranty_time, etc.)
- Campos de características (age_range, capacity, features, etc.)
- Array de imágenes (multipart)

## Troubleshooting

### El modal no se abre
- Verifica que ProductFormModal esté importado en ProductsPage.vue
- Revisa la consola del navegador para errores de Vue

### Las imágenes no se cargan
- Verifica que el servidor envíe el header `Content-Type: multipart/form-data`
- Revisa que el backend tenga permisos de escritura en `storage/app/public`

### Los dropdowns están vacíos
- Verifica que los endpoints `/api/admin/categories`, `/api/admin/brands`, etc. retornen datos
- Revisa la consola para errores de CORS o autenticación

### El producto no se crea
- Abre la consola del navegador (F12)
- Ve a la pestaña Network
- Busca la solicitud POST a `/api/admin/products`
- Revisa el response para ver el error del backend

## Próximos Pasos Opcionales

- Agregar validaciones front-end más robustas
- Implementar vista previa de producto antes de guardar
- Agregar soporte para drag & drop de imágenes
- Implementar auto-guardado o borrador
- Agregar historial de cambios
