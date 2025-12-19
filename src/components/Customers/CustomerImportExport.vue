<template>
  <div class="space-y-6">
    <!-- Sección Export -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Exportar Clientes</h3>
          <p class="text-sm text-gray-600 mt-1">
            Descarga todos los clientes en formato Excel
          </p>
        </div>
        <button
          @click="handleExport"
          :disabled="isExporting"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          <svg v-if="!isExporting" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isExporting ? 'Exportando...' : 'Descargar Excel' }}
        </button>
      </div>
    </div>

    <!-- Sección Import -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Importar Clientes</h3>
      
      <div class="mb-4">
        <button
          @click="downloadTemplate"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
        >
          Descargar plantilla de ejemplo
        </button>
      </div>

      <!-- Drag & Drop Area -->
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        :class="[
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        ]"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          @change="handleFileSelect"
          class="hidden"
        />

        <div v-if="!selectedFile">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <p class="mt-2 text-sm text-gray-600">
            Arrastra un archivo Excel o CSV aquí
          </p>
          <button
            @click="$refs.fileInput.click()"
            class="mt-3 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Seleccionar archivo
          </button>
          <p class="mt-2 text-xs text-gray-500">
            Formatos permitidos: .xlsx, .xls, .csv (máx. 10MB)
          </p>
        </div>

        <div v-else class="space-y-4">
          <div class="flex items-center justify-center space-x-2">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</span>
            <span class="text-xs text-gray-500">({{ formatFileSize(selectedFile.size) }})</span>
          </div>

          <div class="flex justify-center space-x-3">
            <button
              @click="handleImport"
              :disabled="isImporting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {{ isImporting ? 'Importando...' : 'Importar Ahora' }}
            </button>
            <button
              @click="clearFile"
              :disabled="isImporting"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="isImporting" class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 50%"></div>
        </div>
        <p class="text-sm text-gray-600 mt-2 text-center">Procesando archivo...</p>
      </div>

      <!-- Mensajes -->
      <div v-if="message.text" :class="[
        'mt-4 p-4 rounded-lg',
        message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      ]">
        <div class="flex items-start">
          <svg v-if="message.type === 'success'" class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1">
            <p class="font-medium">{{ message.text }}</p>
            <p v-if="message.details" class="text-sm mt-1">{{ message.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import customersService from '@/services/customers.service'

const emit = defineEmits(['import-success'])

const customerStore = useCustomerStore()

const isExporting = ref(false)
const isImporting = ref(false)
const isDragging = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)
const message = ref({ text: '', type: '', details: '' })

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv']

async function handleExport() {
  isExporting.value = true
  message.value = { text: '', type: '', details: '' }
  
  try {
    await customerStore.exportCustomers()
    message.value = {
      text: '✓ Exportación exitosa',
      type: 'success',
      details: 'El archivo se ha descargado correctamente'
    }
  } catch (error) {
    message.value = {
      text: 'Error al exportar',
      type: 'error',
      details: error.response?.data?.message || 'No se pudo completar la exportación'
    }
  } finally {
    isExporting.value = false
  }
}

async function downloadTemplate() {
  try {
    const response = await customersService.getImportTemplate()
    console.log('Plantilla:', response.data)
    message.value = {
      text: 'Plantilla de ejemplo',
      type: 'success',
      details: 'Revisa la consola del navegador para ver la estructura de columnas'
    }
  } catch (error) {
    message.value = {
      text: 'Error al obtener plantilla',
      type: 'error',
      details: error.response?.data?.message || 'No se pudo descargar la plantilla'
    }
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  validateAndSetFile(file)
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  validateAndSetFile(file)
}

function validateAndSetFile(file) {
  message.value = { text: '', type: '', details: '' }
  
  if (!file) return
  
  const extension = '.' + file.name.split('.').pop().toLowerCase()
  
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    message.value = {
      text: 'Formato no válido',
      type: 'error',
      details: `Solo se permiten archivos: ${ALLOWED_EXTENSIONS.join(', ')}`
    }
    return
  }
  
  if (file.size > MAX_FILE_SIZE) {
    message.value = {
      text: 'Archivo demasiado grande',
      type: 'error',
      details: `El tamaño máximo permitido es 10MB`
    }
    return
  }
  
  selectedFile.value = file
}

async function handleImport() {
  if (!selectedFile.value) return
  
  isImporting.value = true
  message.value = { text: '', type: '', details: '' }
  
  try {
    const result = await customerStore.importCustomers(selectedFile.value)
    message.value = {
      text: '✓ Importación exitosa',
      type: 'success',
      details: result.message || `Se importaron ${result.imported || 0} clientes correctamente`
    }
    
    clearFile()
    emit('import-success')
    
  } catch (error) {
    const errorData = error.response?.data
    message.value = {
      text: 'Error en la importación',
      type: 'error',
      details: errorData?.message || errorData?.errors?.[0] || 'No se pudo completar la importación'
    }
  } finally {
    isImporting.value = false
  }
}

function clearFile() {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>
