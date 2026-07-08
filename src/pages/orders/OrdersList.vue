<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { globalOrders } from '@/stores/mockOrders'

const router = useRouter()

const metrics = computed(() => {
  const all = globalOrders.value
  const active = all.filter(o => o.status === 'active')
  
  // Calcular devoluciones sumando los totales de pedidos reembolsados
  const devoluciones = active.filter(o => o.paymentStatus === 'Reembolsado').reduce((acc, order) => {
    // Extraer número de algo como "$12.990" -> 12990
    const val = parseInt(order.total.replace(/[^0-9]/g, '')) || 0
    return acc + val
  }, 0)

  // Formatear devoluciones a moneda
  const devolucionesFormatted = devoluciones > 0 ? `$${devoluciones.toLocaleString('es-CL')}` : '$0'

  const preparados = active.filter(o => o.fulfillmentStatus === 'Preparado' || o.fulfillmentStatus === 'Devuelto').length

  return [
    { label: 'Pedidos', value: active.length.toString(), hasGraph: true },
    { label: 'Artículos pedidos', value: active.length.toString(), hasGraph: true }, // Simple aproximación
    { label: 'Devoluciones', value: devolucionesFormatted, hasGraph: false },
    { label: 'Pedidos preparados', value: preparados.toString(), hasGraph: true },
    { label: 'Pedidos entregados', value: '0', hasGraph: true },
    { label: 'Tiempo desde el pedido', value: '0 horas', hasGraph: false },
  ]
})

const orders = globalOrders

const activeFilter = ref('Todos')
const showFilterDropdown = ref(false)
const selectedOrders = ref([])
const showExportModal = ref(false)
const showMoreActions = ref(false)
const notification = ref(null)

const selectedOrdersObjects = computed(() => {
  return orders.value.filter(o => selectedOrders.value.includes(o.id))
})

const filteredOrders = computed(() => {
  if (activeFilter.value === 'Archivados') {
    return orders.value.filter(o => o.status === 'archived')
  }
  return orders.value.filter(o => o.status === 'active')
})

const selectAll = computed({
  get: () => selectedOrders.value.length === filteredOrders.value.length && filteredOrders.value.length > 0,
  set: (val) => {
    if (val) {
      selectedOrders.value = filteredOrders.value.map(o => o.id)
    } else {
      selectedOrders.value = []
    }
  }
})

const toggleOrderSelection = (id) => {
  const index = selectedOrders.value.indexOf(id)
  if (index === -1) {
    selectedOrders.value.push(id)
  } else {
    selectedOrders.value.splice(index, 1)
  }
}

const showNotification = (message) => {
  notification.value = message
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const goToOrderDetail = (id) => {
  router.push(`/admin/orders/${id}`)
}

const handleAction = (action) => {
  showMoreActions.value = false
  if (action === 'Exportar') {
    showExportModal.value = true
  } else if (action === 'Crear pedido') {
    showNotification('Navegando a Crear Pedido...')
    setTimeout(() => router.push('/admin/orders/new'), 500)
  } else if (action === 'Imprimir pedidos') {
    if (selectedOrders.value.length === 0) {
      showNotification('Selecciona al menos un pedido para imprimir.')
      return
    }
    setTimeout(() => {
      window.print()
    }, 100)
  } else if (action === 'Archivar seleccionados') {
    orders.value.forEach(o => {
      if (selectedOrders.value.includes(o.id)) o.status = 'archived'
    })
    showNotification(`${selectedOrders.value.length} pedidos archivados.`)
    selectedOrders.value = []
  } else if (action === 'Desarchivar seleccionados') {
    orders.value.forEach(o => {
      if (selectedOrders.value.includes(o.id)) o.status = 'active'
    })
    showNotification(`${selectedOrders.value.length} pedidos desarchivados.`)
    selectedOrders.value = []
  }
}

const confirmExport = () => {
  showExportModal.value = false
  showNotification('Generando archivo CSV...')
  
  setTimeout(() => {
    // Simular descarga de archivo
    const csvContent = "data:text/csv;charset=utf-8,Pedido,Fecha,Total\n" 
      + filteredOrders.value.filter(o => selectedOrders.value.length === 0 || selectedOrders.value.includes(o.id)).map(e => `${e.id},${e.date},${e.total}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pedidos_exportados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Exportación completada.')
  }, 800)
}

const selectFilter = (filter) => {
  activeFilter.value = filter
  showFilterDropdown.value = false
  selectedOrders.value = []
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Vista Normal (se oculta al imprimir) -->
    <div class="p-6 text-gray-800 relative print:hidden">
      
      <!-- Notification Toast -->
      <div v-if="notification" class="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded shadow-lg flex items-center space-x-3 transition-opacity duration-300">
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <span>{{ notification }}</span>
      </div>

      <!-- Export Modal -->
      <div v-if="showExportModal" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Exportar pedidos</h3>
            <button @click="showExportModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-gray-600">Exportarás los pedidos seleccionados o todos los pedidos a un archivo CSV.</p>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <button @click="showExportModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button @click="confirmExport" class="px-4 py-2 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800">Exportar como CSV</button>
          </div>
        </div>
      </div>

    <!-- Header & Title -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-3">
        <h1 class="text-2xl font-bold text-gray-900">Pedidos</h1>
        <button class="flex items-center px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
          Todas las sucursales
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>
      <div class="flex space-x-2 relative">
        <button @click="handleAction('Exportar')" class="px-3 py-1.5 border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium bg-white">Exportar</button>
        
        <div class="relative">
          <button @click="showMoreActions = !showMoreActions" class="px-3 py-1.5 border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium bg-white flex items-center">
            Más acciones
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <div v-if="showMoreActions" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div class="py-1">
              <a href="#" @click.prevent="handleAction('Imprimir pedidos')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Imprimir pedidos</a>
              <a v-if="activeFilter === 'Todos'" href="#" @click.prevent="handleAction('Archivar seleccionados')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" :class="{'opacity-50 pointer-events-none': selectedOrders.length === 0}">Archivar seleccionados</a>
              <a v-if="activeFilter === 'Archivados'" href="#" @click.prevent="handleAction('Desarchivar seleccionados')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" :class="{'opacity-50 pointer-events-none': selectedOrders.length === 0}">Desarchivar seleccionados</a>
            </div>
          </div>
        </div>

        <button @click="handleAction('Crear pedido')" class="px-3 py-1.5 bg-gray-900 text-white rounded shadow-sm hover:bg-gray-800 text-sm font-medium">Crear pedido</button>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-0 mb-6 overflow-hidden flex divide-x divide-gray-200 overflow-x-auto">
      <div class="p-4 min-w-[120px] flex-shrink-0 bg-gray-50">
        <div class="text-sm text-gray-500 mb-2 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Hoy
        </div>
      </div>
      <div v-for="(metric, index) in metrics" :key="index" class="p-4 min-w-[140px] flex-shrink-0">
        <p class="text-xs text-gray-500 font-medium mb-1">{{ metric.label }}</p>
        <div class="flex items-end">
          <span class="text-lg font-bold text-gray-900 mr-2">{{ metric.value }}</span>
          <span class="text-gray-400 text-xs mb-1">&minus;</span>
        </div>
        <div v-if="metric.hasGraph" class="mt-2 h-4 border-b border-dashed border-blue-400 w-1/2"></div>
      </div>
    </div>

    <!-- Orders Table Container -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      
      <!-- Filter Bar -->
      <div class="p-3 border-b border-gray-200 flex items-center justify-between relative">
        <div class="flex items-center space-x-3 w-full">
          <div class="relative">
            <button @click="showFilterDropdown = !showFilterDropdown" class="px-3 py-1.5 border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 text-sm font-medium bg-gray-50 flex items-center">
              {{ activeFilter }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div v-if="showFilterDropdown" class="absolute left-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div class="py-1">
                <a href="#" @click.prevent="selectFilter('Todos')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" :class="{'bg-gray-100': activeFilter === 'Todos'}">Todos</a>
                <a href="#" @click.prevent="selectFilter('Archivados')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" :class="{'bg-gray-100': activeFilter === 'Archivados'}">Archivados</a>
              </div>
            </div>
          </div>
          
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="text" class="block w-full pl-9 pr-3 py-1.5 border-none bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm" placeholder="Buscar y filtrar">
          </div>
        </div>
      </div>

      <!-- Action Bar (when selected) -->
      <div v-if="selectedOrders.length > 0" class="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center text-sm">
        <span class="font-medium text-gray-700 mr-4">{{ selectedOrders.length }} seleccionados</span>
        <button class="mr-3 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700">Preparar pedidos</button>
        <button class="mr-3 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700">Capturar pagos</button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="pl-4 pr-3 py-3 text-left text-xs font-medium text-gray-500 w-12">
                <input type="checkbox" v-model="selectAll" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Pedido</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Fecha <span class="text-gray-400">↓</span></th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Cliente</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Preparar antes de</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Canal</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Total</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Estado del pago</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Estado de preparación</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Artículos</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-700">Forma de entrega</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50 transition" :class="{'bg-gray-50': selectedOrders.includes(order.id)}">
              <td class="pl-4 pr-3 py-4 whitespace-nowrap">
                <input type="checkbox" :checked="selectedOrders.includes(order.id)" @change="toggleOrderSelection(order.id)" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer hover:underline" @click="goToOrderDetail(order.id)">
                #{{ order.id }}
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.date }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.client }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 w-24 whitespace-normal">{{ order.canal }}</td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                <div v-if="order.paymentStatus === 'Reembolsado'">
                  <span class="line-through text-gray-400">{{ order.total }}</span>
                  <span class="block font-medium">$0</span>
                </div>
                <span v-else>{{ order.total }}</span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">
                <span :class="order.paymentStatus === 'Reembolsado' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                  <span :class="order.paymentStatus === 'Reembolsado' ? 'bg-red-500' : 'bg-gray-500'" class="w-1.5 h-1.5 rounded-full mr-1.5"></span> {{ order.paymentStatus }}
                </span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm">
                <span :class="order.fulfillmentStatus === 'Devuelto' ? 'bg-orange-100 text-orange-800' : 'bg-gray-200 text-gray-800'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                  <span :class="order.fulfillmentStatus === 'Devuelto' ? 'bg-orange-500' : 'bg-gray-500'" class="w-1.5 h-1.5 rounded-full mr-1.5"></span> {{ order.fulfillmentStatus }}
                </span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 w-24 whitespace-normal">
                <div v-if="order.fulfillmentStatus === 'Devuelto'">
                  <span class="line-through text-gray-400">{{ order.items }}</span>
                  <span class="block text-orange-600 font-medium">0 artículos</span>
                </div>
                <span v-else>{{ order.items }}</span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 w-24 whitespace-normal">{{ order.deliveryMethod }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-center">
        <div class="flex items-center space-x-2">
          <button class="p-1 border border-gray-300 rounded text-gray-400 hover:text-gray-500 disabled:opacity-50" disabled>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <span class="text-sm text-gray-700">1-50</span>
          <button class="p-1 border border-gray-300 rounded text-gray-400 hover:text-gray-500 disabled:opacity-50" disabled>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </div> <!-- Fin de vista normal -->

  <!-- Vista exclusiva de impresión -->
  <div class="hidden print:block p-8 bg-white w-full text-black">
    <div v-for="order in selectedOrdersObjects" :key="'print-'+order.id" class="break-after-page mb-8">
      <div class="border-b-2 border-black pb-4 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-4xl font-bold">Pedido #{{ order.id }}</h1>
            <p class="text-gray-600 mt-2">Documento generado el {{ new Date().toLocaleDateString() }}</p>
          </div>
          <div class="text-right uppercase">
            <span v-if="order.paymentStatus === 'Reembolsado'" class="block text-red-600 font-bold text-xl mb-1">REEMBOLSADO</span>
            <span v-else class="block font-bold text-xl mb-1">{{ order.paymentStatus }}</span>
            
            <span v-if="order.fulfillmentStatus === 'Devuelto'" class="block text-orange-600 font-bold text-lg">DEVUELTO</span>
            <span v-else class="block font-bold text-lg text-gray-500">{{ order.fulfillmentStatus }}</span>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h2 class="text-lg font-bold mb-2">Detalles del pedido</h2>
        <p><strong>Cliente:</strong> {{ order.client }}</p>
        <p><strong>Canal de venta:</strong> {{ order.canal }}</p>
        <p><strong>Método de entrega:</strong> {{ order.deliveryMethod }}</p>
      </div>

      <table class="w-full border-collapse border border-gray-800 mb-6 text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-800 p-2 text-left">Artículo</th>
            <th class="border border-gray-800 p-2 text-center">Cantidad</th>
            <th class="border border-gray-800 p-2 text-right">Precio unitario</th>
            <th class="border border-gray-800 p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-800 p-2">
              Producto simulado
              <span v-if="order.fulfillmentStatus === 'Devuelto'" class="ml-2 px-1 text-xs bg-orange-200 text-orange-800 rounded">Devuelto</span>
            </td>
            <td class="border border-gray-800 p-2 text-center">
              <span :class="{'line-through': order.fulfillmentStatus === 'Devuelto'}">1</span>
            </td>
            <td class="border border-gray-800 p-2 text-right">{{ order.total }}</td>
            <td class="border border-gray-800 p-2 text-right">
              <span :class="{'line-through': order.paymentStatus === 'Reembolsado'}">{{ order.total }}</span>
              <span v-if="order.paymentStatus === 'Reembolsado'" class="block font-bold text-red-600">$0</span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="flex justify-end">
        <div class="w-64">
          <div class="flex justify-between font-bold text-lg border-t-2 border-black pt-2">
            <span>Total neto:</span>
            <span v-if="order.paymentStatus === 'Reembolsado'">$0</span>
            <span v-else>{{ order.total }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
