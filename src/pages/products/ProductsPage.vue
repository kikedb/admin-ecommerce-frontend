<script setup>
import { onMounted, ref } from 'vue'
import { Plus, List, Grid } from 'lucide-vue-next'
import { useProducts } from '@/composables/useProducts'
import productsService from '@/services/products.service'
import ProductsTable from '@/components/Products/ProductsTable.vue'
import ProductsCards from '@/components/Products/ProductsCards.vue'
import ProductFormModal from '@/components/Products/ProductFormModal.vue'
import ConfirmDeleteModal from '@/components/Products/ConfirmDeleteModal.vue'

import PageHeader from '@/components/Layout/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import FormInput from '@/components/Form/FormInput.vue'
import FormSelect from '@/components/Form/FormSelect.vue'

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
  await fetchProducts(1)
})

const handleSearch = async () => {
  const filters = {
    search: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    brand: selectedBrand.value || undefined,
    price_range: priceRange.value || undefined
  }
  await fetchProducts(1, filters)
}

const productFormModalRef = ref(null)

const handleEdit = async (productId) => {
  try {
    const response = await productsService.getProductById(productId)
    editingProduct.value = response.data.data || response.data
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
    deleteModalOpen.value = true
  }
}

const handleCreateNew = () => {
  editingProduct.value = null
  productFormModalRef.value?.openModal()
}

const handleFormClose = () => {
  editingProduct.value = null
}

const handleFormSaved = async () => {
  await fetchProducts(currentPage.value)
}

const handleDeleteConfirm = async () => {
  deleteLoading.value = true
  try {
    if (deleteIsBulk.value && selectedProductIds.value.length > 0) {
      await deleteProducts(selectedProductIds.value)
    } else if (selectedProductForDelete.value) {
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

const categoryOptions = [
  { value: 'Muebles Infantiles', label: 'Muebles Infantiles' },
  { value: 'Decoración', label: 'Decoración' },
  { value: 'Juguetes', label: 'Juguetes' },
  { value: 'Ropa Cama', label: 'Ropa de Cama' }
]

const brandOptions = [
  { value: 'DecoKids', label: 'DecoKids' },
  { value: 'Peques', label: 'Peques' },
  { value: 'MiniHome', label: 'MiniHome' },
  { value: 'KidsPlay', label: 'KidsPlay' }
]

const priceOptions = [
  { value: '1-20000', label: '$1 - $20.000' },
  { value: '20001-50000', label: '$20.001 - $50.000' },
  { value: '50001-150000', label: '$50.001 - $150.000' },
  { value: '150001', label: '$150.001+' }
]
</script>

<template>
  <div>
    <!-- Header -->
    <PageHeader title="Catálogo de Productos">
      <template #description>Gestión de inventario, precios y detalles de productos</template>
      <template #actions>
        <Button variant="primary" @click="handleCreateNew" class="gap-2">
          <Plus class="w-4 h-4" /> Nuevo Producto
        </Button>
      </template>
    </PageHeader>

    <!-- Error message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
      <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <!-- Filtros y Vista Toggle -->
    <Card class="p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-medium text-gray-900 dark:text-white">Filtros de búsqueda</h3>
        <!-- View Toggle -->
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            @click="viewMode = 'table'"
            :class="['p-1.5 rounded-md transition-colors', viewMode === 'table' ? 'bg-white text-primary-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white']"
            title="Vista de tabla"
          >
            <List class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'cards'"
            :class="['p-1.5 rounded-md transition-colors', viewMode === 'cards' ? 'bg-white text-primary-600 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white']"
            title="Vista de tarjetas"
          >
            <Grid class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Búsqueda -->
        <FormInput
          v-model="searchQuery"
          type="text"
          placeholder="Buscar producto..."
          @keyup.enter="handleSearch"
        />
        <!-- Categoría -->
        <FormSelect
          v-model="selectedCategory"
          :options="categoryOptions"
          placeholder="Todas las categorías"
          @change="handleSearch"
        />
        <!-- Marca -->
        <FormSelect
          v-model="selectedBrand"
          :options="brandOptions"
          placeholder="Todas las marcas"
          @change="handleSearch"
        />
        <!-- Rango de precio -->
        <FormSelect
          v-model="priceRange"
          :options="priceOptions"
          placeholder="Todos los precios"
          @change="handleSearch"
        />
      </div>
    </Card>

    <!-- Vista Tabla -->
    <template v-if="viewMode === 'table'">
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
