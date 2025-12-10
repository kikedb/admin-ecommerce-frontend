<template>
  <section class="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
    <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="ml-2">Cargando productos...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="products.length === 0" class="text-center py-12 text-gray-400">
        No hay productos disponibles
      </div>

      <!-- Products grid -->
      <template v-else>
        <div class="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          <div v-for="product in products" :key="product.id" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <!-- Product Image -->
            <div class="h-56 w-full">
              <a href="#">
                <img
                  v-if="product.main_image_path"
                  :src="product.main_image_path"
                  :alt="product.name"
                  class="mx-auto h-full object-cover dark:hidden"
                />
                <img
                  v-if="product.main_image_path"
                  :src="product.main_image_path"
                  :alt="product.name"
                  class="mx-auto hidden h-full object-cover dark:block"
                />
                <div v-else class="h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </a>
            </div>

            <!-- Card Content -->
            <div class="pt-6">
              <!-- Top section: Badge and action buttons -->
              <div class="mb-4 flex items-center justify-between gap-4">
                <span class="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  {{ product.sku }}
                </span>

                <div class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    @click="$emit('edit', product.id)"
                  >
                    <span class="sr-only">Editar</span>
                    <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 17.012a1 1 0 0 1-1-1v-8a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1zM17 5.768a1 1 0 0 1-1-1V2a1 1 0 0 1 2 0v2.768a1 1 0 0 1-1 1zM5.422 8.565a1 1 0 0 1-.939-1.439L5.639 4.1A1 1 0 0 1 7.364 4.9l-1.156 2.026a1 1 0 0 1-.786.639zM19.063 13.1l1.156 2.026a1 1 0 1 1-1.725 1.438l-1.156-2.026a1 1 0 1 1 1.725-1.438z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    @click="$emit('delete', product.id)"
                  >
                    <span class="sr-only">Eliminar</span>
                    <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v2h2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8h2V6a2 2 0 0 0-2-2h-5V3a1 1 0 0 0-1-1H10Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Product Name -->
              <a href="#" class="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
                {{ product.name }}
              </a>

              <!-- Category and Brand -->
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {{ product.category?.name || 'N/A' }} / {{ product.brand?.name || 'N/A' }}
              </p>

              <!-- Stock Info -->
              <ul class="mt-2 flex items-center gap-4">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                  </svg>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Stock: {{ product.stock || 0 }}</p>
                </li>
              </ul>

              <!-- Status Badge -->
              <div v-if="product.critical_stock" class="mt-2">
                <span :class="getStatusBadge(product.status || 'draft')" class="px-2.5 py-0.5 text-xs font-medium rounded">
                  {{ product.status || 'draft' }}
                </span>
              </div>

              <!-- Price and View Button -->
              <div class="mt-4 flex items-center justify-between gap-4">
                <p class="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">${{ product.price || 0 }}</p>

                <!-- View Product Button (Admin) -->
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  @click="$emit('edit', product.id)"
                >
                  <svg class="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                    <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Ver
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination - Show more button -->
        <div class="w-full text-center">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            @click="$emit('next-page')"
            :disabled="currentPage >= totalPages"
          >
            Mostrar más
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  isLoading: Boolean,
  currentPage: Number,
  itemsPerPage: Number,
  totalPages: Number
})

const emit = defineEmits(['edit', 'delete', 'prev-page', 'next-page', 'go-to-page'])

const getStatusBadge = (status) => {
  const statuses = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'inactive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
  return statuses[status] || statuses.draft
}
</script>
