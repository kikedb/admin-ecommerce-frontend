<script setup>
import { ref, computed } from 'vue'
import { inventoryItems, locations } from '@/stores/mockInventory'
import { useNotification } from '@/composables/useNotification'
import { Download, UploadCloud, Search, Package, SlidersHorizontal, X } from 'lucide-vue-next'

import PageHeader from '@/components/Layout/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import FormSelect from '@/components/Form/FormSelect.vue'

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

const searchQuery = ref('')
const selectedLocation = ref('all')
const selectedItemForDetail = ref(null)
const selectedProductIds = ref([])

const locationOptions = computed(() => {
  return [
    { value: 'all', label: 'Todas las ubicaciones' },
    ...locations.value.map(loc => ({ value: loc.id, label: loc.name }))
  ]
})

const filteredItems = computed(() => {
  return inventoryItems.value.filter(item => {
    // Buscar
    if (searchQuery.value && !item.product.toLowerCase().includes(searchQuery.value.toLowerCase()) && !item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    
    // Filtrar por ubicación
    if (selectedLocation.value !== 'all') {
      const hasStockInLoc = item.locations.some(loc => loc.locationId === selectedLocation.value)
      if (!hasStockInLoc) return false
    }

    return true
  })
})

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
    { label: 'Total Productos', value: inventoryItems.value.length.toString(), alert: false },
    { label: 'Devoluciones Totales', value: totalDevoluciones.toString(), alert: false },
    { label: 'Alertas de Stock', value: lowStockCount.toString(), alert: true },
    { label: 'Sucursales / APIs', value: locations.value.length.toString(), alert: false }
  ]
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
  if (disponible === 0) return { label: 'Agotado', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
  if (disponible < 5) return { label: 'Bajo stock', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' }
  return { label: 'Disponible', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
}

const columns = [
  { key: 'select', label: '' },
  { key: 'product', label: 'Producto' },
  { key: 'devoluciones', label: 'Devoluciones' },
  { key: 'locations', label: 'Ubicaciones activas' },
  { key: 'comprometido', label: 'Comprometido', align: 'right' },
  { key: 'disponible', label: 'Disponible', align: 'right' },
  { key: 'enCamino', label: 'En camino', align: 'right' }
]

const handleRowClick = (item) => {
  selectedItemForDetail.value = item
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <PageHeader title="Inventario General">
      <template #description>Gestión del universo total de productos a través de múltiples bodegas, tiendas físicas y APIs de Marketplaces.</template>
      <template #actions>
        <Button variant="outline" @click="showExportModal = true" class="gap-2">
          <Download class="w-4 h-4" /> Exportar
        </Button>
        <Button variant="primary" @click="showImportModal = true" class="gap-2">
          <UploadCloud class="w-4 h-4" /> Importar inventario
        </Button>
      </template>
    </PageHeader>

    <!-- Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card v-for="(metric, idx) in metrics" :key="idx" class="p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ metric.label }}</p>
        <p :class="metric.alert ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'" class="text-3xl font-bold">{{ metric.value }}</p>
      </Card>
    </div>

    <!-- Table Container -->
    <Card class="p-0 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Filters -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-3 w-full max-w-2xl">
          <div class="w-64 shrink-0">
            <FormSelect
              v-model="selectedLocation"
              :options="locationOptions"
            />
          </div>
          
          <div class="relative flex-1 shrink-0">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="w-4 h-4 text-gray-400" />
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors shadow-sm h-10" 
              placeholder="Buscar por producto o SKU"
            >
          </div>
        </div>
        
        <div>
          <Button variant="ghost" @click="notification.info('Abriendo panel de filtros avanzados...')" class="gap-2 text-primary-600">
            <SlidersHorizontal class="w-4 h-4" /> Más filtros
          </Button>
        </div>
      </div>

      <!-- Action Bar (when selected) -->
      <div v-if="selectedProductIds.length > 0" class="bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center text-sm">
        <span class="font-medium text-primary-700 dark:text-primary-300 mr-4">{{ selectedProductIds.length }} seleccionados</span>
        <Button variant="outline" size="sm" @click="notification.info('Actualizando inventario en bloque...')" class="mr-3 bg-white dark:bg-gray-800">Actualizar cantidades</Button>
      </div>

      <!-- Table -->
      <DataTable :columns="columns" :data="filteredItems" empty-message="No se encontraron productos en el inventario para los filtros actuales.">
        
        <template #header-select>
          <input type="checkbox" v-model="selectAll" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
        </template>
        
        <template #cell-select="{ row }">
          <input type="checkbox" :value="row.id" v-model="selectedProductIds" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" @click.stop>
        </template>

        <template #cell-product="{ row }">
          <div class="flex items-center gap-3 cursor-pointer" @click="handleRowClick(row)">
            <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
              <Package class="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-primary-600 hover:underline">{{ row.product }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ row.sku }}</p>
            </div>
          </div>
        </template>

        <template #cell-devoluciones="{ row }">
          <span v-if="row.devoluciones > 0" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {{ row.devoluciones }} devs
          </span>
          <span v-else class="text-gray-400 text-sm">-</span>
        </template>

        <template #cell-locations="{ row }">
          <div class="flex flex-wrap gap-1">
            <span v-for="loc in row.locations" :key="loc.locationId" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {{ getLocationName(loc.locationId) }}
            </span>
          </div>
        </template>

        <template #cell-comprometido="{ row }">
          <span class="text-sm text-gray-900 dark:text-white font-medium">{{ sumField(row, 'comprometido') }}</span>
        </template>

        <template #cell-disponible="{ row }">
          <span :class="getAvailabilityStatus(sumField(row, 'disponible')).class" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ sumField(row, 'disponible') }}
          </span>
        </template>

        <template #cell-enCamino="{ row }">
          <span v-if="sumField(row, 'enCamino') > 0" class="text-primary-600 font-medium">{{ sumField(row, 'enCamino') }}</span>
          <span v-else class="text-gray-500">0</span>
        </template>
        
      </DataTable>
    </Card>

    <!-- Slide-over Modal for Inventory Detail -->
    <Teleport to="body">
      <div v-if="selectedItemForDetail" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="selectedItemForDetail = null"></div>
          <div class="fixed inset-y-0 right-0 max-w-full flex">
            <div class="w-screen max-w-md">
              <div class="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-y-scroll">
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 class="text-lg font-medium text-gray-900 dark:text-white" id="slide-over-title">
                    Detalles de Inventario
                  </h2>
                  <button @click="selectedItemForDetail = null" type="button" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                    <span class="sr-only">Cerrar panel</span>
                    <X class="w-6 h-6" />
                  </button>
                </div>
                
                <div class="relative flex-1 py-6 px-4 sm:px-6">
                  <!-- Product Header -->
                  <div class="flex items-center gap-4 mb-6">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <Package class="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedItemForDetail.product }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">SKU: {{ selectedItemForDetail.sku }}</p>
                    </div>
                  </div>

                  <!-- Locations Breakdown -->
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Desglose por ubicación</h4>
                  <div class="space-y-4">
                    <div v-for="loc in selectedItemForDetail.locations" :key="loc.locationId" class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div class="flex justify-between items-center mb-3">
                        <span class="font-medium text-gray-900 dark:text-white">{{ getLocationName(loc.locationId) }}</span>
                        <span :class="getAvailabilityStatus(loc.disponible).class" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ loc.disponible }} disp.
                        </span>
                      </div>
                      <div class="grid grid-cols-3 gap-2 text-sm mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div>
                          <p class="text-gray-500 dark:text-gray-400 text-xs">Comprometido</p>
                          <p class="font-medium text-gray-900 dark:text-white mt-1">{{ loc.comprometido }}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 dark:text-gray-400 text-xs">En camino</p>
                          <p class="font-medium text-primary-600 mt-1">{{ loc.enCamino }}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 dark:text-gray-400 text-xs">Devoluciones</p>
                          <p class="font-medium text-red-600 mt-1">{{ selectedItemForDetail.devoluciones }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="mt-8">
                    <Button variant="primary" class="w-full justify-center" @click="notification.info('Abriendo modal para ajustar cantidades...')">
                      Ajustar cantidades
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Export Modal -->
    <Modal :is-open="showExportModal" title="Exportar inventario" @close="showExportModal = false">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Selecciona el formato de exportación y los datos que deseas incluir en el reporte.</p>
      <div class="space-y-4">
        <FormSelect
          label="Formato"
          :options="[{value:'csv', label:'CSV (Compatible con Excel)'}, {value:'xlsx', label:'Excel (.xlsx)'}, {value:'pdf', label:'PDF'}]"
          model-value="csv"
        />
        <FormSelect
          label="Exportar de"
          :options="[{value:'all', label:'Todas las bodegas y tiendas'}, {value:'main', label:'Solo Bodega Principal'}]"
          model-value="all"
        />
      </div>
      <template #footer>
        <Button variant="outline" @click="showExportModal = false" :disabled="isProcessing">Cancelar</Button>
        <Button variant="primary" @click="handleExport" :disabled="isProcessing">
          {{ isProcessing ? 'Exportando...' : 'Exportar' }}
        </Button>
      </template>
    </Modal>

    <!-- Import Modal -->
    <Modal :is-open="showImportModal" title="Importar inventario" @close="showImportModal = false">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Sube un archivo CSV o Excel para actualizar masivamente tu inventario.</p>
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800/50">
        <UploadCloud class="w-12 h-12 text-gray-400 mb-4" />
        <div class="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
          <label class="relative cursor-pointer bg-transparent font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
            <span>Sube un archivo</span>
            <input id="file-upload" name="file-upload" type="file" class="sr-only">
          </label>
          <p class="pl-1">o arrastra y suelta</p>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">CSV, XLS, XLSX hasta 10MB</p>
      </div>
      <div class="mt-4 text-center">
        <a href="#" class="text-sm text-primary-600 hover:text-primary-800 font-medium">Descargar plantilla de ejemplo</a>
      </div>
      <template #footer>
        <Button variant="outline" @click="showImportModal = false" :disabled="isProcessing">Cancelar</Button>
        <Button variant="primary" @click="handleImport" :disabled="isProcessing">
          {{ isProcessing ? 'Importando...' : 'Importar' }}
        </Button>
      </template>
    </Modal>
  </div>
</template>
