import { ref } from 'vue'
import openaiService from '@/services/openai.service'

export function useDescriptionGenerator() {
  const isGenerating = ref(false)
  const generationError = ref(null)

  const generateDescriptions = async (store, categoryName = '', brandName = '', colorName = '', serieName = '', materialName = '') => {
    if (!store.description) {
      return
    }

    isGenerating.value = true
    generationError.value = null

    try {
      const result = await openaiService.generateDescriptions({
        name: store.name,
        model: store.model,
        price: store.price,
        category: categoryName,
        brand: brandName,
        color: colorName,
        serie: serieName,
        material: materialName,
        condition: store.condition,
        conditionDetail: store.conditionDetail,
        userDescription: store.description
      })

      // Actualizar los campos con las descripciones generadas
      store.description = result.fullDescription
      store.shortDescription = result.shortDescription
    } catch (error) {
      generationError.value = error.message
      console.error('Error generando descripciones:', error)
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    generationError,
    generateDescriptions
  }
}
