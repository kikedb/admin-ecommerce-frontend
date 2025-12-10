<script setup>
const props = defineProps({
  isOpen: Boolean,
  isLoading: Boolean,
  productName: String,
  isBulk: Boolean
})

const emit = defineEmits(['close', 'confirm'])

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const closeOnEscape = (e) => {
  if (e.key === 'Escape') handleClose()
}
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-40" @click="handleClose"></div>
  </Transition>

  <!-- Modal -->
  <Transition name="scale">
    <div
      v-if="isOpen"
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-6"
      @keydown="closeOnEscape"
      tabindex="0"
    >
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
        {{ isBulk ? 'Eliminar productos seleccionados' : 'Eliminar producto' }}
      </h3>

      <p v-if="!isBulk" class="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
        ¿Estás seguro de que deseas eliminar <span class="font-semibold">{{ productName }}</span>?
        <br />
        Si el producto está asociado a una venta, será deshabilitado en su lugar.
      </p>

      <p v-else class="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
        ¿Estás seguro de que deseas eliminar los productos seleccionados?
        <br />
        Los productos asociados a ventas serán deshabilitados en su lugar.
      </p>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          @click="handleClose"
          :disabled="isLoading"
          class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
        >
          Cancelar
        </button>
        <button
          @click="handleConfirm"
          :disabled="isLoading"
          class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          {{ isLoading ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}
</style>
