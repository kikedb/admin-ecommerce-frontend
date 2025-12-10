<template>
  <div class="flex items-center justify-between">
    <label :for="fieldId" class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
      {{ label }}
    </label>
    <span v-if="isRequired" :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-300',
      isComplete
        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
    ]">
      <svg v-if="isComplete" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      <span v-else class="w-1.5 h-1.5 rounded-full" :class="isComplete ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'"></span>
      {{ isComplete ? 'Completado' : 'Requerido' }}
    </span>
    <span v-else-if="isRecommended" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
      <span class="w-1.5 h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full"></span>
      Recomendado
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '@/stores/product'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  fieldId: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    required: false
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  }
})

const store = useProductStore()

const isComplete = computed(() => {
  if (!props.fieldName) return false
  
  const value = store[props.fieldName]
  
  // Validaciones por tipo de campo
  if (props.fieldName === 'description') {
    return value && value.length >= 20
  }
  if (props.fieldName === 'shortDescription') {
    return value && value.length >= 10
  }
  if (props.fieldName === 'price') {
    return value && value > 0
  }
  if (props.fieldName === 'stock') {
    return value !== null && value !== undefined && value >= 1
  }
  if (props.fieldName === 'criticalStock') {
    return value !== null && value !== undefined && value >= 0
  }
  if (['categoryId', 'brandId', 'colorId', 'serieId', 'materialId', 'condition'].includes(props.fieldName)) {
    return value !== null && value !== undefined && value !== '' && value > 0
  }
  
  return value !== null && value !== undefined && value !== ''
})
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
