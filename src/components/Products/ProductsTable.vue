<script setup>
import { ref } from 'vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  isLoading: Boolean,
  currentPage: Number,
  itemsPerPage: Number,
  startItem: Number,
  endItem: Number,
  totalItems: Number,
  totalPages: Number
})

const emit = defineEmits(['edit', 'delete', 'toggle-select', 'select-all', 'prev-page', 'next-page', 'go-to-page'])

const selectedRows = ref(new Set())

const toggleSelectRow = (id) => {
  if (selectedRows.value.has(id)) {
    selectedRows.value.delete(id)
  } else {
    selectedRows.value.add(id)
  }
  emit('toggle-select', id)
}

const toggleSelectAll = () => {
  if (selectedRows.value.size === props.products.length) {
    selectedRows.value.clear()
  } else {
    props.products.forEach(p => selectedRows.value.add(p.id))
  }
  emit('select-all', selectedRows.value)
}

const getStatusBadge = (status) => {
  const statuses = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'inactive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
  return statuses[status] || statuses.draft
}

const isRowSelected = (id) => selectedRows.value.has(id)

const getVisiblePages = () => {
  const maxPages = 4
  const pages = []
  
  if (props.totalPages <= maxPages) {
    // Si hay 4 o menos páginas, mostrar todas
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Mostrar 4 páginas centradas alrededor de la página actual
    let start = Math.max(1, props.currentPage - 1)
    let end = Math.min(props.totalPages, start + 3)
    
    // Ajustar si estamos al final
    if (end - start < 3) {
      start = Math.max(1, end - 3)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">SKU</th>
          <th scope="col" class="px-6 py-3">Producto</th>
          <th scope="col" class="px-6 py-3">Categoría</th>
          <th scope="col" class="px-6 py-3">Marca</th>
          <th scope="col" class="px-6 py-3">Precio</th>
          <th scope="col" class="px-6 py-3">Stock</th>
          <th scope="col" class="px-6 py-3">Stock Crítico</th>
          <th scope="col" class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="isLoading">
          <tr class="border-b dark:border-gray-700">
            <td colspan="7" class="px-6 py-4 text-center">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span class="ml-2">Cargando productos...</span>
              </div>
            </td>
          </tr>
        </template>
        <template v-else-if="products.length === 0">
          <tr class="border-b dark:border-gray-700">
            <td colspan="7" class="px-6 py-4 text-center text-gray-400">
              No hay productos disponibles
            </td>
          </tr>
        </template>
        <template v-else v-for="product in products" :key="product.id">
          <!-- Row principal -->
          <tr
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <td class="px-6 py-4">{{ product.sku }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <!-- Imagen -->
                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <img v-if="product.main_image_path" :src="product.main_image_path" :alt="product.name" class="w-10 h-10 object-cover rounded" />
                  <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <!-- Nombre -->
                <span class="font-medium text-gray-900 dark:text-white">{{ product.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">{{ product.category?.name || '-' }}</td>
            <td class="px-6 py-4">{{ product.brand?.name || '-' }}</td>
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${{ product.price || 0 }}</td>
            <td class="px-6 py-4">{{ product.stock || 0 }}</td>
            <td class="px-6 py-4">{{ product.critical_stock || 0 }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <button
                  @click="emit('edit', product.id)"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-800"
                  title="Editar"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="emit('delete', product.id)"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 dark:bg-red-900 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-800"
                  title="Eliminar"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!-- Paginación -->
  <div class="flex items-center justify-end p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
    <nav aria-label="Paginación">
      <ul class="flex -space-x-px text-sm">
        <li>
          <button
            @click="emit('prev-page')"
            :disabled="currentPage === 1"
            class="flex items-center justify-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 box-border border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-s-lg text-sm px-3 h-9 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
        </li>
        <li v-for="page in getVisiblePages()" :key="page">
          <button
            @click="emit('go-to-page', page)"
            :aria-current="page === currentPage ? 'page' : undefined"
            :class="{
              'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900': page === currentPage,
              'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600': page !== currentPage
            }"
            class="flex items-center justify-center box-border border border-gray-300 dark:border-gray-600 font-medium text-sm w-9 h-9 focus:outline-none"
          >
            {{ page }}
          </button>
        </li>
        <li>
          <button
            @click="emit('next-page')"
            :disabled="currentPage >= totalPages"
            class="flex items-center justify-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 box-border border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-e-lg text-sm px-3 h-9 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
