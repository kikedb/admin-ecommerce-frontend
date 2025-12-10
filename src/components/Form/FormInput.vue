<template>
  <div class="space-y-1.5">
    <!-- Label con indicador de requerido -->
    <label 
      v-if="label" 
      :for="inputId"
      class="block text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 font-bold" title="Campo requerido">*</span>
    </label>

    <!-- Input container con estado visual -->
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
        :class="[
          'w-full px-4 py-2.5 rounded-lg transition duration-200',
          'border text-sm font-medium',
          'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          // Estados
          hasError
            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
            : isValid && modelValue
            ? 'border-green-500 dark:border-green-500 focus:ring-green-500 focus:border-green-500'
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500',
          disabled && 'opacity-50 cursor-not-allowed',
          'dark:focus:ring-offset-gray-800'
        ]"
      />

      <!-- Iconos de estado -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <!-- Icono de carga -->
        <svg 
          v-if="isLoading" 
          class="w-5 h-5 animate-spin text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        <!-- Icono de validez -->
        <svg 
          v-else-if="isValid && modelValue" 
          class="w-5 h-5 text-green-500"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>

        <!-- Icono de error -->
        <svg 
          v-else-if="hasError" 
          class="w-5 h-5 text-red-500"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Mensaje de error o ayuda -->
    <div class="min-h-5 flex items-start">
      <p 
        v-if="hasError && showError" 
        class="text-xs font-medium text-red-600 dark:text-red-400 flex items-start gap-1"
      >
        <svg class="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span>{{ error }}</span>
      </p>
      <p v-else-if="helperText" class="text-xs text-gray-500 dark:text-gray-400">
        {{ helperText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  isValid: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  showError: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const hasError = computed(() => !!props.error)
</script>
