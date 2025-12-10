import { computed } from 'vue'

export function usePublicationRequirements() {
  const requiredFields = {
    name: { label: 'Nombre del Producto', tab: 'general' },
    sku: { label: 'SKU', tab: 'general' },
    price: { label: 'Precio', tab: 'general', minValue: 0.01 },
    stock: { label: 'Stock', tab: 'general', minValue: 1 },
    criticalStock: { label: 'Stock Crítico', tab: 'general' },
    categoryId: { label: 'Categoría', tab: 'general' },
    brandId: { label: 'Marca', tab: 'general' },
    colorId: { label: 'Color', tab: 'general' },
    serieId: { label: 'Serie', tab: 'general' },
    materialId: { label: 'Material', tab: 'general' },
    condition: { label: 'Condición', tab: 'general' },
    conditionDetail: { label: 'Detalle de Condición', tab: 'general' },
    description: { label: 'Descripción Completa', tab: 'general', minLength: 20 },
    shortDescription: { label: 'Descripción Corta', tab: 'general', minLength: 10 },
    mainImagePath: { label: 'Imagen Principal', tab: 'images', recommended: true }
  }

  const validateField = (fieldName, store) => {
    const field = requiredFields[fieldName]
    if (!field) return true

    const value = store[fieldName]

    // Validación para campos numéricos
    if (field.minValue !== undefined) {
      return typeof value === 'number' && value >= field.minValue
    }

    // Validación para campos con longitud mínima
    if (field.minLength !== undefined) {
      return typeof value === 'string' && value.trim().length >= field.minLength
    }

    // Validación para selects/IDs
    if (fieldName.includes('Id')) {
      return value !== null && value !== '' && value !== undefined
    }

    // Validación para strings
    if (typeof value === 'string') {
      return value.trim().length > 0
    }

    // Validación genérica
    return value !== null && value !== '' && value !== undefined
  }

  const getPublicationStatus = (store) => {
    const results = {
      completed: [],
      missing: [],
      recommended: []
    }

    Object.entries(requiredFields).forEach(([fieldName, field]) => {
      const isValid = validateField(fieldName, store)

      if (field.recommended) {
        if (isValid) {
          results.completed.push({ fieldName, ...field })
        } else {
          results.recommended.push({ fieldName, ...field })
        }
      } else {
        if (isValid) {
          results.completed.push({ fieldName, ...field })
        } else {
          results.missing.push({ fieldName, ...field })
        }
      }
    })

    return {
      ...results,
      canPublish: results.missing.length === 0,
      completionPercentage: Math.round(
        (results.completed.length / (Object.keys(requiredFields).length - results.recommended.length)) * 100
      )
    }
  }

  return {
    requiredFields,
    validateField,
    getPublicationStatus
  }
}
