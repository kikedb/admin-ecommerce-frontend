<script setup>
import { computed } from 'vue';
import FormInput from '@/components/Form/FormInput.vue';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null,
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '0',
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
  currency: {
    type: String,
    default: 'CLP',
  }
});

const emit = defineEmits(['update:modelValue']);

const displayValue = computed({
  get() {
    if (props.modelValue === null || props.modelValue === '') return '';
    
    // Formatting logic (e.g. 1000 -> 1.000 for CLP)
    return new Intl.NumberFormat('es-CL').format(Number(props.modelValue));
  },
  set(newValue) {
    // Strip everything except numbers
    const numericString = newValue.replace(/\D/g, '');
    const numericValue = numericString ? parseInt(numericString, 10) : null;
    emit('update:modelValue', numericValue);
  }
});
</script>

<template>
  <FormInput
    :id="id"
    :label="label"
    v-model="displayValue"
    type="text"
    :placeholder="placeholder"
    :error="error"
    :required="required"
    :disabled="disabled"
  >
    <template #icon>
      <span class="text-sm font-medium">{{ currency === 'CLP' || currency === 'USD' ? '$' : currency }}</span>
    </template>
    <template #help v-if="$slots.help">
      <slot name="help" />
    </template>
  </FormInput>
</template>
