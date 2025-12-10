<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40" 
      @click="closeModal"
    ></div>
  </Transition>

  <!-- Main modal -->
  <Transition name="scale">
    <div 
      v-if="isOpen"
      id="createProductModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @keydown.esc="closeModal"
    >
      <div class="relative w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col rounded-lg">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow-2xl dark:bg-gray-800 flex flex-col h-full overflow-hidden">
          <!-- Modal header -->
          <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ editingProduct ? 'Editar Producto' : 'Crear Producto' }}
            </h3>
            <div class="flex items-center gap-4">
              <div v-if="store.provisionalBarCode" class="text-right">
                <p class="text-xs text-gray-500 dark:text-gray-400">Código Provisional</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white">{{ store.provisionalBarCode }}</p>
              </div>
            </div>
            <button
              type="button" 
              @click="closeModal"
              class="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm p-2 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
            >
              <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span class="sr-only">Cerrar modal</span>
            </button>
          </div>
          
          <!-- Modal body - Tabs and Content (scrollable) -->
          <div class="flex flex-col overflow-hidden flex-1">
            <!-- Tabs -->
            <div class="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-x-auto bg-gray-50 dark:bg-gray-900">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                @click="activeTab = index"
                :class="[
                  'px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap',
                  activeTab === index
                    ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                ]"
              >
                {{ tab.label }}
              </button>
            </div>
            
            <!-- Scrollable content area with proper padding -->
            <div class="overflow-y-auto flex-1 px-6 py-5">
              <form @submit.prevent="saveProduct" class="space-y-6">
                <!-- General Tab -->
                <div v-if="activeTab === 0">
                  <GeneralSection />
                </div>

                <!-- Images Tab -->
                <div v-else-if="activeTab === 1">
                  <ImagesSection />
                </div>

                <!-- Logistic Tab -->
                <div v-else-if="activeTab === 2">
                  <LogisticSection />
                </div>

                <!-- Features Tab -->
                <div v-else-if="activeTab === 3">
                  <FeaturesSection />
                </div>
              </form>
            </div>
          </div>
          
          <!-- Modal footer (sticky) -->
          <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <!-- Mensaje informativo (izquierda) -->
              <div v-if="!allFieldsComplete" class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">Faltan campos por completar</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{{ missingFieldsCount }} de 14 campos requeridos aún están vacíos</p>
                </div>
              </div>
              <div v-else class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-green-900 dark:text-green-200">¡Listo para publicar!</p>
                  <p class="text-xs text-green-800 dark:text-green-300 mt-0.5">Todos los 14 campos requeridos están completos</p>
                </div>
              </div>

              <!-- Botones (derecha) -->
              <div class="flex gap-3 w-full sm:w-auto">
                <button 
                  type="button"
                  @click="closeModal"
                  :disabled="isLoading"
                  class="px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  @click="saveProduct"
                  :disabled="isLoading || !allFieldsComplete"
                  class="px-6 py-2.5 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                  :class="[
                    allFieldsComplete
                      ? 'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 cursor-pointer'
                      : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                  ]"
                >
                  <span v-if="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span v-else-if="!allFieldsComplete && !editingProduct" class="inline-block w-4 h-4">🔒</span>
                  {{ isLoading ? (editingProduct ? 'Actualizando...' : 'Creando...') : (editingProduct ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useProducts } from '@/composables/useProducts'
import { useFormValidation } from '@/composables/useFormValidation'
import GeneralSection from './Sections/GeneralSection.vue'
import ImagesSection from './Sections/ImagesSection.vue'
import LogisticSection from './Sections/LogisticSection.vue'
import FeaturesSection from './Sections/FeaturesSection.vue'

const props = defineProps({
  editingProduct: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const store = useProductStore()
const { createProduct, updateProduct } = useProducts()
const { validateField, markFieldAsTouched, getFieldError, clearAllErrors, resetTouched } = useFormValidation()

const isOpen = ref(false)
const activeTab = ref(0)
const isLoading = ref(false)

// Campos requeridos y su validación
const requiredFields = [
  { name: 'name', validator: (val) => val !== null && val !== undefined && val !== '' },
  { name: 'sku', validator: (val) => val !== null && val !== undefined && val !== '' },
  { name: 'price', validator: (val) => val && val > 0 },
  { name: 'stock', validator: (val) => val !== null && val !== undefined && val >= 1 },
  { name: 'criticalStock', validator: (val) => val !== null && val !== undefined && val >= 0 },
  { name: 'categoryId', validator: (val) => val !== null && val !== undefined && val !== '' && val > 0 },
  { name: 'brandId', validator: (val) => val !== null && val !== undefined && val !== '' && val > 0 },
  { name: 'colorId', validator: (val) => val !== null && val !== undefined && val !== '' && val > 0 },
  { name: 'serieId', validator: (val) => val !== null && val !== undefined && val !== '' && val > 0 },
  { name: 'materialId', validator: (val) => val !== null && val !== undefined && val !== '' && val > 0 },
  { name: 'condition', validator: (val) => val !== null && val !== undefined && val !== '' && val > 0 },
  { name: 'conditionDetail', validator: (val) => val !== null && val !== undefined && val !== '' },
  { name: 'description', validator: (val) => val && val.length >= 20 },
  { name: 'shortDescription', validator: (val) => val && val.length >= 10 }
]

const completedFieldsCount = computed(() => {
  return requiredFields.filter(field => field.validator(store[field.name])).length
})

const missingFieldsCount = computed(() => {
  return requiredFields.length - completedFieldsCount.value
})

const allFieldsComplete = computed(() => {
  return missingFieldsCount.value === 0
})

const tabs = [
  { label: 'General' },
  { label: 'Imágenes' },
  { label: 'Logística' },
  { label: 'Características' }
]

// Método para validar un campo y marcarlo como tocado
function handleFieldChange(fieldName, value) {
  validateField(fieldName, value)
  markFieldAsTouched(fieldName)
}

// Método para obtener el error de un campo
function getFieldErrorMessage(fieldName) {
  return getFieldError(fieldName)
}

// Método para marcar un campo como tocado
function handleFieldBlur(fieldName, value) {
  markFieldAsTouched(fieldName)
  if (!getFieldError(fieldName)) {
    validateField(fieldName, value)
  }
}

// Load product data when editingProduct changes
watch(() => props.editingProduct, (newVal) => {
  if (newVal) {
    activeTab.value = 0
    loadProductData()
  } else {
    // When creating new, still clear inputs when modal opens
    activeTab.value = 0
    if (isOpen.value) {
      store.clearInputs()
    }
  }
})

function loadProductData() {
  if (!props.editingProduct) return

  const p = props.editingProduct
  store.id = p.id
  store.name = p.name
  store.sku = p.sku
  store.barCode = p.bar_code
  store.provisionalBarCode = p.provisional_bar_code
  store.description = p.description
  store.shortDescription = p.short_description
  store.stock = p.stock
  store.criticalStock = p.critical_stock
  store.price = p.price
  store.coinType = p.coin_type
  store.categoryId = p.category_id
  store.brandId = p.brand_id
  store.serieId = p.serie_id
  store.colorId = p.color_id
  store.materialId = p.material_id
  store.model = p.model
  store.condition = p.condition
  store.conditionDetail = p.condition_detail
  store.iva = p.iva
  store.isActive = p.is_active
  store.urlYoutube = p.url_youtube
  store.mainImagePath = p.main_image_path

  // Logistic
  if (p.product_logistic) {
    store.weight = p.product_logistic.weight
    store.weightUnit = p.product_logistic.weight_unit
    store.logisticClass = p.product_logistic.logistic_class
    store.shippingCost = p.product_logistic.shipping_cost
    store.shippingWay = p.product_logistic.shipping_way
    store.retreatInPerson = p.product_logistic.retreat_in_person
  }

  // Dimensions
  if (p.product_dimension) {
    store.height = p.product_dimension.height
    store.width = p.product_dimension.width
    store.large = p.product_dimension.large
    store.depth = p.product_dimension.depth
    store.measureUnit = p.product_dimension.measure_unit
  }

  // Warranty
  if (p.product_warranty) {
    store.warrantyType = p.product_warranty.warranty_type
    store.warrantyTime = p.product_warranty.warranty_time
    store.warrantyTimeUnit = p.product_warranty.warranty_time_unit
  }

  // Features
  if (p.feature) {
    store.ageRange = p.feature.age_range
    store.ageGroup = p.feature.age_group
    store.capacity = p.feature.capacity
    store.numberOfPieces = p.feature.number_of_pieces
    store.productionCountry = p.feature.production_country
    store.type = p.feature.type
    store.sounds = p.feature.sounds
    store.usesBatteries = p.feature.uses_batteries
    store.lights = p.feature.lights
    store.smallPieces = p.feature.small_pieces
    store.hipoalergenic = p.feature.hipoalergenic
    store.softMaterials = p.feature.soft_materials
    store.padded = p.feature.padded
    store.adjustableHeight = p.feature.adjustable_height
    store.bpaFree = p.feature.bpa_free
    store.microwaveSafe = p.feature.microwave_safe
    store.dishwasherSafe = p.feature.dishwasher_safe
    store.shape = p.feature.shape
    store.decorationStyle = p.feature.decoration_style
    store.typeOfHousehold = p.feature.type_of_household
    store.decorationType = p.feature.decoration_type
    store.wineGlassType = p.feature.wine_glass_type
    store.units = p.feature.units
    store.maxWeightSupported = p.feature.max_weight_supported
    store.characteres = p.feature.characteres
    store.features = p.feature.features
  }

  // Images
  if (p.product_images && p.product_images.length > 0) {
    store.imagesPreviews = p.product_images.map(img => img.image_path)
  }
}

async function saveProduct() {
  isLoading.value = true
  try {
    const formData = buildFormData()

    if (props.editingProduct) {
      await updateProduct(props.editingProduct.id, formData)
    } else {
      await createProduct(formData)
    }

    emit('saved')
    store.clearInputs()
    closeModal()
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    isLoading.value = false
  }
}

function buildFormData() {
  // Usar JSON para PUT, FormData solo si hay imágenes nuevas
  const data = {}

  // General information
  data.name = store.name
  data.sku = store.sku
  data.bar_code = store.barCode
  data.provisional_bar_code = store.provisionalBarCode
  data.description = store.description
  data.short_description = store.shortDescription
  data.stock = store.stock
  data.critical_stock = store.criticalStock
  data.price = store.price
  data.coin_type = store.coinType
  data.category_id = store.categoryId || ''
  data.brand_id = store.brandId || ''
  data.serie_id = store.serieId || ''
  data.color_id = store.colorId || ''
  data.material_id = store.materialId || ''
  data.model = store.model
  data.condition = store.condition || ''
  data.condition_detail = store.conditionDetail
  data.iva = store.iva ? 1 : 0
  data.is_active = store.isActive ? 1 : 0
  data.url_youtube = store.urlYoutube

  // Logistic
  data.weight = store.weight || 0
  data.weight_unit = store.weightUnit
  data.logistic_class = store.logisticClass
  data.shipping_cost = store.shippingCost || 0
  data.shipping_way = store.shippingWay
  data.retreat_in_person = store.retreatInPerson ? 1 : 0

  // Dimensions
  data.height = store.height || 0
  data.width = store.width || 0
  data.large = store.large || 0
  data.depth = store.depth || 0
  data.measure_unit = store.measureUnit

  // Warranty
  data.warranty_type = store.warrantyType
  data.warranty_time = store.warrantyTime || 0
  data.warranty_time_unit = store.warrantyTimeUnit

  // Features
  data.age_range = store.ageRange
  data.age_group = store.ageGroup
  data.capacity = store.capacity
  data.number_of_pieces = store.numberOfPieces || 0
  data.production_country = store.productionCountry
  data.type = store.type
  data.sounds = store.sounds ? 1 : 0
  data.uses_batteries = store.usesBatteries ? 1 : 0
  data.lights = store.lights ? 1 : 0
  data.small_pieces = store.smallPieces ? 1 : 0
  data.microwave_safe = store.microwaveSafe ? 1 : 0
  data.dishwasher_safe = store.dishwasherSafe ? 1 : 0
  data.hipoalergenic = store.hipoalergenic ? 1 : 0
  data.soft_materials = store.softMaterials ? 1 : 0
  data.padded = store.padded ? 1 : 0
  data.adjustable_height = store.adjustableHeight ? 1 : 0
  data.bpa_free = store.bpaFree ? 1 : 0
  data.features = store.features
  data.shape = store.shape
  data.characteres = store.characteres
  data.decoration_style = store.decorationStyle
  data.type_of_household = store.typeOfHousehold
  data.decoration_type = store.decorationType
  data.wine_glass_type = store.wineGlassType
  data.units = store.units
  data.max_weight_supported = store.maxWeightSupported

  return data
}

function openModal() {
  isOpen.value = true
  // Limpiar errores y campos tocados al abrir
  clearAllErrors()
  resetTouched()
}

function closeModal() {
  isOpen.value = false
  // Limpiar errores y campos tocados al cerrar
  clearAllErrors()
  resetTouched()
  emit('close')
}

function focusField(fieldName, tab) {
  // No es necesario cambiar tab en este caso, ya que todos están en General
  // Pero mantenemos el método para consistencia con otros componentes
  if (fieldName) {
    const element = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`)
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }, 100)
    }
  }
}

defineExpose({
  openModal
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
