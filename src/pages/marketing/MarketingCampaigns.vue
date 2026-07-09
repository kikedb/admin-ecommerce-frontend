<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useMarketingStore } from '@/stores/mockMarketing'

const router = useRouter()
const marketingStore = useMarketingStore()
const campaigns = computed(() => marketingStore.campaigns)

const dateRange = ref('Últimos 30 días')
const activeTab = ref('Todos')
const tabs = ['Todos', 'Correo electrónico', 'SMS', 'WhatsApp', 'Audio']
const currentPage = ref(1)

const goToCampaign = (id) => {
  // En un caso real, si es 'Borrador' iría a edit/new, pero para la demostración
  // del dashboard de resultados, lo enviaremos al dashboard independientemente.
  router.push(`/admin/marketing/campaigns/${id}`)
}

const kpis = [
  { label: 'Correos enviados', value: '45.2K', change: '+12%', isPositive: true },
  { label: 'Tasa de apertura', value: '24.8%', change: '+2.4%', isPositive: true },
  { label: 'Tasa de clics', value: '3.2%', change: '-0.5%', isPositive: false },
  { label: 'Ventas atribuidas', value: '$12,450', change: '+18%', isPositive: true }
]

const filteredCampaigns = computed(() => {
  if (activeTab.value === 'Todos') return campaigns.value
  return campaigns.value.filter(c => c.channel === activeTab.value)
})

const goToNewCampaign = () => {
  router.push('/admin/marketing/campaigns/new')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Campañas</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona tus envíos de marketing por correo y SMS.</p>
      </div>
      <button @click="goToNewCampaign" class="px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm">
        Crear campaña
      </button>
    </div>

    <!-- KPI Cards -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Rendimiento general</h2>
        <select v-model="dateRange" class="text-sm border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Este mes</option>
          <option>Este año</option>
        </select>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="kpi in kpis" :key="kpi.label" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
          <div class="mt-2 flex items-baseline gap-2">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpi.value }}</p>
            <span 
              class="text-xs font-medium px-1.5 py-0.5 rounded"
              :class="kpi.isPositive ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'"
            >
              {{ kpi.change }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaigns List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 px-4 flex gap-6">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="py-4 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Table Filters -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input type="text" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Buscar campañas">
        </div>
        <button class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          Filtrar
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Asunto</th>
              <th scope="col" class="px-6 py-3">Estado</th>
              <th scope="col" class="px-6 py-3">Fecha programada</th>
              <th scope="col" class="px-6 py-3">Apertura</th>
              <th scope="col" class="px-6 py-3">Clics</th>
              <th scope="col" class="px-6 py-3">Conversión</th>
              <th scope="col" class="px-6 py-3">Ventas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="campaign in filteredCampaigns" :key="campaign.id" class="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer" @click="goToCampaign(campaign.id)">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="campaign.channelIcon"></path></svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white transition-colors">{{ campaign.subject }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ campaign.channel }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-0.5 rounded-full text-xs font-medium', campaign.statusColor]">
                  {{ campaign.status }}
                </span>
              </td>
              <td class="px-6 py-4">{{ campaign.date }}</td>
              <td class="px-6 py-4">{{ campaign.openRate }}</td>
              <td class="px-6 py-4">{{ campaign.clickRate }}</td>
              <td class="px-6 py-4">{{ campaign.conversionRate }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ campaign.sales }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span class="text-sm text-gray-500 dark:text-gray-400">Mostrando <span class="font-medium text-gray-900 dark:text-white">{{ filteredCampaigns.length ? 1 : 0 }}</span> a <span class="font-medium text-gray-900 dark:text-white">{{ filteredCampaigns.length }}</span> de <span class="font-medium text-gray-900 dark:text-white">{{ filteredCampaigns.length }}</span> campañas</span>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage === 1">
            Anterior
          </button>
          <button class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed" :disabled="true">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
