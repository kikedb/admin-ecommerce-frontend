<script setup>
import { ref } from 'vue'

const invoices = ref([
  { id: 'FAC-001', date: '2026-07-01', amount: 150000, iva: 28500, type: 'Factura Electrónica', status: 'Emitida' },
  { id: 'FAC-002', date: '2026-07-02', amount: 80000, iva: 15200, type: 'Boleta Electrónica', status: 'Emitida' },
  { id: 'NC-001', date: '2026-07-05', amount: -25000, iva: -4750, type: 'Nota de Crédito', status: 'Emitida' },
  { id: 'FAC-003', date: '2026-07-09', amount: 300000, iva: 57000, type: 'Factura Electrónica', status: 'Pendiente SII' },
])

const totalInvoiced = ref(530000)
const totalIVA = ref(100700)
const pendingInvoices = ref(1)

const isConnectedSII = ref(false)
const connectToSII = () => {
  isConnectedSII.value = true
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Facturación y Contabilidad</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Gestiona tus documentos tributarios, conexión al SII y resúmenes de facturación mensual.
      </p>
    </div>

    <!-- Integración SII -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Servicio de Impuestos Internos (SII)</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Conecta tu cuenta para emitir boletas, facturas y notas de crédito automáticamente.
              </p>
            </div>
          </div>
          <div>
            <span v-if="isConnectedSII" class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Conectado
            </span>
            <span v-else class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Desconectado
            </span>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button 
            v-if="!isConnectedSII"
            @click="connectToSII"
            class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
          >
            Configurar API de SII
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <div v-else class="flex items-center gap-4">
             <button class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 flex items-center gap-2">
                Sincronizar Folios
             </button>
             <button @click="isConnectedSII = false" class="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2">
                Desconectar
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Facturado (Mes)</div>
        <div class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${{ totalInvoiced.toLocaleString('es-CL') }}</div>
        <div class="mt-1 text-sm text-green-600 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          +12% respecto al mes anterior
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">IVA Retenido (Mes)</div>
        <div class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${{ totalIVA.toLocaleString('es-CL') }}</div>
        <div class="mt-1 text-sm text-gray-500">19% Aplicado</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Documentos Pendientes</div>
        <div class="mt-2 text-3xl font-bold text-orange-500 dark:text-orange-400">{{ pendingInvoices }}</div>
        <div class="mt-1 text-sm text-gray-500">Requieren atención manual</div>
      </div>
    </div>

    <!-- Lista de Documentos -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Últimos Documentos</h3>
        <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todos</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">ID Documento</th>
              <th scope="col" class="px-6 py-3">Tipo</th>
              <th scope="col" class="px-6 py-3">Fecha</th>
              <th scope="col" class="px-6 py-3">Monto Neto</th>
              <th scope="col" class="px-6 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoices" :key="inv.id" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {{ inv.id }}
              </td>
              <td class="px-6 py-4">
                {{ inv.type }}
              </td>
              <td class="px-6 py-4">
                {{ inv.date }}
              </td>
              <td class="px-6 py-4" :class="inv.amount < 0 ? 'text-red-500' : ''">
                ${{ inv.amount.toLocaleString('es-CL') }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': inv.status === 'Emitida',
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300': inv.status === 'Pendiente SII'
                  }"
                >
                  {{ inv.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
