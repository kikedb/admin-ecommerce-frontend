# Requisitos para Publicar un Producto (is_active = true)

## 📋 Análisis de Campos Obligatorios

Para que un producto sea publicado en la website (is_active = true), debe cumplir con los siguientes requisitos basados en lo que los clientes necesitan ver:

---

## TAB 1: GENERAL (Información Básica)

### ✅ CAMPOS OBLIGATORIOS

#### Sección: Información Básica
- **Nombre del Producto** - REQUERIDO
  - Los clientes necesitan saber qué están comprando
  - Debe ser descriptivo y comprensible
  
- **SKU** - REQUERIDO (generado automáticamente)
  - Identificador único del producto
  - Se genera con: category_code + serie_code + material_code + color_code + 0 + id

#### Sección: Precios e Inventario
- **Precio** - REQUERIDO
  - Información esencial para la compra
  - Mínimo debe ser mayor a 0
  
- **Stock** - REQUERIDO (mínimo 1)
  - No tiene sentido publicar un producto sin stock
  - Debe tener al menos 1 unidad disponible

- **Stock Crítico** - REQUERIDO
  - Para notificar al administrador cuando el stock está bajo
  - Generalmente es 10-20% del stock total

#### Sección: Clasificación
- **Categoría** - REQUERIDO
  - Necesaria para la navegación en la website
  - Ayuda a los clientes a encontrar el producto
  
- **Marca** - REQUERIDO
  - Información importante para los clientes
  - Ayuda en búsquedas y filtros

- **Color** - REQUERIDO
  - Atributo clave de identificación
  - Influye en la elección del cliente

- **Serie** - REQUERIDO
  - Clasifica el producto dentro de su tipo
  - Necesaria para la generación del SKU

- **Material** - REQUERIDO
  - Información crítica para el cliente
  - Afecta precio, durabilidad y uso

#### Sección: Condición
- **Condición** - REQUERIDO
  - Clarifica el estado del producto (Nuevo/Usado/Reacondicionado)
  - Afecta la confianza del cliente

- **Detalle de Condición** - REQUERIDO
  - Proporciona contexto sobre la condición
  - Especialmente importante para productos usados

#### Sección: Descripciones
- **Descripción Completa** - REQUERIDO (máx 400 caracteres)
  - Descripción generada por Sofia AI
  - Texto persuasivo para captar clientes
  - Mínimo debe tener contenido

- **Descripción Corta** - REQUERIDO (máx 140 caracteres)
  - Descripción generada por Sofia AI
  - Vista previa en listados
  - Mínimo debe tener contenido

#### Sección: Estado
- **Producto Activo** - REQUERIDO
  - Checkbox is_active debe estar marcado
  - Sin esto, el producto NO se publica

### ⚠️ CAMPOS OPCIONALES
- Modelo - Contexto adicional
- Código de Barras - Para gestión interna

---

## TAB 2: LOGÍSTICA

### ⚠️ CAMPOS OPCIONALES
Toda esta pestaña es **INFORMACIONAL** pero no es obligatoria para publicar.

- Dimensiones (Alto, Ancho, Largo, Profundidad) - Opcional
- Peso - Opcional
- Información de Envío - Opcional
- Garantía - Opcional

*Razón: La publicación no depende de esta información, pero afecta la experiencia del cliente en el checkout y envíos*

---

## TAB 3: CARACTERÍSTICAS (Features)

### ⚠️ CAMPOS OPCIONALES
Toda esta pestaña es **COMPLEMENTARIA** pero no es obligatoria para publicar.

- Características de Seguridad y Funcionales - Checkboxes opcionales
- Características de Cocina/Comedor - Checkboxes opcionales
- Características de Diseño - Campos opcionales
- Información Adicional - Campos opcionales

*Razón: Enriquecen la información del producto pero no son necesarias para la venta básica*

---

## TAB 4: IMÁGENES

### 🎨 RECOMENDADO (NO ESTRICTAMENTE OBLIGATORIO)
- **Imagen Principal** - ALTAMENTE RECOMENDADO
  - Los clientes necesitan ver el producto
  - Afecta significativamente la decisión de compra
  - Sin imagen, el producto se ve incompleto
  - **Debería ser REQUERIDO** para buena experiencia

- **Galería de Imágenes** - RECOMENDADO
  - Múltiples ángulos aumentan confianza
  - Opcional pero aumenta conversión

---

## 📊 RESUMEN VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│                    PARA PUBLICAR (is_active = true)          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ✅ OBLIGATORIOS (TAB 1: GENERAL)                             │
│  • Nombre del Producto                                       │
│  • SKU (auto-generado)                                       │
│  • Precio > 0                                                │
│  • Stock >= 1                                                │
│  • Stock Crítico                                             │
│  • Categoría                                                 │
│  • Marca                                                     │
│  • Color                                                     │
│  • Serie                                                     │
│  • Material                                                  │
│  • Condición                                                 │
│  • Detalle de Condición                                      │
│  • Descripción Completa (con contenido)                      │
│  • Descripción Corta (con contenido)                         │
│  • is_active = true ✓                                        │
│                                                               │
│ 🎨 RECOMENDADO (TAB 4: IMÁGENES)                             │
│  • Imagen Principal                                          │
│  • Galería de imágenes (múltiples)                           │
│                                                               │
│ ⚠️  OPCIONALES (TAB 2 & 3)                                   │
│  • Logística, Características y Features                     │
│  (Mejorar información pero no son requeridos)               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTACIÓN RECOMENDADA

### Validación Frontend
```javascript
// Antes de permitir is_active = true, validar:
- store.name.trim().length > 0
- store.sku.trim().length > 0 (auto-generado)
- store.price > 0
- store.stock >= 1
- store.criticalStock > 0
- store.categoryId != null
- store.brandId != null
- store.colorId != null
- store.serieId != null
- store.materialId != null
- store.condition != null
- store.conditionDetail.trim().length > 0
- store.description.trim().length > 0 (> 20 caracteres)
- store.shortDescription.trim().length > 0 (> 10 caracteres)
- store.mainImagePath != null (RECOMENDADO)
```

### Validación Backend (ProductStoreRequest)
```php
'name' => 'required|string|max:255',
'sku' => 'required|unique:products,sku',
'price' => 'required|numeric|min:0.01',
'stock' => 'required|integer|min:1', // Si is_active = true
'critical_stock' => 'required|integer|min:0',
'category_id' => 'required|exists:categories,id',
'brand_id' => 'required|exists:brands,id',
'color_id' => 'required|exists:colors,id',
'serie_id' => 'required|exists:series,id',
'material_id' => 'required|exists:materials,id',
'condition' => 'required|integer',
'condition_detail' => 'required|string',
'description' => 'required|string|min:20',
'short_description' => 'required|string|min:10',
'is_active' => 'required|boolean',
```

---

## 💡 NOTAS IMPORTANTES

1. **Información Crítica**: Los 4 campos de clasificación (Categoría, Marca, Color, Serie) son los que se usan para **generar el SKU automáticamente**

2. **Descripciones Generadas por IA**: Deben ser generadas por Sofia AI considerando todos los campos seleccionados. Solo con descripción propia, es opcional, pero recomendado usar IA

3. **Imágenes**: Aunque no está strictamente validado, **debería ser obligatorio tener al menos la imagen principal** para evitar productos sin visualización

4. **Publicación Responsable**: El checkbox `is_active` debe incluir una validación que revise todos los campos antes de permitir activar

---

## ✨ MEJORA SUGERIDA

Agregar un botón "Verificar Requisitos de Publicación" que:
1. Valide todos los campos obligatorios
2. Muestre un checklist con lo que falta
3. Permita activar is_active solo cuando todo esté completo
