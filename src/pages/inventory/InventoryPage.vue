<script setup>
import { ref, computed } from 'vue'
import { inventoryItems, locations } from '@/stores/mockInventory'
import { useNotification } from '@/composables/useNotification'

const notification = useNotification()

const showExportModal = ref(false)
const showImportModal = ref(false)
const isProcessing = ref(false)

const handleExport = () => {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    showExportModal.value = false
    notification.success('Inventario exportado a CSV exitosamente.')
  }, 2000)
}

const handleImport = () => {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    showImportModal.value = false
    notification.success('Inventario importado exitosamente.')
  }, 2000)
}

const activeFilter = ref('Todos')
const searchQuery = ref('')
const selectedLocation = ref('all')
const selectedItemForDetail = ref(null)
const selectedProductIds = ref([])

const selectAll = computed({
  get: () => {
    return filteredItems.value.length > 0 && selectedProductIds.value.length === filteredItems.value.length
  },
  set: (val) => {
    if (val) {
      selectedProductIds.value = filteredItems.value.map(i => i.id)
    } else {
      selectedProductIds.value = []
    }
  }
})

const metrics = computed(() => {
  const totalDevoluciones = inventoryItems.value.reduce((acc, item) => acc + item.devoluciones, 0)
  
  let lowStockCount = 0
  inventoryItems.value.forEach(item => {
    const totalDisp = item.locations.reduce((acc, loc) => acc + loc.disponible, 0)
    if (totalDisp < 5) lowStockCount++
  })

  return [
    { label: 'Total Productos', value: inventoryItems.value.length.toString(), hasGraph: true },
    { label: 'Devoluciones Totales', value: totalDevoluciones.toString(), hasGraph: true },
    { label: 'Alertas de Stock', value: lowStockCount.toString(), hasGraph: true, alert: true },
    { label: 'Sucursales / APIs', value: locations.value.length.toString(), hasGraph: false }
  ]
})

const filteredItems = computed(() => {
  return inventoryItems.value.filter(item => {
    // Buscar
    if (searchQuery.value && !item.product.toLowerCase().includes(searchQuery.value.toLowerCase()) && !item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    
    // Filtrar por ubicación (Bodega, Tienda, API)
    if (selectedLocation.value !== 'all') {
      const hasStockInLoc = item.locations.some(loc => loc.locationId === selectedLocation.value)
      if (!hasStockInLoc) return false
    }

    return true
  })
})

const getLocationName = (locId) => {
  const loc = locations.value.find(l => l.id === locId)
  return loc ? loc.name : 'Desconocido'
}

const sumField = (item, field) => {
  if (selectedLocation.value === 'all') {
    return item.locations.reduce((acc, loc) => acc + loc[field], 0)
  }
  const loc = item.locations.find(l => l.locationId === selectedLocation.value)
  return loc ? loc[field] : 0
}

const getAvailabilityStatus = (disponible) => {
  if (disponible === 0) return { label: 'Agotado', class: 'bg-red-100 text-red-800' }
  if (disponible < 5) return { label: 'Bajo stock', class: 'bg-yellow-100 text-yellow-800' }
  return { label: 'Disponible', class: 'bg-green-100 text-green-800' }
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Inventario General</h1>
        <p class="text-sm text-gray-500 mt-1">Gestión del universo total de productos a través de múltiples bodegas, tiendas físicas y APIs de Marketplaces.</p>
      </div>
      <div class="flex gap-2">
        <button @click="showExportModal = true" class="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium text-sm transition shadow-sm">
          Exportar
        </button>
        <button @click="showImportModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition shadow-sm">
          Importar inventario
        </button>
      </div>
    </div>

    <!-- Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="(metric, idx) in metrics" :key="idx" class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <p class="text-sm font-medium text-gray-500 mb-1">{{ metric.label }}</p>
        <div class="flex items-end justify-between">
          <p :class="metric.alert ? 'text-red-600' : 'text-gray-900'" class="text-3xl font-bold">{{ metric.value }}</p>
          <div v-if="metric.hasGraph" class="w-16 h-8 bg-gray-50 rounded">
            <svg class="w-full h-full text-blue-100" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path d="M0,40 L0,20 Q25,30 50,15 T100,10 L100,40 Z" fill="currentColor"></path>
              <path d="M0,20 Q25,30 50,15 T100,10" fill="none" stroke="#2563eb" stroke-width="2"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <!-- Filters -->
      <div class="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-3">
          <select v-model="selectedLocation" class="border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm">
            <option value="all">Todas las ubicaciones</option>
            <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
          </select>
          
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchQuery" type="text" class="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm w-64" placeholder="Buscar por producto o SKU">
          </div>
        </div>
        
        <div>
          <button @click="notification.info('Abriendo panel de filtros avanzados...')" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Más filtros</button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white border-b border-gray-200">
              <th class="py-3 px-4 text-sm font-semibold text-gray-600 w-10">
                <input type="checkbox" v-model="selectAll" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
              </th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Producto</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Devoluciones</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Ubicaciones activas</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Comprometido</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Disponible</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600 text-right">En camino</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="item in filteredItems" :key="item.id" @click="selectedItemForDetail = item" class="hover:bg-gray-50 transition cursor-pointer">
              <td class="py-3 px-4 text-sm text-gray-500" @click.stop>
                <input type="checkbox" :value="item.id" v-model="selectedProductIds" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 cursor-pointer hover:underline text-blue-600">{{ item.product }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ item.sku }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span v-if="item.devoluciones > 0" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  {{ item.devoluciones }} devs
                </span>
                <span v-else class="text-gray-400 text-sm">-</span>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="loc in item.locations" :key="loc.locationId" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {{ getLocationName(loc.locationId) }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-gray-900 text-right">{{ sumField(item, 'comprometido') }}</td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <span :class="getAvailabilityStatus(sumField(item, 'disponible')).class" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                    {{ sumField(item, 'disponible') }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-gray-500 text-right">
                <span v-if="sumField(item, 'enCamino') > 0" class="text-blue-600 font-medium">{{ sumField(item, 'enCamino') }}</span>
                <span v-else>0</span>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="7" class="py-12 text-center text-gray-500">
                No se encontraron productos en el inventario para los filtros actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>

    <!-- Slide-over Modal for Inventory Detail -->
  <Teleport to="body">
    <div v-if="selectedItemForDetail" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div class="absolute inset-0 overflow-hidden">
      <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="selectedItemForDetail = null"></div>
      <div class="fixed inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-md">
          <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
            <div class="p-6 bg-gray-50 border-b border-gray-200 sm:px-6">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">
                  Detalles de Inventario
                </h2>
                <div class="ml-3 h-7 flex items-center">
                  <button @click="selectedItemForDetail = null" type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span class="sr-only">Cerrar panel</span>
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="relative flex-1 py-6 px-4 sm:px-6">
              <!-- Product Header -->
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ selectedItemForDetail.product }}</h3>
                  <p class="text-sm text-gray-500">SKU: {{ selectedItemForDetail.sku }}</p>
                </div>
              </div>

              <!-- Locations Breakdown -->
              <h4 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Desglose por ubicación</h4>
              <div class="space-y-4">
                <div v-for="loc in selectedItemForDetail.locations" :key="loc.locationId" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-medium text-gray-900">{{ getLocationName(loc.locationId) }}</span>
                    <span :class="getAvailabilityStatus(loc.disponible).class" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                      {{ loc.disponible }} disp.
                    </span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-sm mt-3 border-t border-gray-200 pt-3">
                    <div>
                      <p class="text-gray-500 text-xs">Comprometido</p>
                      <p class="font-medium text-gray-900">{{ loc.comprometido }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500 text-xs">En camino</p>
                      <p class="font-medium text-blue-600">{{ loc.enCamino }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500 text-xs">Devoluciones</p>
                      <p class="font-medium text-red-600">{{ selectedItemForDetail.devoluciones }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6">
                <button @click="notification.info('Abriendo modal para ajustar cantidades...')" class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Ajustar cantidades
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </Teleport>
    
    <!-- Export Modal -->
  <Teleport to="body">
    <div v-if="showExportModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900">Exportar inventario</h3>
          <button @click="showExportModal = false" :disabled="isProcessing" class="text-gray-400 hover:text-gray-500 disabled:opacity-50">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 mb-4">Selecciona el formato de exportación y los datos que deseas incluir en el reporte.</p>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Formato</label>
              <select class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>CSV (Compatible con Excel)</option>
                <option>Excel (.xlsx)</option>
                <option>PDF</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Exportar de</label>
              <select class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Todas las bodegas y tiendas</option>
                <option>Solo Bodega Principal</option>
              </select>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="showExportModal = false" :disabled="isProcessing" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancelar</button>
          <button @click="handleExport" :disabled="isProcessing" class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center disabled:opacity-50">
            <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? 'Exportando...' : 'Exportar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

    <!-- Import Modal -->
  <Teleport to="body">
    <div v-if="showImportModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900">Importar inventario</h3>
          <button @click="showImportModal = false" :disabled="isProcessing" class="text-gray-400 hover:text-gray-500 disabled:opacity-50">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 mb-4">Sube un archivo CSV o Excel para actualizar masivamente tu inventario.</p>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="mt-4 flex text-sm text-gray-600">
              <label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Sube un archivo</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only">
              </label>
              <p class="pl-1">o arrastra y suelta</p>
            </div>
            <p class="text-xs text-gray-500 mt-2">CSV, XLS, XLSX hasta 10MB</p>
          </div>
          <div class="mt-4">
            <a href="#" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Descargar plantilla de ejemplo</a>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="showImportModal = false" :disabled="isProcessing" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancelar</button>
          <button @click="handleImport" :disabled="isProcessing" class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center disabled:opacity-50">
            <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? 'Importando...' : 'Importar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
