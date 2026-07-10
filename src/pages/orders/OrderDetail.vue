<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalOrders } from '@/stores/mockOrders'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id || '5888'

const showMoreActions = ref(false)
const showRefundModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showDuplicateModal = ref(false)
const { success: showNotification } = useNotification()

const isArchived = ref(true)
const isWithinSernacWindow = ref(true)

const goBack = () => {
  router.push('/admin/orders')
}

const goToReturn = () => {
  router.push(`/admin/orders/${orderId}/return`)
}

const handleAction = async (actionName) => {
  showMoreActions.value = false
  await nextTick() // Esperar a que Vue actualice el DOM y cierre el menú

  if (actionName === 'Imprimir página del pedido' || actionName === 'Imprimir notas de entrega') {
    setTimeout(() => {
      window.print()
    }, 100)
  } else if (actionName === 'Duplicar') {
    showDuplicateModal.value = true
  } else if (actionName === 'Desarchivar') {
    isArchived.value = !isArchived.value
    showNotification(isArchived.value ? 'Pedido archivado.' : 'Pedido desarchivado.')
  } else if (actionName === 'Ver página de estado del pedido') {
    window.open(`/estado-pedido/${orderId}`, '_blank')
  } else if (actionName === 'Eliminar pedido') {
    showDeleteModal.value = true
  }
}

const handleRefund = () => {
  showRefundModal.value = true
}

const handleEdit = () => {
  showEditModal.value = true
}

const prevOrder = () => {
  const prevId = parseInt(orderId) - 1
  router.push(`/admin/orders/${prevId}`)
}

const nextOrder = () => {
  const nextId = parseInt(orderId) + 1
  router.push(`/admin/orders/${nextId}`)
}

const isRefunded = ref(false)
const refundAmount = ref('12990')
const restockItems = ref(true)
const refundReason = ref('')

const timelineEvents = ref([
  { id: 1, text: 'Este pedido se ha archivado.', time: 'hace 11 minutos', highlight: false },
  { id: 2, text: 'Bilbola marcó 1 artículo como preparado desde VENTA VITACURA.', time: 'hace 11 minutos', highlight: true },
  { id: 3, text: 'Se procesó un pago por 12.990 $ CLP en Tarjeta De Crédito.', time: 'hace 11 minutos', highlight: false }
])

const confirmRefund = () => {
  showRefundModal.value = false
  isRefunded.value = true
  
  // Actualizar estado global para que se refleje en la tabla principal
  const order = globalOrders.value.find(o => o.id == orderId)
  if (order) {
    order.paymentStatus = 'Reembolsado'
    if (restockItems.value) {
      order.fulfillmentStatus = 'Devuelto'
    }
  }

  timelineEvents.value.unshift({
    id: Date.now(),
    text: `Se reembolsó ${refundAmount.value} $ CLP. Motivo: ${refundReason.value || 'No especificado'}. ${restockItems.value ? 'Se devolvió 1 artículo al inventario.' : ''}`,
    time: 'Justo ahora',
    highlight: true
  })
  
  showNotification('Reembolso procesado exitosamente.')
}

const confirmEdit = () => {
  showEditModal.value = false
  showNotification('Pedido actualizado exitosamente.')
}

const confirmDelete = () => {
  showDeleteModal.value = false
  showNotification('Pedido eliminado.')
  setTimeout(() => {
    router.push('/admin/orders')
  }, 1000)
}

const confirmDuplicate = () => {
  showDuplicateModal.value = false
  showNotification('Pedido duplicado.')
  const newId = `${orderId}-D1`
  
  // Agregar el pedido duplicado al array global para que aparezca en la lista
  const originalOrder = globalOrders.value.find(o => o.id == orderId)
  if (originalOrder) {
    globalOrders.value.unshift({
      ...originalOrder,
      id: newId,
      date: 'Justo ahora',
      status: 'active'
    })
  } else {
    globalOrders.value.unshift({
      id: newId, date: 'Justo ahora', client: 'Sin cliente', canal: 'Point of Sale', total: '$0', paymentStatus: 'Pendiente', fulfillmentStatus: 'No preparado', deliveryStatus: '', items: '0 artículos', deliveryMethod: 'En tienda', status: 'active'
    })
  }

  setTimeout(() => {
    router.push(`/admin/orders/${newId}`)
  }, 1000)
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800 relative">
    
    <!-- Refund Modal -->
    <div v-if="showRefundModal" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Reembolsar pedido #{{ orderId }}</h3>
          <button @click="showRefundModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Monto a reembolsar ($)</label>
            <input type="number" v-model="refundAmount" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo del reembolso</label>
            <input type="text" v-model="refundReason" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Cliente canceló">
          </div>
          <div class="flex items-start mt-4">
            <div class="flex items-center h-5">
              <input id="restock" v-model="restockItems" type="checkbox" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
            </div>
            <div class="ml-3 text-sm">
              <label for="restock" class="font-medium text-gray-700">Devolver artículos al inventario</label>
              <p class="text-gray-500">Se devolverá 1 artículo a la sucursal VENTA VITACURA.</p>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showRefundModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="confirmRefund" class="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700">Reembolsar {{ refundAmount }} $</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Editar pedido #{{ orderId }}</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600 mb-4">Solo puedes editar notas, etiquetas o la información de contacto en este modo. Para modificar artículos, debes cancelar el pedido o crear una nueva versión.</p>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notas del pedido</label>
            <textarea rows="3" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Añadir nota al pedido..."></textarea>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showEditModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="confirmEdit" class="px-4 py-2 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800">Guardar cambios</button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Eliminar pedido #{{ orderId }}</h3>
          <button @click="showDeleteModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600 mb-4">¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Duplicate Modal -->
    <div v-if="showDuplicateModal" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Duplicar pedido #{{ orderId }}</h3>
          <button @click="showDuplicateModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600 mb-4">Se creará un nuevo pedido con los mismos artículos y detalles del cliente. ¿Deseas continuar?</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showDuplicateModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="confirmDuplicate" class="px-4 py-2 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800">Duplicar</button>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-start">
      <div>
        <div class="flex items-center space-x-2 text-sm text-gray-500 mb-1">
          <button @click="goBack" class="hover:text-gray-900 transition flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Pedidos
          </button>
        </div>
        <div class="flex items-center space-x-3 mb-2">
          <h1 class="text-2xl font-bold text-gray-900">#{{ orderId }}</h1>
          <span v-if="!isRefunded" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> Pagado
          </span>
          <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> Reembolsado
          </span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> Preparado
          </span>
          <span v-if="isArchived" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            Archivado
          </span>
        </div>
        <p class="text-sm text-gray-500 flex items-center">
          Recibo #16-1011 - 7 de julio de 2026 a las 7:35 p. m. de 
          <svg class="w-4 h-4 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> 
          Point of Sale - VENTA VITACURA
        </p>
      </div>

      <div class="flex space-x-2 mt-4 md:mt-0 print:hidden">
        <button v-if="!isRefunded" @click="handleRefund" class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium">Reembolsar</button>
        
        <div class="relative group">
          <button @click="goToReturn" 
                  :disabled="!isWithinSernacWindow"
                  :class="{'opacity-50 cursor-not-allowed bg-gray-100': !isWithinSernacWindow}"
                  class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium">
            Devolver
          </button>
          <div v-if="!isWithinSernacWindow" class="absolute hidden group-hover:block w-48 bg-gray-800 text-white text-xs rounded p-2 -bottom-10 left-1/2 transform -translate-x-1/2 z-50">
            Plazo de retracto (SERNAC) expirado.
          </div>
        </div>

        <button @click="handleEdit" class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium">Editar</button>
        
        <div class="relative">
          <button @click="showMoreActions = !showMoreActions" class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium flex items-center">
            Más acciones
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <!-- Dropdown menu -->
          <div v-if="showMoreActions" class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a href="#" @click.prevent="isWithinSernacWindow = !isWithinSernacWindow" class="block px-4 py-2 text-xs text-blue-600 hover:bg-gray-100" role="menuitem">
                [TEST] Alternar regla SERNAC
              </a>
              <div class="border-t border-gray-100"></div>
              <a href="#" @click.prevent="handleAction('Imprimir página del pedido')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Imprimir página del pedido</a>
              <div class="border-t border-gray-100"></div>
              <a href="#" @click.prevent="handleAction('Duplicar')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Duplicar</a>
              <a href="#" @click.prevent="handleAction('Desarchivar')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">{{ isArchived ? 'Desarchivar' : 'Archivar' }}</a>
              <a href="#" @click.prevent="handleAction('Ver página de estado del pedido')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Ver página de estado del pedido</a>
              <a href="#" @click.prevent="handleAction('Eliminar pedido')" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">Eliminar pedido</a>
            </div>
          </div>
        </div>

        <div class="flex space-x-1 border border-gray-300 rounded shadow-sm bg-white overflow-hidden">
          <button @click="prevOrder" class="px-2 py-1.5 text-gray-500 hover:bg-gray-50 border-r border-gray-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
          </button>
          <button @click="nextOrder" class="px-2 py-1.5 text-gray-500 hover:bg-gray-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Column (Main) -->
      <div class="flex-1 space-y-6">
        
        <!-- Fulfillment Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div class="flex justify-between items-center mb-4">
            <div class="flex space-x-2 items-center">
              <span v-if="!isRefunded || !restockItems" class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Preparado
              </span>
              <span v-else class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                Devuelto
              </span>
              <span class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                VENTA VITACURA
              </span>
            </div>
            <div class="text-sm text-gray-500 flex items-center">
              #{{ orderId }}-F1
              <button class="ml-2 text-gray-400 hover:text-gray-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg></button>
            </div>
          </div>

          <div class="border-l-2 border-gray-200 ml-3 pl-4 py-2 space-y-4 mb-4">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              7 de julio de 2026
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg>
              En tienda
            </div>
          </div>

          <div class="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-gray-50/50">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                <!-- Image Placeholder -->
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p class="text-sm font-medium text-blue-600 hover:underline cursor-pointer">Sujetador de chupete conejo rayas azul</p>
                <p class="text-xs text-gray-500">EBAB0464</p>
                <span v-if="isRefunded && restockItems" class="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
                  Devuelto 1
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-6 text-sm">
              <div class="text-gray-600">$12.990 &times; <span class="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 ml-1">1</span></div>
              <div class="font-medium">$12.990</div>
            </div>
          </div>
        </div>

        <!-- Payment Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div class="flex mb-4">
            <span v-if="!isRefunded" class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
              <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              Pagado
            </span>
            <span v-else class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
              <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              Reembolsado
            </span>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Subtotal</span>
              <span class="text-gray-500">1 artículo</span>
              <span class="font-medium text-gray-900">12.990 $</span>
            </div>
            <div class="flex justify-between items-center font-medium">
              <span class="text-gray-900">Total</span>
              <span class="text-gray-900">12.990 $</span>
            </div>
            <div class="pt-3 border-t border-gray-200 flex justify-between items-center mt-3">
              <span class="text-gray-600">Pagado por el cliente</span>
              <span class="font-medium text-gray-900">12.990 $</span>
            </div>
            <div v-if="isRefunded" class="flex justify-between items-center text-red-600">
              <span>Reembolsado</span>
              <span class="font-medium">- {{ refundAmount }} $</span>
            </div>
            <div v-if="isRefunded" class="pt-3 border-t border-gray-200 flex justify-between items-center mt-3">
              <span class="text-gray-900 font-bold">Total neto</span>
              <span class="font-bold text-gray-900">{{ 12990 - parseInt(refundAmount) }} $</span>
            </div>
          </div>
        </div>

        <!-- Bloques Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Bloques
          </h3>
          <button class="w-full py-2 border border-gray-300 border-dashed rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-sm transition">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Bloque
          </button>
        </div>

        <!-- Timeline Card -->
        <div class="mt-8">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Cronología</h3>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div class="flex items-start space-x-3 mb-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs">
                U
              </div>
              <div class="flex-1">
                <textarea 
                  rows="2" 
                  class="w-full border border-gray-300 rounded-lg shadow-sm p-3 text-sm focus:ring-blue-500 focus:border-blue-500 resize-none" 
                  placeholder="Deja un comentario..."
                ></textarea>
              </div>
            </div>
            <div class="flex justify-between items-center bg-gray-50 px-3 py-2 -mx-4 -mb-4 rounded-b-lg border-t border-gray-200">
              <div class="flex space-x-2 text-gray-500">
                <button class="p-1 hover:text-gray-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                <button class="p-1 hover:text-gray-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg></button>
                <button class="p-1 hover:text-gray-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg></button>
                <button class="p-1 hover:text-gray-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg></button>
              </div>
              <button class="px-4 py-1.5 bg-gray-100 text-gray-400 cursor-not-allowed rounded text-sm font-medium">Publicar</button>
            </div>
          </div>
          
          <div class="text-xs text-gray-400 text-right mb-6">Solo tú y otros empleados pueden ver los comentarios</div>

          <!-- Timeline items -->
          <div class="relative pl-6 border-l-2 border-gray-200 ml-4 space-y-6">
            <span class="absolute -left-1.5 top-0 bg-gray-200 w-3 h-3 rounded-full border-2 border-white"></span>
            
            <div class="text-sm">
              <p class="text-xs text-gray-500 font-medium mb-2 -ml-6">Hoy</p>
            </div>

            <div v-for="event in timelineEvents" :key="event.id" class="relative text-sm">
              <span class="absolute -left-7 top-1.5 bg-gray-400 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              <div class="flex justify-between">
                <span class="text-gray-700" :class="{'font-medium': event.highlight}">{{ event.text }}</span>
                <span class="text-gray-400">{{ event.time }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column (Sidebar) -->
      <div class="w-full lg:w-80 flex-shrink-0 space-y-4">
        
        <!-- Notes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-semibold text-gray-900">Notas</h3>
            <button class="text-gray-400 hover:text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
          </div>
          <p class="text-sm text-gray-500">No hay notas del cliente</p>
        </div>

        <!-- Client -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Cliente</h3>
            <button class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
            </button>
          </div>
          
          <div class="relative mb-4">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="text" class="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Buscar o crear un cliente">
          </div>

          <div class="space-y-4">
            <div>
              <h4 class="text-xs font-semibold text-gray-900 mb-1">Información de contacto</h4>
              <p class="text-sm text-gray-500">No se proporcionó correo electrónico</p>
              <p class="text-sm text-gray-500">Sin número de teléfono</p>
            </div>
            
            <div>
              <h4 class="text-xs font-semibold text-gray-900 mb-1">Dirección de envío</h4>
              <p class="text-sm text-gray-500">No se proporcionó dirección de envío</p>
            </div>

            <div>
              <h4 class="text-xs font-semibold text-gray-900 mb-1">Dirección de facturación</h4>
              <p class="text-sm text-gray-500">No se proporcionó dirección de facturación</p>
            </div>
          </div>
        </div>

        <!-- Conversion Summary -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Resumen de conversión</h3>
          <p class="text-sm text-gray-500 mb-2">No hay detalles de la conversión disponibles para este pedido</p>
          <a href="#" class="text-sm text-blue-600 hover:underline">Más información</a>
        </div>

        <!-- Order Risk -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-semibold text-gray-900">Riesgo del pedido</h3>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p class="text-sm text-gray-500">Análisis no disponible</p>
        </div>

        <!-- Tags -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Etiquetas</h3>
            <button class="text-gray-400 hover:text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <!-- Emtpy tags input style -->
            <input type="text" class="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" placeholder="">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
