<script setup>
import { onMounted, ref } from 'vue'
import { useProducts } from '@/composables/useProducts'
import productsService from '@/services/products.service'
import ProductsTable from '@/components/Products/ProductsTable.vue'
import ProductsCards from '@/components/Products/ProductsCards.vue'
import ProductFormModal from '@/components/Products/ProductFormModal.vue'
import ConfirmDeleteModal from '@/components/Products/ConfirmDeleteModal.vue'

const {
  products,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startItem,
  endItem,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts
} = useProducts()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const priceRange = ref('')
const viewMode = ref('table') // 'table' o 'cards'

// Modal states
const deleteModalOpen = ref(false)
const deleteLoading = ref(false)
const editingProduct = ref(null)
const selectedProductForDelete = ref(null)
const deleteIsBulk = ref(false)
const selectedProductIds = ref([])

onMounted(async () => {
  // Cargar productos iniciales
  await fetchProducts(1)
})

const handleSearch = async () => {
  const filters = {
    search: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    brand: selectedBrand.value || undefined
  }
  await fetchProducts(1, filters)
}

const handleClearFilters = async () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedBrand.value = ''
  priceRange.value = ''
  await fetchProducts(1)
}

const productFormModalRef = ref(null)

const handleEdit = async (productId) => {
  try {
    // Obtener el producto completo con todas sus relaciones
    const response = await productsService.getProductById(productId)
    editingProduct.value = response.data.data || response.data
    // Abrir modal
    productFormModalRef.value?.openModal()
  } catch (err) {
    console.error('Error al cargar producto:', err)
  }
}

const handleDelete = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    selectedProductForDelete.value = product
    deleteIsBulk.value = false
    hasAssociatedSales.value = false // Por defecto asumimos que es soft delete
    deleteModalOpen.value = true
  }
}

const handleCreateNew = () => {
  editingProduct.value = null
  productFormModalRef.value?.openModal()
}

const handleFormClose = () => {
  formModalOpen.value = false
  editingProduct.value = null
}

const handleFormSaved = async () => {
  await fetchProducts(currentPage.value)
}

const handleDeleteConfirm = async () => {
  deleteLoading.value = true
  try {
    if (deleteIsBulk.value && selectedProductIds.value.length > 0) {
      // Bulk delete
      await deleteProducts(selectedProductIds.value)
    } else if (selectedProductForDelete.value) {
      // Intentar soft delete (si tiene ventas, el composable hará fallback a disable)
      await deleteProduct(selectedProductForDelete.value.id)
    }
    deleteModalOpen.value = false
    selectedProductForDelete.value = null
    selectedProductIds.value = []
    deleteIsBulk.value = false
  } catch (err) {
    console.error('Error deleting product:', err)
  } finally {
    deleteLoading.value = false
  }
}

const handleDeleteClose = () => {
  deleteModalOpen.value = false
  selectedProductForDelete.value = null
  selectedProductIds.value = []
  deleteIsBulk.value = false
}

const handleNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    await fetchProducts(currentPage.value + 1)
  }
}

const handlePrevPage = async () => {
  if (currentPage.value > 1) {
    await fetchProducts(currentPage.value - 1)
  }
}

const handleGoToPage = async (page) => {
  await fetchProducts(page)
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Gestión de productos, categorías, marcas y colores</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <!-- Filtros y Vista Toggle -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
        <!-- View Toggle -->
        <div class="flex items-center gap-2">
          <button
            @click="viewMode = 'table'"
            :class="{
              'bg-blue-600 text-white': viewMode === 'table',
              'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300': viewMode !== 'table'
            }"
            class="px-3 py-2 rounded-lg transition flex items-center gap-2"
            title="Vista de tabla"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </button>
          <button
            @click="viewMode = 'cards'"
            :class="{
              'bg-blue-600 text-white': viewMode === 'cards',
              'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300': viewMode !== 'cards'
            }"
            class="px-3 py-2 rounded-lg transition flex items-center gap-2"
            title="Vista de tarjetas"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4m0-21v21m0-21h10a2 2 0 012 2v14a2 2 0 01-2 2h-10m0-21v21m0 0H9"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Búsqueda -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar producto..."
          @keyup.enter="handleSearch"
          class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <!-- Categoría -->
        <select
          v-model="selectedCategory"
          class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todas las categorías</option>
          <option value="PC">PC</option>
          <option value="Phone">Phone</option>
          <option value="Tablet">Tablet</option>
          <option value="Gaming/Console">Gaming/Console</option>
        </select>
        <!-- Marca -->
        <select
          v-model="selectedBrand"
          class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todas las marcas</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="Microsoft">Microsoft</option>
          <option value="Sony">Sony</option>
        </select>
        <!-- Rango de precio -->
        <select
          v-model="priceRange"
          class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos los precios</option>
          <option value="1-100">$1 - $100</option>
          <option value="101-500">$101 - $500</option>
          <option value="501-1000">$501 - $1000</option>
          <option value="1001">$1001+</option>
        </select>
        <!-- Nuevo Producto -->
        <button @click="handleCreateNew" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
          + Nuevo Producto
        </button>
      </div>
    </div>

    <!-- Vista Tabla -->
    <template v-if="viewMode === 'table'">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ProductsTable
          :products="products"
          :is-loading="isLoading"
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          :start-item="startItem"
          :end-item="endItem"
          :total-items="totalItems"
          :total-pages="totalPages"
          @edit="handleEdit"
          @delete="handleDelete"
          @prev-page="handlePrevPage"
          @next-page="handleNextPage"
          @go-to-page="handleGoToPage"
        />
      </div>
    </template>

    <!-- Vista Cards -->
    <template v-else>
      <ProductsCards
        :products="products"
        :is-loading="isLoading"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        :total-pages="totalPages"
        @edit="handleEdit"
        @delete="handleDelete"
        @prev-page="handlePrevPage"
        @next-page="handleNextPage"
        @go-to-page="handleGoToPage"
      />
    </template>

    <ProductFormModal
      ref="productFormModalRef"
      :editing-product="editingProduct"
      @close="handleFormClose"
      @saved="handleFormSaved"
    />

    <ConfirmDeleteModal
      :is-open="deleteModalOpen"
      :is-loading="deleteLoading"
      :product-name="selectedProductForDelete?.name"
      :is-bulk="deleteIsBulk"
      @close="handleDeleteClose"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
