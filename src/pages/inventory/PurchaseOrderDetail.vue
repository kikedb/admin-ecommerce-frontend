<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { purchaseOrders } from '@/stores/mockInventory'

const route = useRoute()
const router = useRouter()
const poId = route.params.id

const po = computed(() => purchaseOrders.value.find(p => p.id === poId))

const goBack = () => {
  router.push('/admin/inventory/purchase-orders')
}

const newComment = ref('')

</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12" v-if="po">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">#{{ po.id }}</h1>
        <div class="flex gap-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> {{ po.status }}
          </span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> Transferido
          </span>
        </div>
      </div>
      <div class="flex space-x-2">
        <button class="px-3 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium text-sm transition shadow-sm">
          Más acciones v
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
              {{ po.distributor }} <span class="text-gray-400">→</span> 
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              {{ po.destination }}
            </div>
            <button class="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100">Editar</button>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Productos</th>
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU del distribuidor</th>
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Cantidad</th>
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Costo</th>
                <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in po.items" :key="item.sku" class="hover:bg-gray-50 transition">
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{{ item.name }}</p>
                      <p class="text-xs text-gray-500">{{ item.sku }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4 text-sm text-gray-500">-</td>
                <td class="py-4 px-4 text-sm text-gray-900 text-right">{{ item.quantity }}</td>
                <td class="py-4 px-4 text-sm text-gray-500 text-right">{{ item.cost }}</td>
                <td class="py-4 px-4 text-sm text-gray-900 text-right">{{ item.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cronología -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Cronología</h3>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs">
                U
              </div>
              <input v-model="newComment" type="text" class="flex-1 border border-gray-300 rounded-lg text-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Deja un comentario...">
              <button class="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium text-sm">Publicar</button>
            </div>
            <div class="text-xs text-center text-gray-500 mb-6">Solo tú y otros empleados pueden ver los comentarios</div>
            
            <div class="space-y-6 pl-4 border-l-2 border-gray-100 ml-4">
              <div v-for="(event, idx) in po.timeline" :key="idx" class="relative pl-6">
                <div class="absolute -left-[33px] top-1 w-4 h-4 bg-gray-300 rounded-full border-4 border-white"></div>
                <div class="text-xs text-gray-500 mb-1">{{ event.date }}</div>
                <div class="text-sm text-gray-700">
                  <span class="font-semibold">{{ event.user }}</span> {{ event.action }}
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ event.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="w-80 space-y-6">
        <!-- Resumen de Costos -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Resumen de costos</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Detalles de la orden</span>
              <span>{{ po.total }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Impuestos (incluidos)</span>
              <span>$0</span>
            </div>
            <div class="pt-3 border-t border-gray-100 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{{ po.total }}</span>
            </div>
          </div>
        </div>

        <!-- Transferencia Vinculada -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Transferencia vinculada</h3>
          <div v-if="po.linkedTransfer && po.linkedTransfer !== '--'" @click="router.push('/admin/inventory/transfers/' + po.linkedTransfer.replace('#', ''))" class="flex items-center gap-2 text-sm text-gray-900 hover:text-blue-600 cursor-pointer group transition-colors">
            <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            <span class="font-medium underline decoration-transparent group-hover:decoration-blue-600 underline-offset-2">{{ po.linkedTransfer }}</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 ml-auto">
              <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> Pendiente
            </span>
          </div>
          <div v-else class="text-sm text-gray-500 italic">No hay transferencias vinculadas.</div>
        </div>

        <!-- Detalles -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Detalles de la orden</h3>
          <div class="space-y-4 text-sm">
            <div>
              <p class="text-gray-500 mb-1">Fecha de creación</p>
              <p class="text-gray-900">{{ po.expectedArrival }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-1">Condiciones de pago</p>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Ninguno</span>
            </div>
            <div>
              <p class="text-gray-500 mb-1">Moneda</p>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">CLP $</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
