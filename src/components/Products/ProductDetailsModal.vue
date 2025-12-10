<script setup>
const props = defineProps({
  isOpen: Boolean,
  product: Object
})

const emit = defineEmits(['close'])
const handleClose = () => emit('close')
</script>

<template>
  <div v-if="isOpen && product">
    <div class="fixed inset-0 bg-black/50 z-40" @click="handleClose"></div>
    <div class="fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 z-50 overflow-y-auto shadow-xl">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Detalles del Producto</h2>
      </div>
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ product.name }}</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-semibold text-gray-500">CATEGORIA</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ product.category }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500">MARCA</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ product.brand }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500">PRECIO</p>
            <p class="text-sm text-gray-900 dark:text-white">${{ product.price }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500">STOCK</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ product.stock }}</p>
          </div>
        </div>
        <div v-if="product.description" class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Descripcion</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ product.description }}</p>
        </div>
      </div>
      <div class="p-6 border-t border-gray-200 dark:border-gray-700">
        <button @click="handleClose" class="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg">Cerrar</button>
      </div>
    </div>
  </div>
</template>