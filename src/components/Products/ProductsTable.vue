<script setup>
import { ref } from 'vue'
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-vue-next'
import DataTable from '@/components/ui/DataTable.vue'
import Button from '@/components/ui/Button.vue'

const formatCLP = (value) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value || 0)
}

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

const emit = defineEmits(['edit', 'delete', 'prev-page', 'next-page', 'go-to-page'])

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Producto' },
  { key: 'category', label: 'Categoría' },
  { key: 'brand', label: 'Marca' },
  { key: 'price', label: 'Precio' },
  { key: 'stock', label: 'Stock' },
  { key: 'critical_stock', label: 'Stock Crítico' }
]

const getVisiblePages = () => {
  const maxPages = 4
  const pages = []
  
  if (props.totalPages <= maxPages) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, props.currentPage - 1)
    let end = Math.min(props.totalPages, start + 3)
    
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
  <div class="flex flex-col">
    <DataTable :columns="columns" :data="products" :loading="isLoading" empty-message="No hay productos disponibles">
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden shrink-0">
            <img v-if="row.main_image_path" :src="row.main_image_path" :alt="row.name" class="w-full h-full object-cover" />
            <ImageIcon v-else class="w-5 h-5 text-gray-400" />
          </div>
          <span class="font-medium text-gray-900 dark:text-white">{{ row.name }}</span>
        </div>
      </template>

      <template #cell-category="{ row }">
        {{ row.category?.name || '-' }}
      </template>

      <template #cell-brand="{ row }">
        {{ row.brand?.name || '-' }}
      </template>

      <template #cell-price="{ row }">
        <span class="font-medium">{{ formatCLP(row.price) }}</span>
      </template>

      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" @click="emit('edit', row.id)" title="Editar">
            <Pencil class="w-4 h-4 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" />
          </Button>
          <Button variant="ghost" size="sm" @click="emit('delete', row.id)" title="Eliminar">
            <Trash2 class="w-4 h-4 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" />
          </Button>
        </div>
      </template>
    </DataTable>

    <!-- Paginación -->
    <div class="flex items-center justify-end p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-xl" v-if="totalPages > 1">
      <nav aria-label="Paginación">
        <ul class="flex -space-x-px text-sm">
          <li>
            <button
              @click="emit('prev-page')"
              :disabled="currentPage === 1"
              class="flex items-center justify-center px-3 h-9 font-medium text-gray-700 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Anterior
            </button>
          </li>
          <li v-for="page in getVisiblePages()" :key="page">
            <button
              @click="emit('go-to-page', page)"
              :class="[
                'flex items-center justify-center px-3 h-9 border font-medium transition',
                page === currentPage
                  ? 'text-primary-600 border-primary-300 bg-primary-50 hover:bg-primary-100 hover:text-primary-700 dark:border-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              ]"
            >
              {{ page }}
            </button>
          </li>
          <li>
            <button
              @click="emit('next-page')"
              :disabled="currentPage >= totalPages"
              class="flex items-center justify-center px-3 h-9 font-medium text-gray-700 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
