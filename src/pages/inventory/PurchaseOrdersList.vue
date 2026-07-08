<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { purchaseOrders } from '@/stores/mockInventory'

const router = useRouter()
const activeFilter = ref('Todos')
const searchQuery = ref('')

const metrics = computed(() => {
  const all = purchaseOrders.value
  return [
    { label: 'Todas las órdenes', value: all.length.toString() },
    { label: 'Pedidos en curso', value: all.filter(po => po.status === 'Pedido').length.toString() },
    { label: 'Recibidas', value: all.filter(po => po.status === 'Recibido').length.toString() }
  ]
})

const filteredOrders = computed(() => {
  return purchaseOrders.value.filter(po => {
    if (searchQuery.value && !po.id.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    return true
  })
})

const createNew = () => {
  router.push('/admin/inventory/purchase-orders/new')
}

const goToDetail = (id) => {
  router.push(`/admin/inventory/purchase-orders/${id}`)
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Órdenes de compra</h1>
        <p class="text-sm text-gray-500 mt-1">Solicita productos a distribuidores u otras sucursales.</p>
      </div>
      <div class="flex space-x-3">
        <button @click="createNew" class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition shadow-sm">
          Crear orden de compra
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <!-- Filters -->
      <div class="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div class="flex items-center gap-3 w-1/3">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchQuery" type="text" class="block w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm" placeholder="Buscar y filtrar">
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white border-b border-gray-200">
              <th class="py-3 px-4 text-sm font-semibold text-gray-600 w-10">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              </th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Orden de compra</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Distribuidor</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Destino</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Estado</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Transferencia vinculada</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600">Recibido</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Total</th>
              <th class="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Llegada prevista</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="po in filteredOrders" :key="po.id" class="hover:bg-gray-50 transition cursor-pointer" @click="goToDetail(po.id)">
              <td class="py-3 px-4 text-sm text-gray-500" @click.stop>
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              </td>
              <td class="py-3 px-4 font-medium text-gray-900 hover:underline">#{{ po.id }}</td>
              <td class="py-3 px-4 text-sm text-gray-500">{{ po.distributor }}</td>
              <td class="py-3 px-4 text-sm text-gray-500">{{ po.destination }}</td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> {{ po.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-500">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> Transferido {{ po.linkedTransfer }}
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-500">{{ po.received }}</td>
              <td class="py-3 px-4 text-sm text-gray-900 text-right">{{ po.total }}</td>
              <td class="py-3 px-4 text-sm text-gray-500 text-right">{{ po.expectedArrival }}</td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="9" class="py-12 text-center text-gray-500">
                No hay órdenes de compra.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
