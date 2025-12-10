<template>
  <div class="mb-6">
    <!-- Encabezado -->
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Campos Requeridos para Publicar</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Completa todos los campos marcados para publicar tu producto</p>
      </div>
    </div>
  </div>
</template>
<script setup>
defineEmits(['focus-field'])
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
