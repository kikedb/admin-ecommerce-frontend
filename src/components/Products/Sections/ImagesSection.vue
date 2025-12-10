<template>
  <div class="space-y-6">
    <!-- Encabezado informativo -->
    <div class="mb-6">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900 dark:text-white">Imágenes del Producto</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Agrega imágenes para mostrar tu producto (recomendado para publicar)</p>
        </div>
      </div>
    </div>

    <!-- Imagen Principal -->
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div v-if="!store.mainImagePath" class="space-y-3">
        <div class="text-4xl text-gray-400">📷</div>
        <h3 class="text-lg font-medium text-gray-900">Imagen Principal</h3>
        <p class="text-sm text-gray-500">Arrastra una imagen aquí o haz clic para seleccionar</p>
        <input
          type="file"
          ref="mainImageInput"
          @change="handleMainImageUpload"
          accept="image/*"
          class="hidden"
        />
        <button
          type="button"
          @click="mainImageInput?.click()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Seleccionar Imagen
        </button>
      </div>
      <div v-else class="space-y-3">
        <img
          :src="store.mainImagePath"
          alt="Imagen principal"
          class="max-h-48 mx-auto rounded-lg"
        />
        <button
          type="button"
          @click="removeMainImage"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Cambiar Imagen
        </button>
      </div>
    </div>

    <!-- Galería de Imágenes -->
    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-4">Galería de Imágenes</h3>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div class="space-y-3">
          <div class="text-4xl text-gray-400">🖼️</div>
          <p class="text-sm text-gray-500">Arrastra imágenes o haz clic para agregar más</p>
          <input
            type="file"
            ref="galleryInput"
            @change="handleGalleryUpload"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="galleryInput?.click()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Agregar Imágenes
          </button>
        </div>
      </div>

      <!-- Vista previa de imágenes -->
      <div v-if="store.imagesPreviews.length > 0" class="mt-6 grid grid-cols-4 gap-4">
        <div
          v-for="(image, index) in store.imagesPreviews"
          :key="index"
          class="relative group"
        >
          <img
            :src="image"
            :alt="`Imagen ${index}`"
            class="w-full h-40 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            @click="removeImage(index)"
            class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductStore } from '@/stores/product'

const store = useProductStore()
const mainImageInput = ref(null)
const galleryInput = ref(null)

function handleMainImageUpload(event) {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      store.mainImagePath = e.target?.result || ''
      store.images = [{ image: file }]
    }
    reader.readAsDataURL(file)
  }
}

function handleGalleryUpload(event) {
  const files = event.target.files
  if (!files) return

  const newImages = []
  let loadedCount = 0

  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      newImages.push({
        preview: e.target?.result || '',
        image: file
      })
      loadedCount++
      
      if (loadedCount === files.length) {
        store.imagesPreviews = [
          ...store.imagesPreviews,
          ...newImages.map(img => img.preview)
        ]
        store.images = [
          ...store.images,
          ...newImages.map(img => ({ image: img.image }))
        ]
      }
    }
    reader.readAsDataURL(file)
  })
}

function removeMainImage() {
  store.mainImagePath = ''
  store.images = store.images.filter((_, index) => index !== 0)
}

function removeImage(index) {
  const newPreviews = store.imagesPreviews.filter((_, i) => i !== index)
  const newImages = store.images.filter((_, i) => i !== (store.images.length === store.imagesPreviews.length + 1 ? index + 1 : index))
  
  store.imagesPreviews = newPreviews
  store.images = newImages
}
</script>
