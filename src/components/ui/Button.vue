<script setup>
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost', 'outline'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
});

const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variantClasses = computed(() => {
  const map = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
  };
  return map[props.variant];
});

const sizeClasses = computed(() => {
  const map = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };
  return map[props.size];
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      baseClasses,
      variantClasses,
      sizeClasses,
      block ? 'w-full' : ''
    ]"
  >
    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
    <slot />
  </button>
</template>
