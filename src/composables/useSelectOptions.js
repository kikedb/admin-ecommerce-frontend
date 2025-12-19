import { ref } from 'vue'
import productsService from '@/services/products.service'

export function useSelectOptions() {
  const categories = ref([])
  const brands = ref([])
  const series = ref([])
  const colors = ref([])
  const materials = ref([])
  const loading = ref(true) // Inicia en true para deshabilitar dropdowns
  const error = ref(null)

  const loadOptions = async () => {
    loading.value = true
    error.value = null

    try {
      const [catsRes, brandsRes, seriesRes, colorsRes, materialsRes] = await Promise.all([
        productsService.getCategories().catch(err => {
          console.warn('Error loading categories:', err)
          return { data: { data: [] } }
        }),
        productsService.getBrands().catch(err => {
          console.warn('Error loading brands:', err)
          return { data: { data: [] } }
        }),
        productsService.getSeries().catch(err => {
          console.warn('Error loading series:', err)
          return { data: { data: [] } }
        }),
        productsService.getColors().catch(err => {
          console.warn('Error loading colors:', err)
          return { data: { data: [] } }
        }),
        productsService.getMaterials().catch(err => {
          console.warn('Error loading materials:', err)
          return { data: { data: [] } }
        })
      ])

      categories.value = Array.isArray(catsRes?.data?.data) ? catsRes.data.data : []
      brands.value = Array.isArray(brandsRes?.data?.data) ? brandsRes.data.data : []
      series.value = Array.isArray(seriesRes?.data?.data) ? seriesRes.data.data : []
      colors.value = Array.isArray(colorsRes?.data?.data) ? colorsRes.data.data : []
      materials.value = Array.isArray(materialsRes?.data?.data) ? materialsRes.data.data : []
    } catch (err) {
      console.error('Error loading select options:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    brands,
    series,
    colors,
    materials,
    loading,
    error,
    loadOptions
  }
}
