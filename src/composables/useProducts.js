import { ref, computed } from 'vue'
import productsService from '@/services/products.service'

export const useProducts = () => {
  const products = ref([])
  const categories = ref([])
  const brands = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const itemsPerPage = 7
  let allProducts = []

  // Cargar productos
  const fetchProducts = async (page = 1, filters = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.getProducts(1, 1000, filters)
      allProducts = response.data.data || []
      totalItems.value = response.data.total || allProducts.length || 0
      totalPages.value = Math.ceil(totalItems.value / itemsPerPage)
      
      // Aplicar paginación en el frontend
      const startIndex = (page - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      products.value = allProducts.slice(startIndex, endIndex)
      currentPage.value = page
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar productos'
      products.value = []
      allProducts = []
    } finally {
      isLoading.value = false
    }
  }

  // Cargar categorías
  const fetchCategories = async () => {
    try {
      const response = await productsService.getCategories()
      categories.value = response.data.data || response.data || []
    } catch (err) {
      console.error('Error al cargar categorías:', err)
      categories.value = []
    }
  }

  // Cargar marcas
  const fetchBrands = async () => {
    try {
      const response = await productsService.getBrands()
      brands.value = response.data.data || response.data || []
    } catch (err) {
      console.error('Error al cargar marcas:', err)
      brands.value = []
    }
  }

  // Crear producto
  const createProduct = async (data) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.createProduct(data)
      await fetchProducts(1) // Recargar lista
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear producto'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Actualizar producto
  const updateProduct = async (id, data) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsService.updateProduct(id, data)
      await fetchProducts(currentPage.value) // Recargar lista
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar producto'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Deshabilitar producto
  const disableProduct = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      await productsService.disableProduct(id)
      await fetchProducts(currentPage.value) // Recargar lista
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al deshabilitar producto'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Eliminar producto con fallback a disable si tiene ventas asociadas
  const deleteProduct = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      await productsService.deleteProduct(id)
      await fetchProducts(currentPage.value) // Recargar lista
    } catch (err) {
      // Si el error indica que el producto tiene ventas, deshabilitar en su lugar
      const message = err.response?.data?.message || ''
      if (message.toLowerCase().includes('venta') || message.toLowerCase().includes('asociad') || err.response?.status === 409) {
        try {
          await productsService.disableProduct(id)
          await fetchProducts(currentPage.value)
        } catch (disableErr) {
          error.value = disableErr.response?.data?.message || 'Error al deshabilitar producto'
          throw disableErr
        }
      } else {
        error.value = err.response?.data?.message || 'Error al eliminar producto'
        throw err
      }
    } finally {
      isLoading.value = false
    }
  }

  // Eliminar múltiples productos
  const deleteProducts = async (ids) => {
    isLoading.value = true
    error.value = null
    try {
      await productsService.deleteProducts(ids)
      await fetchProducts(1) // Recargar desde página 1
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar productos'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Computed
  const hasProducts = computed(() => products.value.length > 0)
  const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
  const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))

  return {
    // State
    products,
    categories,
    brands,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    // Computed
    hasProducts,
    startItem,
    endItem,
    // Methods
    fetchProducts,
    fetchCategories,
    fetchBrands,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
    disableProduct
  }
}
