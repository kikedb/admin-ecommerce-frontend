<template>
  <!-- Sección 1: Información básica -->
  <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
    <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-blue-600 rounded"></span>Información Básica</h4>
    <div class="grid gap-4">
      <!-- Nombre -->
      <div>
        <RequiredFieldLabel label="Nombre del Producto" fieldId="name" fieldName="name" :isRequired="true" />
        <div class="mb-2.5"></div>
        <input
          id="name"
          v-model="store.name"
          type="text"
          class="bg-white border-2 border-gray-200 text-gray-900 text-base rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition"
          placeholder="Ingrese el nombre del producto"
        />
      </div>
      <!-- Otros campos en una fila -->
      <div class="grid gap-4 sm:grid-cols-3">
        <!-- SKU -->
        <div>
          <RequiredFieldLabel label="SKU" fieldId="sku" fieldName="sku" :isRequired="true" />
          <div class="mb-2.5"></div>
          <input
            id="sku"
            v-model="store.sku"
            type="text"
            class="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition"
            placeholder="SKU123"
          />
        </div>
        <!-- Modelo -->
        <div>
          <label class="block mb-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Modelo</label>
          <input
            v-model="store.model"
            type="text"
            class="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition"
            placeholder="Modelo"
          />
        </div>
        <!-- Código de Barras -->
        <div>
          <label class="block mb-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Código de Barras</label>
          <input
            v-model="store.barCode"
            type="text"
            class="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition"
            placeholder="123456789"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Sección 3: Precios e Inventario -->
  <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
    <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-green-600 rounded"></span>Precios e Inventario</h4>
    <div class="grid gap-4 sm:grid-cols-3">
      <!-- Precio con Divisa -->
      <div>
        <RequiredFieldLabel label="Precio" fieldId="price" fieldName="price" :isRequired="true" />
        <div class="mb-2.5"></div>
        <div class="flex shadow-sm rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <select
            v-model="store.coinType"
            class="px-3 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-r-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none font-semibold text-sm shrink-0 transition"
          >
            <option value="$">$ CLP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <input
            :value="formatNumber(store.price)"
            @input="handleNumberInput($event, (val) => store.price = val)"
            type="text"
            inputmode="numeric"
            class="block w-full px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none border-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="0.00"
          />
        </div>
      </div>
      <!-- Stock -->
      <div>
        <RequiredFieldLabel label="Stock" fieldId="stock" fieldName="stock" :isRequired="true" />
        <div class="mb-2.5"></div>
        <input
          :value="formatNumber(store.stock)"
          @input="handleNumberInput($event, (val) => store.stock = val)"
          type="text"
          inputmode="numeric"
          class="form-input"
          placeholder="0"
        />
      </div>
      <!-- Stock Crítico -->
      <div>
        <RequiredFieldLabel label="Stock Crítico" fieldId="criticalStock" fieldName="criticalStock" :isRequired="true" />
        <div class="mb-2.5"></div>
        <input
          :value="formatNumber(store.criticalStock)"
          @input="handleNumberInput($event, (val) => store.criticalStock = val)"
          type="text"
          inputmode="numeric"
          class="form-input"
          placeholder="0"
        />
      </div>
    </div>
  </div>

  <!-- Sección 4: Clasificación -->
  <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
    <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-purple-600 rounded"></span>Clasificación</h4>
    <div class="grid gap-4 sm:grid-cols-3">
      <!-- Categoría -->
      <div>
        <RequiredFieldLabel label="Categoría" fieldId="category" fieldName="categoryId" :isRequired="true" />
        <div class="mb-2.5"></div>
        <select
          id="category"
          v-model.number="store.categoryId"
          class="form-select"
          @change="handleCategoryChange"
          :disabled="loading"
        >
          <option value="">{{ loading ? 'Cargando...' : 'Seleccionar' }}</option>
          <option v-for="cat in categories || []" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
      <!-- Marca -->
      <div>
        <RequiredFieldLabel label="Marca" fieldId="brand" fieldName="brandId" :isRequired="true" />
        <div class="mb-2.5"></div>
        <select
          id="brand"
          v-model.number="store.brandId"
          class="form-select"
          :disabled="loading"
        >
          <option value="">{{ loading ? 'Cargando...' : 'Seleccionar' }}</option>
          <option v-for="brand in brands || []" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
        </select>
      </div>
      <!-- Color -->
      <div>
        <RequiredFieldLabel label="Color" fieldId="color" fieldName="colorId" :isRequired="true" />
        <div class="mb-2.5"></div>
        <select
          id="color"
          v-model.number="store.colorId"
          class="form-select"
          @change="handleColorChange"
          :disabled="loading"
        >
          <option value="">{{ loading ? 'Cargando...' : 'Seleccionar' }}</option>
          <option v-for="color in colors || []" :key="color.id" :value="color.id">{{ color.name }}</option>
        </select>
      </div>
      <!-- Serie -->
      <div>
        <RequiredFieldLabel label="Serie" fieldId="serie" fieldName="serieId" :isRequired="true" />
        <div class="mb-2.5"></div>
        <select
          id="serie"
          v-model.number="store.serieId"
          class="form-select"
          @change="handleSerieChange"
          :disabled="loading"
        >
          <option value="">{{ loading ? 'Cargando...' : 'Seleccionar' }}</option>
          <option v-for="serie in series || []" :key="serie.id" :value="serie.id">{{ serie.name }}</option>
        </select>
      </div>
      <!-- Material -->
      <div>
        <RequiredFieldLabel label="Material" fieldId="material" fieldName="materialId" :isRequired="true" />
        <div class="mb-2.5"></div>
        <select
          id="material"
          v-model.number="store.materialId"
          class="form-select"
          @change="handleMaterialChange"
          :disabled="loading"
        >
          <option value="">{{ loading ? 'Cargando...' : 'Seleccionar' }}</option>
          <option v-for="material in materials || []" :key="material.id" :value="material.id">{{ material.name }}</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Sección 5: Condición -->
  <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
    <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-orange-600 rounded"></span>Condición</h4>
    <div class="grid gap-4 sm:grid-cols-3">
      <!-- Condición -->
      <div>
        <RequiredFieldLabel label="Condición" fieldId="condition" fieldName="condition" :isRequired="true" />
        <div class="mb-2.5"></div>
        <select
          id="condition"
          v-model.number="store.condition"
          class="form-select"
        >
          <option :value="null">Seleccionar</option>
          <option :value="1">Nuevo</option>
          <option :value="2">Usado</option>
          <option :value="3">Reacondicionado</option>
        </select>
      </div>
      <!-- Detalle -->
      <div class="sm:col-span-2">
        <RequiredFieldLabel label="Detalle de Condición" fieldId="conditionDetail" fieldName="conditionDetail" :isRequired="true" />
        <div class="mb-2.5"></div>
        <input
          id="conditionDetail"
          v-model="store.conditionDetail"
          type="text"
          class="form-input"
          placeholder="Descripción adicional"
        />
      </div>
    </div>
  </div>

  <!-- Sección 6: Descripciones -->
  <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
    <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-indigo-600 rounded"></span>Descripciones</h4>
    <div class="grid gap-4 sm:grid-cols-2 items-start">
      <!-- Descripción Completa (Izquierda) -->
      <div>
        <RequiredFieldLabel label="Descripción Completa" fieldId="fullDesc" fieldName="description" :isRequired="true" />
        <div class="mb-2.5"></div>
        <textarea
          id="fullDesc"
          v-model="store.description"
          rows="7"
          class="form-input resize-none"
          placeholder="Escriba la descripción del producto"
          @blur="handleDescriptionBlur"
          :disabled="isGenerating"
        ></textarea>
        <div v-if="!isDescriptionsEnabled" class="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          Complete todos los campos requeridos para habilitar la generación automática con IA
        </div>
        <div v-if="isGenerating" class="mt-2 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <span class="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
          Generando descripciones...
        </div>
        <div v-if="generationError" class="mt-2 text-sm text-red-600 dark:text-red-400">
          Error: {{ generationError }}
        </div>
        <div v-if="isDescriptionsEnabled && store.description && !isGenerating" class="mt-3 flex items-start gap-2 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <span class="text-lg">✨</span>
          <div>
            <p class="text-sm font-semibold text-amber-900 dark:text-amber-200">Generado por Sofia AI</p>
            <p class="text-xs text-amber-800 dark:text-amber-300 mt-0.5">Este contenido fue creado con inteligencia artificial para optimizar tu descripción</p>
          </div>
        </div>
      </div>
      <!-- Descripción Corta (Derecha) -->
      <div>
        <RequiredFieldLabel label="Descripción Corta" fieldId="shortDesc" fieldName="shortDescription" :isRequired="true" />
        <div class="mb-2.5"></div>
        <div class="relative">
          <textarea
            id="shortDesc"
            v-model="store.shortDescription"
            rows="7"
            class="form-input resize-none"
            placeholder="Generado automáticamente por Sofia AI"
            disabled
          ></textarea>
          <div class="absolute inset-0 rounded-lg pointer-events-none flex items-center justify-center bg-black/5 dark:bg-black/20">
            <div class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Campo automático</span>
            </div>
          </div>
        </div>
        <div v-if="isDescriptionsEnabled && store.shortDescription && !isGenerating" class="mt-3 flex items-start gap-2 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <span class="text-lg">✨</span>
          <div>
            <p class="text-sm font-semibold text-amber-900 dark:text-amber-200">Generado por Sofia AI</p>
            <p class="text-xs text-amber-800 dark:text-amber-300 mt-0.5">Este contenido fue creado automáticamente con inteligencia artificial</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Sección 7: Estado -->
  <div>
    <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-red-600 rounded"></span>Estado</h4>
    <div class="flex items-center gap-6">
      <div class="flex items-center">
        <input
          v-model="store.iva"
          type="checkbox"
          id="iva"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="iva" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Incluir IVA</label>
      </div>
      <div class="flex items-center">
        <input
          v-model="store.isActive"
          type="checkbox"
          id="active"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="active" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Producto Activo</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label {
  @apply block mb-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider;
}

.form-input {
  @apply bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition;
}

.form-select {
  @apply bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition;
}

.form-select:disabled {
  @apply opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800;
}
</style>

<script setup>
import { onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useNumberFormat } from '@/composables/useNumberFormat'
import { useSelectOptions } from '@/composables/useSelectOptions'
import { useDescriptionGenerator } from '@/composables/useDescriptionGenerator'
import RequiredFieldLabel from '@/components/Products/RequiredFieldLabel.vue'
import productsService from '@/services/products.service'

const store = useProductStore()
const { formatNumber, handleNumberInput } = useNumberFormat()
const { categories, brands, series, colors, materials, loading, loadOptions } = useSelectOptions()
const { isGenerating, generationError, generateDescriptions } = useDescriptionGenerator()

// Obtener nombres de categorías y otras entidades
const getCategoryName = computed(() => {
  return categories.value.find(c => c.id === store.categoryId)?.name || ''
})

const getBrandName = computed(() => {
  return brands.value.find(b => b.id === store.brandId)?.name || ''
})

const getColorName = computed(() => {
  return colors.value.find(c => c.id === store.colorId)?.name || ''
})

const getSerieName = computed(() => {
  return series.value.find(s => s.id === store.serieId)?.name || ''
})

const getMaterialName = computed(() => {
  return materials.value.find(m => m.id === store.materialId)?.name || ''
})

// Validar que los campos requeridos estén completos
const isDescriptionsEnabled = computed(() => {
  return (
    store.name &&
    store.model &&
    store.price &&
    store.categoryId &&
    store.brandId &&
    store.colorId &&
    store.serieId &&
    store.materialId &&
    store.condition &&
    store.conditionDetail
  )
})

// Validar que todos los campos necesarios para generar SKU estén completos
const canGenerateSku = computed(() => {
  return store.categoryId && store.serieId && store.materialId && store.colorId
})

// Generar SKU automáticamente cuando todos los campos estén completos
const generateSkuAutomatically = async () => {
  if (!canGenerateSku.value) return

  try {
    const categoryCode = categories.value.find(c => c.id === store.categoryId)?.code || ''
    const serieCode = series.value.find(s => s.id === store.serieId)?.code || ''
    const materialCode = materials.value.find(m => m.id === store.materialId)?.code || ''
    const colorCode = colors.value.find(c => c.id === store.colorId)?.code || ''

    const result = await productsService.generateSku({
      category_code: categoryCode,
      serie_code: serieCode,
      material_code: materialCode,
      color_code: colorCode
    })

    store.sku = result.data.data
  } catch (error) {
    console.error('Error generando SKU:', error)
  }
}

const handleDescriptionBlur = async () => {
  await generateDescriptions(
    store,
    getCategoryName.value,
    getBrandName.value,
    getColorName.value,
    getSerieName.value,
    getMaterialName.value
  )
}

const handleCategoryChange = () => generateSkuAutomatically()
const handleSerieChange = () => generateSkuAutomatically()
const handleMaterialChange = () => generateSkuAutomatically()
const handleColorChange = () => generateSkuAutomatically()

onMounted(() => {
  loadOptions()
})
</script>
