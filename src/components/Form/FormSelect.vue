<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => [], // { value: string|number, label: string }
  },
  error: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const hasError = computed(() => !!props.error);
</script>

<template>
  <div class="mb-4 w-full">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
      <span v-if="required" class="text-red-600 dark:text-red-400">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      :required="required"
      :class="[
        'block w-full p-2.5 rounded-lg sm:text-sm transition-colors focus:ring-2 focus:outline-none',
        hasError
          ? 'bg-red-50 border border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:border-red-500'
          : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''
      ]"
    >
      <slot>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </slot>
    </select>
    <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
  </div>
</template>
