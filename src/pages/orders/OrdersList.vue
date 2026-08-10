<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/useOrdersStore'
import { useNotification } from '@/composables/useNotification'
import { Download, Plus, Printer, Archive, ArchiveRestore, Search, ChevronDown } from 'lucide-vue-next'

import PageHeader from '@/components/Layout/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Button from '@/components/ui/Button.vue'
import FormInput from '@/components/Form/FormInput.vue'
import Modal from '@/components/ui/Modal.vue'

const router = useRouter()
const { success: showNotification, info: showInfoNotification } = useNotification()

const ordersStore = useOrdersStore()
onMounted(() => {
  ordersStore.fetchOrders()
})

const activeMetric = ref('Pedidos')

const metrics = computed(() => {
  const all = ordersStore.orders || []
  const active = all.filter(o => !o.is_archived)
  
  const devoluciones = active.filter(o => o.payment_status === 'Reembolsado').reduce((acc, order) => {
    return acc + (order.total || 0)
  }, 0)

  const devolucionesFormatted = devoluciones > 0 ? `$${devoluciones.toLocaleString('es-CL')}` : '$0'

  const ventas = active.filter(o => o.payment_status === 'Pagado').reduce((acc, order) => {
    return acc + (order.total || 0)
  }, 0)
  const ventasFormatted = ventas > 0 ? `$${ventas.toLocaleString('es-CL')}` : '$0'

  const preparados = active.filter(o => o.fulfillment_status === 'Preparado' || o.fulfillment_status === 'Devuelto').length
  const entregados = active.filter(o => o.fulfillment_status === 'Entregado').length

  return [
    { label: 'Pedidos', value: active.length.toString(), hasGraph: true, filterable: true },
    { label: 'Total Ventas', value: ventasFormatted, hasGraph: true, filterable: true },
    { label: 'Devoluciones', value: devolucionesFormatted, hasGraph: false, filterable: true },
    { label: 'Pedidos preparados', value: preparados.toString(), hasGraph: true, filterable: true },
    { label: 'Pedidos entregados', value: entregados.toString(), hasGraph: true, filterable: true },
    { label: 'Tiempo desde el pedido', value: '0 horas', hasGraph: false, filterable: false },
  ]
})

const toggleMetricFilter = (metric) => {
  if (!metric.filterable) return
  
  if (activeMetric.value === metric.label) {
    activeMetric.value = 'Pedidos'
  } else {
    activeMetric.value = metric.label
  }
  selectedOrders.value = []
}

const orders = computed(() => ordersStore.orders || [])

const activeFilter = ref('Todos')
const showFilterDropdown = ref(false)
const selectedOrders = ref([])
const showExportModal = ref(false)
const showMoreActions = ref(false)
const searchQuery = ref('')

const selectedOrdersObjects = computed(() => {
  return orders.value.filter(o => selectedOrders.value.includes(o.id))
})

const filteredOrders = computed(() => {
  let result = orders.value

  if (activeFilter.value === 'Archivados') {
    result = result.filter(o => o.is_archived)
  } else {
    result = result.filter(o => !o.is_archived)
  }

  if (activeMetric.value === 'Devoluciones') {
    result = result.filter(o => o.payment_status === 'Reembolsado')
  } else if (activeMetric.value === 'Total Ventas') {
    result = result.filter(o => o.payment_status === 'Pagado')
  } else if (activeMetric.value === 'Pedidos preparados') {
    result = result.filter(o => o.fulfillment_status === 'Preparado')
  } else if (activeMetric.value === 'Pedidos entregados') {
    result = result.filter(o => o.fulfillment_status === 'Entregado')
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(o => 
      String(o.id).toLowerCase().includes(q) || 
      (o.client_name && o.client_name.toLowerCase().includes(q)) ||
      (o.customer && o.customer.first_name && o.customer.first_name.toLowerCase().includes(q))
    )
  }

  return result
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

const handleBatchPrepare = () => {
  orders.value.forEach(o => {
    if (selectedOrders.value.includes(o.id) && o.fulfillment_status !== 'Preparado') {
      ordersStore.updateOrder(o.id, { fulfillment_status: 'Preparado' })
    }
  })
  showNotification(`${selectedOrders.value.length} pedidos marcados como preparados.`)
  selectedOrders.value = []
}

const handleBatchCapture = () => {
  orders.value.forEach(o => {
    if (selectedOrders.value.includes(o.id) && o.payment_status !== 'Pagado') {
      ordersStore.updateOrder(o.id, { payment_status: 'Pagado' })
    }
  })
  showNotification(`Pagos capturados para ${selectedOrders.value.length} pedidos.`)
  selectedOrders.value = []
}

const goToOrderDetail = (id) => {
  router.push(`/admin/orders/${id}`)
}

const handleAction = (action) => {
  showMoreActions.value = false
  if (action === 'Exportar') {
    showExportModal.value = true
  } else if (action === 'Crear pedido') {
    router.push('/admin/orders/new')
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
      if (selectedOrders.value.includes(o.id)) ordersStore.updateOrder(o.id, { is_archived: true })
    })
    showNotification(`${selectedOrders.value.length} pedidos archivados.`)
    selectedOrders.value = []
  } else if (action === 'Desarchivar seleccionados') {
    orders.value.forEach(o => {
      if (selectedOrders.value.includes(o.id)) ordersStore.updateOrder(o.id, { is_archived: false })
    })
    showNotification(`${selectedOrders.value.length} pedidos desarchivados.`)
    selectedOrders.value = []
  }
}

const confirmExport = () => {
  showExportModal.value = false
  showNotification('Generando archivo CSV...')
  
  setTimeout(() => {
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

const getPaymentStatusClass = (status) => {
  switch (status) {
    case 'Pagado': return { bg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' }
    case 'Pendiente': return { bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' }
    case 'Reembolsado': return { bg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' }
    default: return { bg: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', dot: 'bg-gray-500' }
  }
}

const getFulfillmentStatusClass = (status) => {
  switch (status) {
    case 'Preparado': return { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' }
    case 'No preparado': return { bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' }
    case 'Devuelto': return { bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500' }
    default: return { bg: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', dot: 'bg-gray-500' }
  }
}

const columns = [
  { key: 'select', label: '' },
  { key: 'id', label: 'Pedido' },
  { key: 'date', label: 'Fecha' },
  { key: 'client', label: 'Cliente' },
  { key: 'canal', label: 'Canal' },
  { key: 'total', label: 'Total' },
  { key: 'payment_status', label: 'Estado del pago' },
  { key: 'fulfillment_status', label: 'Estado de preparación' },
  { key: 'items', label: 'Artículos' },
  { key: 'delivery', label: 'Forma de entrega' }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Vista Normal (se oculta al imprimir) -->
    <div class="print:hidden">
      
      <!-- Export Modal -->
      <Modal :is-open="showExportModal" title="Exportar pedidos" @close="showExportModal = false">
        <p class="text-sm text-gray-600 dark:text-gray-400">Exportarás los pedidos seleccionados o todos los pedidos a un archivo CSV.</p>
        <template #footer>
          <Button variant="outline" @click="showExportModal = false">Cancelar</Button>
          <Button variant="primary" @click="confirmExport">Exportar como CSV</Button>
        </template>
      </Modal>

      <!-- Header & Title -->
      <PageHeader title="Pedidos">
        <template #actions>
          <Button variant="outline" @click="handleAction('Exportar')" class="gap-2">
            <Download class="w-4 h-4" /> Exportar
          </Button>
          <div class="relative">
            <Button variant="outline" @click="showMoreActions = !showMoreActions" class="gap-2">
              Más acciones <ChevronDown class="w-4 h-4" />
            </Button>
            <div v-if="showMoreActions" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 overflow-hidden border border-gray-200 dark:border-gray-700">
              <a href="#" @click.prevent="handleAction('Imprimir pedidos')" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Printer class="w-4 h-4" /> Imprimir pedidos
              </a>
              <a v-if="activeFilter === 'Todos'" href="#" @click.prevent="handleAction('Archivar seleccionados')" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" :class="{'opacity-50 pointer-events-none': selectedOrders.length === 0}">
                <Archive class="w-4 h-4" /> Archivar seleccionados
              </a>
              <a v-if="activeFilter === 'Archivados'" href="#" @click.prevent="handleAction('Desarchivar seleccionados')" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" :class="{'opacity-50 pointer-events-none': selectedOrders.length === 0}">
                <ArchiveRestore class="w-4 h-4" /> Desarchivar seleccionados
              </a>
            </div>
          </div>
          <Button variant="primary" @click="handleAction('Crear pedido')" class="gap-2">
            <Plus class="w-4 h-4" /> Crear pedido
          </Button>
        </template>
      </PageHeader>

      <!-- Metrics Cards -->
      <Card class="p-0 mb-6 overflow-hidden flex divide-x divide-gray-200 dark:divide-gray-700 overflow-x-auto border border-gray-200 dark:border-gray-700">
        <div class="p-4 min-w-[120px] flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center font-medium">
            Hoy
          </div>
        </div>
        <div class="flex overflow-x-auto divide-x divide-gray-200 dark:divide-gray-700">
          <div v-for="(metric, index) in metrics" :key="index" 
               @click="toggleMetricFilter(metric)"
               :class="[
                 'px-6 py-5 min-w-[200px] flex-shrink-0 transition-colors',
                 metric.filterable ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20' : '',
                 activeMetric === metric.label ? 'bg-blue-50 dark:bg-blue-900/30 ring-inset ring-2 ring-primary-500 rounded-lg' : ''
               ]">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ metric.label }}</div>
            <div class="flex items-end">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Orders Table Container -->
      <Card class="p-0 border border-gray-200 dark:border-gray-700">
        
        <!-- Filter Bar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between relative bg-white dark:bg-gray-800 rounded-t-xl">
          <div class="flex items-center space-x-3 w-full max-w-2xl">
            <div class="relative">
              <Button variant="outline" @click="showFilterDropdown = !showFilterDropdown" class="gap-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                {{ activeFilter }} <ChevronDown class="w-4 h-4" />
              </Button>
              <div v-if="showFilterDropdown" class="absolute left-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="py-1">
                  <a href="#" @click.prevent="selectFilter('Todos')" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" :class="{'bg-gray-100 dark:bg-gray-700': activeFilter === 'Todos'}">Todos</a>
                  <a href="#" @click.prevent="selectFilter('Archivados')" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" :class="{'bg-gray-100 dark:bg-gray-700': activeFilter === 'Archivados'}">Archivados</a>
                </div>
              </div>
            </div>
            
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search class="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                v-model="searchQuery"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors" 
                placeholder="Buscar pedidos o clientes..."
              >
            </div>
          </div>
        </div>

        <!-- Action Bar (when selected) -->
        <div v-if="selectedOrders.length > 0" class="bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center text-sm">
          <span class="font-medium text-primary-700 dark:text-primary-300 mr-4">{{ selectedOrders.length }} seleccionados</span>
          <Button variant="outline" size="sm" @click="handleBatchPrepare" class="mr-3 bg-white dark:bg-gray-800">Preparar pedidos</Button>
          <Button variant="outline" size="sm" @click="handleBatchCapture" class="mr-3 bg-white dark:bg-gray-800">Capturar pagos</Button>
        </div>

        <!-- Table -->
        <DataTable :columns="columns" :data="filteredOrders" empty-message="No se encontraron pedidos.">
          <template #header-select>
            <input type="checkbox" v-model="selectAll" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
          </template>
          
          <template #cell-select="{ row }">
            <input type="checkbox" :checked="selectedOrders.includes(row.id)" @change="toggleOrderSelection(row.id)" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
          </template>

          <template #cell-id="{ row }">
            <span class="font-medium text-gray-900 dark:text-white cursor-pointer hover:underline hover:text-primary-600" @click="goToOrderDetail(row.id)">
              #{{ row.id }}
            </span>
          </template>

          <template #cell-client="{ row }">
            {{ row.client_name || (row.customer ? row.customer.first_name : 'Sin cliente') }}
          </template>

          <template #cell-canal="{ row }">
            {{ row.marketplace ? row.marketplace.name : 'Punto de Venta' }}
          </template>

          <template #cell-total="{ row }">
            <div v-if="row.payment_status === 'Reembolsado'">
              <span class="line-through text-gray-400">${{ (row.total || 0).toLocaleString('es-CL') }}</span>
              <span class="block font-medium">$0</span>
            </div>
            <span v-else class="font-medium text-gray-900 dark:text-white">${{ (row.total || 0).toLocaleString('es-CL') }}</span>
          </template>

          <template #cell-payment_status="{ row }">
            <span :class="getPaymentStatusClass(row.payment_status).bg" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
              <span :class="getPaymentStatusClass(row.payment_status).dot" class="w-1.5 h-1.5 rounded-full mr-1.5"></span> {{ row.payment_status || 'Pendiente' }}
            </span>
          </template>

          <template #cell-fulfillment_status="{ row }">
            <span :class="getFulfillmentStatusClass(row.fulfillment_status).bg" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
              <span :class="getFulfillmentStatusClass(row.fulfillment_status).dot" class="w-1.5 h-1.5 rounded-full mr-1.5"></span> {{ row.fulfillment_status || 'No preparado' }}
            </span>
          </template>

          <template #cell-items="{ row }">
            <div v-if="row.fulfillment_status === 'Devuelto'">
              <span class="line-through text-gray-400">{{ row.products ? row.products.length : 0 }} artículos</span>
              <span class="block text-orange-600 font-medium">0 artículos</span>
            </div>
            <span v-else>{{ row.products ? row.products.length : 0 }} artículos</span>
          </template>

          <template #cell-delivery="{ row }">
            {{ row.delivery_method || 'En tienda' }}
          </template>
        </DataTable>

        <!-- Pagination -->
        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800 rounded-b-xl">
          <div class="flex items-center space-x-2">
            <button @click="showInfoNotification('Estás en la primera página.')" class="p-1 border border-gray-300 dark:border-gray-600 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300 font-medium px-2">1 - 50</span>
            <button @click="showInfoNotification('No hay más páginas disponibles.')" class="p-1 border border-gray-300 dark:border-gray-600 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </Card>
      
      <!-- Nomenclatura / Leyenda de Estados -->
      <Card class="p-6 bg-gray-50/50 dark:bg-gray-800/50">
        <h4 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Nomenclatura de estados
        </h4>
        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex-1">
            <p class="font-medium text-gray-500 dark:text-gray-400 mb-3 text-xs uppercase tracking-wider">Estados de pago</p>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start">
                <span class="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 mr-3 flex-shrink-0"></span> 
                <span class="text-gray-600 dark:text-gray-400"><strong class="text-gray-900 dark:text-white font-medium">Pagado:</strong> El pago ha sido procesado exitosamente.</span>
              </li>
              <li class="flex items-start">
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-500 mt-1 mr-3 flex-shrink-0"></span> 
                <span class="text-gray-600 dark:text-gray-400"><strong class="text-gray-900 dark:text-white font-medium">Pendiente:</strong> Pedido creado pero el pago aún no se ha verificado o capturado.</span>
              </li>
              <li class="flex items-start">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 mr-3 flex-shrink-0"></span> 
                <span class="text-gray-600 dark:text-gray-400"><strong class="text-gray-900 dark:text-white font-medium">Reembolsado:</strong> El dinero ha sido devuelto al cliente parcial o totalmente.</span>
              </li>
            </ul>
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-500 dark:text-gray-400 mb-3 text-xs uppercase tracking-wider">Estados de preparación</p>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 mr-3 flex-shrink-0"></span> 
                <span class="text-gray-600 dark:text-gray-400"><strong class="text-gray-900 dark:text-white font-medium">Preparado:</strong> El pedido está empacado y listo para envío o entrega.</span>
              </li>
              <li class="flex items-start">
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-500 mt-1 mr-3 flex-shrink-0"></span> 
                <span class="text-gray-600 dark:text-gray-400"><strong class="text-gray-900 dark:text-white font-medium">No preparado:</strong> El pedido acaba de ingresar y aún no se arma en bodega.</span>
              </li>
              <li class="flex items-start">
                <span class="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1 mr-3 flex-shrink-0"></span> 
                <span class="text-gray-600 dark:text-gray-400"><strong class="text-gray-900 dark:text-white font-medium">Devuelto:</strong> Los artículos físicos regresaron a la bodega.</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
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
          <p><strong>Cliente:</strong> {{ order.client_name || 'Sin cliente' }}</p>
          <p><strong>Canal de venta:</strong> {{ order.marketplace?.name || 'Punto de Venta' }}</p>
          <p><strong>Método de entrega:</strong> {{ order.delivery_method || 'En tienda' }}</p>
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
              <td class="border border-gray-800 p-2 text-right">${{ (order.total || 0).toLocaleString('es-CL') }}</td>
              <td class="border border-gray-800 p-2 text-right">
                <span :class="{'line-through': order.paymentStatus === 'Reembolsado'}">${{ (order.total || 0).toLocaleString('es-CL') }}</span>
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
              <span v-else>${{ (order.total || 0).toLocaleString('es-CL') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
