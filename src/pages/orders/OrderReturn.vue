<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { globalOrders } from '@/stores/mockOrders'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id || '5888'

const showBanner = ref(true)
const showProductsModal = ref(false)
const notification = ref(null)
const fileInput = ref(null)

const goBack = () => {
  router.push(`/admin/orders/${orderId}`)
}

const showNotification = (message) => {
  notification.value = message
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const handleAction = (actionName) => {
  showNotification(`Acción ejecutada: ${actionName}`)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    showNotification(`Archivo seleccionado: ${file.name}`)
  }
}

const openProductsModal = () => {
  showProductsModal.value = true
}

const confirmAddProducts = () => {
  showProductsModal.value = false
  showNotification('Productos agregados a la devolución.')
}

const submitReturn = () => {
  showNotification('Devolución creada exitosamente.')
  
  // Actualizar estado global
  const order = globalOrders.value.find(o => o.id == orderId)
  if (order) {
    order.fulfillmentStatus = 'Devuelto'
  }

  setTimeout(() => {
    router.push(`/admin/orders/${orderId}`)
  }, 1500)
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800 relative">

    <!-- Notification Toast -->
    <div v-if="notification" class="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded shadow-lg flex items-center space-x-3 transition-opacity duration-300">
      <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span>{{ notification }}</span>
    </div>

    <!-- Products Modal -->
    <div v-if="showProductsModal" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Seleccionar productos a devolver</h3>
          <button @click="showProductsModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4 max-h-64 overflow-y-auto">
          <!-- Dummy Product List -->
          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gray-200 rounded"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Babero bebé gris</p>
                <p class="text-xs text-gray-500">$5.990</p>
              </div>
            </div>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gray-200 rounded"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Conjunto invierno 6M</p>
                <p class="text-xs text-gray-500">$24.990</p>
              </div>
            </div>
          </label>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showProductsModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="confirmAddProducts" class="px-4 py-2 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800">Agregar productos</button>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-start">
      <div>
        <div class="flex items-center space-x-2 text-sm text-gray-500 mb-1">
          <button @click="goBack" class="hover:text-gray-900 transition flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <span class="text-gray-900 font-medium cursor-pointer hover:underline" @click="goBack">#{{ orderId }}</span>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-bold text-lg">Return and exchange</span>
        </div>
      </div>
    </div>

    <!-- Banner -->
    <div v-if="showBanner" class="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-start">
      <div class="flex">
        <svg class="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <div>
          <h4 class="text-sm font-semibold text-blue-900 mb-1">Ahorra tiempo con las devoluciones de autoservicio</h4>
          <p class="text-sm text-blue-800 mb-3">Permite a los clientes solicitar devoluciones desde su cuenta, mientras las reglas de devolución gestionan la elegibilidad y los cargos.</p>
          <button @click="handleAction('Ir a devoluciones de autoservicio')" class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium">Ir a devoluciones de autoservicio</button>
        </div>
      </div>
      <button @click="showBanner = false" class="text-blue-500 hover:text-blue-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Column (Main) -->
      <div class="flex-1 space-y-6">
        
        <!-- Selecciona cantidad -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Selecciona la cantidad a devolver</h3>
          
          <div class="flex justify-between items-center text-sm text-gray-500 mb-3">
            <span>#{{ orderId }}-F1</span>
            <span>Enviado desde VENTA VITACURA</span>
          </div>

          <div class="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-gray-50/50">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Sujetador de chupete conejo rayas azul</p>
                <p class="text-xs text-gray-500">EBAB0464</p>
              </div>
            </div>
            <div class="flex items-center space-x-4 text-sm">
              <div class="text-gray-600">$12.990</div>
              <div class="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                <input type="number" value="0" min="0" max="1" class="w-12 text-center border-none py-1 px-2 text-sm focus:ring-0">
                <span class="text-gray-500 pr-2 border-l border-gray-200 pl-2">/ 1</span>
              </div>
              <div class="text-gray-600 w-12 text-right">$0</div>
            </div>
          </div>
        </div>

        <!-- Cambiar articulos -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 border-dashed">Cambiar artículos</h3>
          <button @click="openProductsModal" class="px-3 py-1.5 border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium flex items-center bg-white">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Agregar productos
          </button>
        </div>

        <!-- Opciones de envio -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Opciones de envío de devolución</h3>
          
          <div class="flex items-start space-x-3 mb-4">
            <input type="radio" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-900">Subir una etiqueta de devolución</label>
              
              <!-- Hidden File Input -->
              <input type="file" ref="fileInput" class="hidden" accept=".pdf,.png,.jpg,.jpeg" @change="handleFileChange">

              <div @click="triggerFileInput" class="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer">
                <button class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium mb-2 pointer-events-none">Agregar archivos</button>
                <p class="text-xs text-gray-500">Accepts .pdf, .png, and .jpg</p>
              </div>

              <div class="mt-3">
                <a href="#" @click.prevent="handleAction('Usar URL de etiqueta')" class="text-sm text-blue-600 hover:underline">Usar URL de etiqueta de devolución en su lugar</a>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Número de seguimiento</label>
                  <input type="text" class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Empresa de transporte</label>
                  <div class="relative">
                    <select class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white">
                      <option></option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- Right Column (Sidebar) -->
      <div class="w-full lg:w-80 flex-shrink-0">
        
        <!-- Summary -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Resumen</h3>
          <p class="text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">Ningún artículo seleccionado</p>
          <button @click="submitReturn" class="w-full px-4 py-2 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-900 text-sm font-medium opacity-90 transition">Crear devolución</button>
        </div>

      </div>
    </div>
  </div>
</template>
