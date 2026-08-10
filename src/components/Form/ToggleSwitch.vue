<script setup>
import { Switch } from '@headlessui/vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <Switch.Group as="div" class="flex items-center justify-between">
    <span class="flex flex-col">
      <Switch.Label as="span" class="text-sm font-medium text-gray-900 dark:text-white" passive>
        {{ label }}
      </Switch.Label>
      <Switch.Description v-if="description" as="span" class="text-sm text-gray-500 dark:text-gray-400">
        {{ description }}
      </Switch.Description>
    </span>
    <Switch
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :class="[
        modelValue ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      :disabled="disabled"
    >
      <span aria-hidden="true" :class="[
        modelValue ? 'translate-x-5' : 'translate-x-0',
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
      ]" />
    </Switch>
  </Switch.Group>
</template>
