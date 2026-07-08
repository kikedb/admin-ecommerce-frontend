<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { transfers } from '@/stores/mockInventory'

const route = useRoute()
const router = useRouter()
const tId = route.params.id

const transfer = computed(() => transfers.value.find(t => t.id === tId))

const goBack = () => {
  router.push('/admin/inventory/transfers')
}

const receiveItems = () => {
  alert('Recepción de artículos registrada')
}

</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12" v-if="transfer">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">#{{ transfer.id }}</h1>
        <div class="flex gap-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> {{ transfer.status }}
          </span>
        </div>
      </div>
      <div class="flex space-x-2">
        <button class="px-3 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium text-sm transition shadow-sm">
          Más acciones v
        </button>
        <button @click="receiveItems" class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition shadow-sm">
          Recibir inventario
        </button>
      </div>
    </div>

    <div class="flex gap-6 items-start">
      <!-- Left Column -->
      <div class="flex-1 space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <div class="text-sm text-gray-600 font-medium flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              {{ transfer.origin }} <span class="text-gray-400">→</span> 
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              {{ transfer.destination }}
            </div>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Productos</th>
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Recibido</th>
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Rechazado</th>
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="hover:bg-gray-50 transition">
                <td class="py-4 px-4 text-sm text-gray-500">Múltiples artículos en tránsito...</td>
                <td class="py-4 px-4 text-sm text-gray-900 text-right">{{ transfer.receivedCount }}</td>
                <td class="py-4 px-4 text-sm text-gray-500 text-right">0</td>
                <td class="py-4 px-4 text-sm text-gray-900 text-right">{{ transfer.itemsCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column -->
      <div class="w-80 space-y-6">
        <!-- Detalles -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Detalles</h3>
          <div class="space-y-4 text-sm">
            <div>
              <p class="text-gray-500 mb-1">Llegada prevista</p>
              <p class="text-gray-900">{{ transfer.expectedArrival }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-1">Estado</p>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{{ transfer.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
