<script setup>
defineProps({
  padding: {
    type: String,
    default: 'p-6', // standard padding
  },
});
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Optional Header Slot -->
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <slot name="header" />
    </div>
    
    <!-- Body -->
    <div :class="padding">
      <slot />
    </div>
    
    <!-- Optional Footer Slot -->
    <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>
