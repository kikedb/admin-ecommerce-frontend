# Reglas de Validación Backend - Alineación Frontend

## Objetivo
Las validaciones del backend (Laravel) deben coincidir exactamente con las validaciones del frontend (Vue.js) para garantizar integridad de datos.

---

## 🔒 Campos Requeridos (14 Total)

Todos estos campos DEBEN tener validación en el backend:

### 1. **name** (Nombre del Producto)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== ''
```

**Validación Backend Esperada (Laravel)**:
```php
'name' => 'required|string'
```

---

### 2. **sku** (Código de Referencia)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== ''
```

**Validación Backend Esperada (Laravel)**:
```php
'sku' => 'required|string|unique:products,sku' // opcional unique
```

---

### 3. **price** (Precio)
**Validación Frontend**:
```javascript
validator: (val) => val && val > 0
```

**Validación Backend Esperada (Laravel)**:
```php
'price' => 'required|numeric|min:0.01' // Debe ser > 0
```

---

### 4. **stock** (Inventario)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val >= 1
```

**Validación Backend Esperada (Laravel)**:
```php
'stock' => 'required|integer|min:1' // Debe ser >= 1
```

---

### 5. **criticalStock** (Stock Crítico)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val >= 0
```

**Validación Backend Esperada (Laravel)**:
```php
'critical_stock' => 'required|integer|min:0' // Puede ser 0 pero no negativo
```

---

### 6. **categoryId** (Categoría)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== '' && val > 0
```

**Validación Backend Esperada (Laravel)**:
```php
'category_id' => 'required|integer|exists:categories,id' // Debe existir
```

---

### 7. **brandId** (Marca)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== '' && val > 0
```

**Validación Backend Esperada (Laravel)**:
```php
'brand_id' => 'required|integer|exists:brands,id' // Debe existir
```

---

### 8. **colorId** (Color)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== '' && val > 0
```

**Validación Backend Esperada (Laravel)**:
```php
'color_id' => 'required|integer|exists:colors,id' // Debe existir
```

---

### 9. **serieId** (Serie)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== '' && val > 0
```

**Validación Backend Esperada (Laravel)**:
```php
'serie_id' => 'required|integer|exists:series,id' // Debe existir
```

---

### 10. **materialId** (Material)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== '' && val > 0
```

**Validación Backend Esperada (Laravel)**:
```php
'material_id' => 'required|integer|exists:materials,id' // Debe existir
```

---

### 11. **condition** (Condición)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== '' && val > 0
```

**Validación Backend Esperada (Laravel)**:
```php
'condition' => 'required|integer|in:1,2,3' // 1=Nuevo, 2=Usado, 3=Reacondicionado
```

---

### 12. **conditionDetail** (Detalle de Condición)
**Validación Frontend**:
```javascript
validator: (val) => val !== null && val !== undefined && val !== ''
```

**Validación Backend Esperada (Laravel)**:
```php
'condition_detail' => 'required|string'
```

---

### 13. **description** (Descripción Completa)
**Validación Frontend**:
```javascript
validator: (val) => val && val.length >= 20
```

**Validación Backend Esperada (Laravel)**:
```php
'description' => 'required|string|min:20|max:400' // Frontend: max 400
```

---

### 14. **shortDescription** (Descripción Corta)
**Validación Frontend**:
```javascript
validator: (val) => val && val.length >= 10
```

**Validación Backend Esperada (Laravel)**:
```php
'short_description' => 'required|string|min:10|max:140' // Frontend: max 140
```

---

## 📋 Campos Opcionales (Logística)

Estos campos NO son requeridos pero si se envían, deben validarse:

### Dimensiones (Opcionales)
```php
'height' => 'nullable|numeric|min:0',
'width' => 'nullable|numeric|min:0',
'large' => 'nullable|numeric|min:0',
'depth' => 'nullable|numeric|min:0',
'measure_unit' => 'nullable|string|in:cm,m,mm,inch',
```

### Peso (Opcional)
```php
'weight' => 'nullable|numeric|min:0',
'weight_unit' => 'nullable|string|in:kg,g,lb,oz',
```

### Información de Envío (Opcional)
```php
'logistic_class' => 'nullable|string|in:standard,fragile,hazardous,perishable,oversized',
'shipping_cost' => 'nullable|numeric|min:0',
'shipping_way' => 'nullable|string|in:ground,air,maritime,express',
'retreat_in_person' => 'nullable|boolean',
```

### Garantía (Opcional)
```php
'warranty_type' => 'nullable|string|in:manufacturer,seller,extended',
'warranty_time' => 'nullable|integer|min:0',
'warranty_time_unit' => 'nullable|string|in:days,months,years',
```

---

## 🎨 Campos Opcionales (Características)

Todos estos campos son opcionales:

```php
// Información Básica
'age_range' => 'nullable|string',
'age_group' => 'nullable|string',
'capacity' => 'nullable|string',
'number_of_pieces' => 'nullable|integer|min:0',
'production_country' => 'nullable|string',
'type' => 'nullable|string',

// Características de Seguridad
'sounds' => 'nullable|boolean',
'uses_batteries' => 'nullable|boolean',
'lights' => 'nullable|boolean',
'small_pieces' => 'nullable|boolean',
'hipoalergenic' => 'nullable|boolean',
'soft_materials' => 'nullable|boolean',
'padded' => 'nullable|boolean',
'adjustable_height' => 'nullable|boolean',
'bpa_free' => 'nullable|boolean',

// Características de Cocina/Comedor
'microwave_safe' => 'nullable|boolean',
'dishwasher_safe' => 'nullable|boolean',

// Características de Diseño
'shape' => 'nullable|string',
'decoration_style' => 'nullable|string',
'type_of_household' => 'nullable|string',
'decoration_type' => 'nullable|string',
'wine_glass_type' => 'nullable|string',

// Información Adicional
'units' => 'nullable|string',
'max_weight_supported' => 'nullable|string',
'characteres' => 'nullable|string',
'features' => 'nullable|string',
```

---

## 📸 Imágenes (Opcional pero Recomendado)

```php
'main_image_path' => 'nullable|string', // Recomendado pero no requerido
'images.*' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
```

---

## ✅ Campos que NO Requieren Validación

Estos campos se pueden omitir en validación o ser `nullable`:

```php
'model' => 'nullable|string',
'bar_code' => 'nullable|string',
'provisional_bar_code' => 'nullable|string',
'coin_type' => 'nullable|string|in:$,USD,EUR',
'iva' => 'nullable|boolean',
'is_active' => 'nullable|boolean', // Se valida al publicar
'url_youtube' => 'nullable|url',
```

---

## 🔄 Validación de Relaciones (Foreign Keys)

Todos los campos que referencian otras tablas deben usar `exists`:

```php
'category_id' => 'required|integer|exists:categories,id',
'brand_id' => 'required|integer|exists:brands,id',
'color_id' => 'required|integer|exists:colors,id',
'serie_id' => 'required|integer|exists:series,id',
'material_id' => 'required|integer|exists:materials,id',
```

---

## 📝 Plantilla de Validación Laravel (FormRequest)

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // Requeridos
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric|min:0.01',
            'stock' => 'required|integer|min:1',
            'critical_stock' => 'required|integer|min:0',
            'category_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'required|integer|exists:brands,id',
            'color_id' => 'required|integer|exists:colors,id',
            'serie_id' => 'required|integer|exists:series,id',
            'material_id' => 'required|integer|exists:materials,id',
            'condition' => 'required|integer|in:1,2,3',
            'condition_detail' => 'required|string|max:255',
            'description' => 'required|string|min:20|max:400',
            'short_description' => 'required|string|min:10|max:140',
            
            // Opcionales
            'model' => 'nullable|string|max:255',
            'bar_code' => 'nullable|string|max:255',
            'coin_type' => 'nullable|string|in:$,USD,EUR',
            'iva' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'url_youtube' => 'nullable|url',
            
            // Logística
            'height' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'large' => 'nullable|numeric|min:0',
            'depth' => 'nullable|numeric|min:0',
            'measure_unit' => 'nullable|string|in:cm,m,mm,inch',
            'weight' => 'nullable|numeric|min:0',
            'weight_unit' => 'nullable|string|in:kg,g,lb,oz',
            'logistic_class' => 'nullable|string|in:standard,fragile,hazardous,perishable,oversized',
            'shipping_cost' => 'nullable|numeric|min:0',
            'shipping_way' => 'nullable|string|in:ground,air,maritime,express',
            'retreat_in_person' => 'nullable|boolean',
            'warranty_type' => 'nullable|string|in:manufacturer,seller,extended',
            'warranty_time' => 'nullable|integer|min:0',
            'warranty_time_unit' => 'nullable|string|in:days,months,years',
            
            // Características (todas opcionales)
            'age_range' => 'nullable|string|max:255',
            'age_group' => 'nullable|string|max:255',
            'capacity' => 'nullable|string|max:255',
            'number_of_pieces' => 'nullable|integer|min:0',
            'production_country' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'sounds' => 'nullable|boolean',
            'uses_batteries' => 'nullable|boolean',
            'lights' => 'nullable|boolean',
            'small_pieces' => 'nullable|boolean',
            'hipoalergenic' => 'nullable|boolean',
            'soft_materials' => 'nullable|boolean',
            'padded' => 'nullable|boolean',
            'adjustable_height' => 'nullable|boolean',
            'bpa_free' => 'nullable|boolean',
            'microwave_safe' => 'nullable|boolean',
            'dishwasher_safe' => 'nullable|boolean',
            'shape' => 'nullable|string|max:255',
            'decoration_style' => 'nullable|string|max:255',
            'type_of_household' => 'nullable|string|max:255',
            'decoration_type' => 'nullable|string|max:255',
            'wine_glass_type' => 'nullable|string|max:255',
            'units' => 'nullable|string|max:255',
            'max_weight_supported' => 'nullable|string|max:255',
            'characteres' => 'nullable|string',
            'features' => 'nullable|string',
            
            // Imágenes
            'main_image_path' => 'nullable|string',
            'images.*' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:5120',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio',
            'price.required' => 'El precio es obligatorio',
            'price.min' => 'El precio debe ser mayor a 0',
            'stock.required' => 'El stock es obligatorio',
            'stock.min' => 'El stock debe ser al menos 1',
            'category_id.required' => 'Debes seleccionar una categoría',
            'description.min' => 'La descripción debe tener mínimo 20 caracteres',
            'short_description.min' => 'La descripción corta debe tener mínimo 10 caracteres',
            // ... más mensajes
        ];
    }
}
```

---

## 🧪 Testing

### Casos a Probar en Backend

**Caso 1: Crear producto con todos los requeridos**
- ✅ Debe ser aceptado

**Caso 2: Crear producto sin campo requerido (ej. price)**
- ❌ Debe rechazar con error 422

**Caso 3: Precio = 0**
- ❌ Debe rechazar (min:0.01)

**Caso 4: Stock = 0**
- ❌ Debe rechazar (min:1)

**Caso 5: Descripción < 20 caracteres**
- ❌ Debe rechazar

**Caso 6: Descripción > 400 caracteres**
- ❌ Debe rechazar

**Caso 7: CategoryId no existe**
- ❌ Debe rechazar (exists validation)

**Caso 8: Todos opcionales**
- ✅ Debe ser aceptado si todos los requeridos están presentes

---

## 📊 Resumen

| Campo | Requerido | Tipo | Min | Max |
|-------|-----------|------|-----|-----|
| name | ✅ | string | - | 255 |
| sku | ✅ | string | - | - |
| price | ✅ | numeric | 0.01 | - |
| stock | ✅ | integer | 1 | - |
| critical_stock | ✅ | integer | 0 | - |
| category_id | ✅ | integer | 1 | - |
| brand_id | ✅ | integer | 1 | - |
| color_id | ✅ | integer | 1 | - |
| serie_id | ✅ | integer | 1 | - |
| material_id | ✅ | integer | 1 | - |
| condition | ✅ | integer (1-3) | 1 | 3 |
| condition_detail | ✅ | string | - | 255 |
| description | ✅ | string | 20 | 400 |
| short_description | ✅ | string | 10 | 140 |

---

## ✨ Conclusión

El backend DEBE tener las mismas validaciones para garantizar:
1. Integridad de datos
2. Consistencia entre frontend y backend
3. Seguridad (no confiar solo en validación del cliente)
4. Mensajes de error coherentes
