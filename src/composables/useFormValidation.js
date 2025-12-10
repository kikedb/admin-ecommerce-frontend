import { ref, computed } from 'vue'

export function useFormValidation() {
  const errors = ref({})
  const touched = ref({})

  const fieldRules = {
    name: [
      { validate: (v) => !!v, message: 'El nombre es requerido' },
      { validate: (v) => !v || v.length >= 3, message: 'Mínimo 3 caracteres' },
      { validate: (v) => !v || v.length <= 255, message: 'Máximo 255 caracteres' }
    ],
    sku: [
      { validate: (v) => !!v, message: 'El SKU es requerido' },
      { validate: (v) => !v || v.length >= 3, message: 'Mínimo 3 caracteres' }
    ],
    price: [
      { validate: (v) => v !== null && v !== undefined && v !== '', message: 'El precio es requerido' },
      { validate: (v) => !v || v > 0, message: 'El precio debe ser mayor a 0' }
    ],
    stock: [
      { validate: (v) => v !== null && v !== undefined && v !== '', message: 'El stock es requerido' },
      { validate: (v) => !v || v >= 0, message: 'El stock no puede ser negativo' }
    ],
    criticalStock: [
      { validate: (v) => v !== null && v !== undefined && v !== '', message: 'El stock crítico es requerido' },
      { validate: (v) => !v || v >= 0, message: 'El stock crítico no puede ser negativo' }
    ],
    categoryId: [
      { validate: (v) => !!v && v > 0, message: 'Debe seleccionar una categoría' }
    ],
    brandId: [
      { validate: (v) => !!v && v > 0, message: 'Debe seleccionar una marca' }
    ],
    colorId: [
      { validate: (v) => !!v && v > 0, message: 'Debe seleccionar un color' }
    ],
    serieId: [
      { validate: (v) => !!v && v > 0, message: 'Debe seleccionar una serie' }
    ],
    materialId: [
      { validate: (v) => !!v && v > 0, message: 'Debe seleccionar un material' }
    ],
    condition: [
      { validate: (v) => !!v && v > 0, message: 'Debe seleccionar una condición' }
    ],
    conditionDetail: [
      { validate: (v) => !!v, message: 'El detalle de condición es requerido' }
    ],
    description: [
      { validate: (v) => !!v, message: 'La descripción es requerida' },
      { validate: (v) => !v || v.length >= 20, message: 'Mínimo 20 caracteres' }
    ],
    shortDescription: [
      { validate: (v) => !!v, message: 'La descripción corta es requerida' },
      { validate: (v) => !v || v.length >= 10, message: 'Mínimo 10 caracteres' }
    ],
    urlYoutube: [
      { validate: (v) => !v || /^(https?:\/\/)?(www\.)?youtube\.com/.test(v), message: 'URL de YouTube inválida' }
    ],
    height: [
      { validate: (v) => !v || v >= 0, message: 'Debe ser un número positivo' }
    ],
    width: [
      { validate: (v) => !v || v >= 0, message: 'Debe ser un número positivo' }
    ],
    large: [
      { validate: (v) => !v || v >= 0, message: 'Debe ser un número positivo' }
    ],
    depth: [
      { validate: (v) => !v || v >= 0, message: 'Debe ser un número positivo' }
    ],
    weight: [
      { validate: (v) => !v || v >= 0, message: 'Debe ser un número positivo' }
    ],
    shippingCost: [
      { validate: (v) => !v || v >= 0, message: 'Debe ser un número positivo' }
    ]
  }

  function validateField(fieldName, value) {
    const rules = fieldRules[fieldName] || []
    const fieldErrors = []

    for (const rule of rules) {
      if (!rule.validate(value)) {
        fieldErrors.push(rule.message)
      }
    }

    if (fieldErrors.length > 0) {
      errors.value[fieldName] = fieldErrors
      return false
    } else {
      delete errors.value[fieldName]
      return true
    }
  }

  function markFieldAsTouched(fieldName) {
    touched.value[fieldName] = true
  }

  function clearFieldError(fieldName) {
    delete errors.value[fieldName]
  }

  function clearAllErrors() {
    errors.value = {}
  }

  function resetTouched() {
    touched.value = {}
  }

  function validateForm(formData) {
    clearAllErrors()
    let isValid = true

    for (const [fieldName, value] of Object.entries(formData)) {
      if (!validateField(fieldName, value)) {
        isValid = false
      }
    }

    return isValid
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  return {
    errors: computed(() => errors.value),
    touched: computed(() => touched.value),
    hasErrors,
    validateField,
    validateForm,
    markFieldAsTouched,
    clearFieldError,
    clearAllErrors,
    resetTouched,
    getFieldError: (fieldName) => errors.value[fieldName]?.[0] || ''
  }
}
