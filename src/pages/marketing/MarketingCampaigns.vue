<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, List, CalendarDays, Filter, ChevronLeft, ChevronRight, Mail, MessageSquare, Phone, Volume2 } from 'lucide-vue-next'

import { useMarketingStore } from '@/stores/mockMarketing'
import PageHeader from '@/components/Layout/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Button from '@/components/ui/Button.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import FormSelect from '@/components/Form/FormSelect.vue'

const router = useRouter()
const marketingStore = useMarketingStore()
const campaigns = computed(() => marketingStore.campaigns)

const dateRange = ref('Últimos 30 días')
const activeTab = ref('Todos')
const tabs = ['Todos', 'Correo electrónico', 'SMS', 'WhatsApp', 'Audio']
const currentPage = ref(1)
const viewMode = ref('lista')
const searchQuery = ref('')

const weekDays = [
  { name: 'Lun 6', date: '2026-07-06' },
  { name: 'Mar 7', date: '2026-07-07' },
  { name: 'Mié 8', date: '2026-07-08' },
  { name: 'Jue 9', date: '2026-07-09' },
  { name: 'Vie 10', date: '2026-07-10' },
  { name: 'Sáb 11', date: '2026-07-11' },
  { name: 'Dom 12', date: '2026-07-12' }
]

const getCampaignsForDay = (dayName) => {
  if (dayName === 'Lun 6') return [campaigns.value[0]]
  if (dayName === 'Vie 10') return [campaigns.value[1]]
  return []
}

const goToCampaign = (id) => {
  router.push(`/admin/marketing/campaigns/${id}`)
}

const kpis = [
  { label: 'Correos enviados', value: '45.2K', change: '+12%', isPositive: true },
  { label: 'Tasa de apertura', value: '24.8%', change: '+2.4%', isPositive: true },
  { label: 'Tasa de clics', value: '3.2%', change: '-0.5%', isPositive: false },
  { label: 'Ventas atribuidas', value: '$12,450', change: '+18%', isPositive: true }
]

const filteredCampaigns = computed(() => {
  let result = campaigns.value
  
  if (activeTab.value !== 'Todos') {
    result = result.filter(c => c.channel === activeTab.value)
  }
  
  if (searchQuery.value) {
    result = result.filter(c => c.subject.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  
  return result
})

const goToNewCampaign = () => {
  router.push('/admin/marketing/campaigns/new')
}

const columns = [
  { key: 'subject', label: 'Asunto' },
  { key: 'status', label: 'Estado' },
  { key: 'date', label: 'Fecha programada' },
  { key: 'openRate', label: 'Apertura' },
  { key: 'clickRate', label: 'Clics' },
  { key: 'conversionRate', label: 'Conversión' },
  { key: 'sales', label: 'Ventas', align: 'right' }
]

const getStatusType = (status) => {
  switch (status) {
    case 'Enviado': return 'success'
    case 'Programado': return 'info'
    case 'Borrador': return 'default'
    default: return 'default'
  }
}

const getChannelIcon = (channel) => {
  switch (channel) {
    case 'Correo electrónico': return Mail
    case 'SMS': return MessageSquare
    case 'WhatsApp': return Phone
    case 'Audio': return Volume2
    default: return Mail
  }
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <PageHeader title="Campañas">
      <template #description>Gestiona tus envíos de marketing por correo y SMS.</template>
      <template #actions>
        <!-- View Toggle -->
        <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-inner mr-2">
          <button @click="viewMode = 'lista'" :class="viewMode === 'lista' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" class="px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2">
            <List class="w-4 h-4" /> Lista
          </button>
          <button @click="viewMode = 'planificador'" :class="viewMode === 'planificador' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" class="px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2">
            <CalendarDays class="w-4 h-4" /> Planificador
          </button>
        </div>
        <Button variant="primary" @click="goToNewCampaign" class="gap-2">
          <Plus class="w-4 h-4" /> Crear campaña
        </Button>
      </template>
    </PageHeader>

    <!-- KPI Cards -->
    <Card class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Rendimiento general</h2>
        <div class="w-40">
          <FormSelect
            v-model="dateRange"
            :options="[
              {value: 'Últimos 7 días', label: 'Últimos 7 días'},
              {value: 'Últimos 30 días', label: 'Últimos 30 días'},
              {value: 'Este mes', label: 'Este mes'},
              {value: 'Este año', label: 'Este año'}
            ]"
          />
        </div>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="kpi in kpis" :key="kpi.label" class="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
          <div class="mt-2 flex items-baseline gap-2">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpi.value }}</p>
            <span 
              class="text-xs font-medium px-2 py-0.5 rounded-full"
              :class="kpi.isPositive ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'"
            >
              {{ kpi.change }}
            </span>
          </div>
        </div>
      </div>
    </Card>

    <!-- Campaigns List / Planner -->
    <Card class="p-0 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 px-4 flex gap-6 overflow-x-auto hide-scrollbar">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          :class="activeTab === tab ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Table View -->
      <template v-if="viewMode === 'lista'">
        <!-- Table Filters -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-4">
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="w-4 h-4 text-gray-400" />
            </div>
            <input v-model="searchQuery" type="text" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-colors" placeholder="Buscar campañas">
          </div>
          <Button variant="outline" class="gap-2 bg-white dark:bg-gray-800">
            <Filter class="w-4 h-4" /> Filtrar
          </Button>
        </div>

        <DataTable :columns="columns" :data="filteredCampaigns" empty-message="No se encontraron campañas.">
          <template #cell-subject="{ row }">
            <div class="flex items-center gap-3 cursor-pointer" @click="goToCampaign(row.id)">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                <component :is="getChannelIcon(row.channel)" class="w-4 h-4" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 hover:underline transition-colors">{{ row.subject }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ row.channel }}</div>
              </div>
            </div>
          </template>

          <template #cell-status="{ row }">
            <StatusBadge :status="getStatusType(row.status)">
              {{ row.status }}
            </StatusBadge>
          </template>

          <template #cell-sales="{ row }">
            <span class="font-medium text-gray-900 dark:text-white">{{ row.sales }}</span>
          </template>
        </DataTable>
      </template>

      <!-- Planner View -->
      <template v-else>
        <div class="p-6 bg-gray-50 dark:bg-gray-900/30 overflow-x-auto min-h-[400px]">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <button class="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition"><ChevronLeft class="w-5 h-5" /></button>
              6 – 12 de jul de 2026
              <button class="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition"><ChevronRight class="w-5 h-5" /></button>
            </h2>
            <Button variant="outline" size="sm" class="bg-white dark:bg-gray-800">Hoy</Button>
          </div>
          
          <div class="min-w-[800px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex h-full">
            <div v-for="(day, i) in weekDays" :key="day.name" class="flex-1 border-r border-gray-200 dark:border-gray-700 last:border-0 min-h-[300px] p-3 flex flex-col">
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block" :class="{'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full w-max': i === 3}">{{ day.name }}</span>
              <div class="flex flex-col gap-2 flex-1">
                <div 
                  v-for="camp in getCampaignsForDay(day.name)" :key="camp.id"
                  @click="goToCampaign(camp.id)"
                  class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-2 rounded-lg cursor-pointer hover:shadow-sm hover:border-primary-300 dark:hover:border-primary-700 transition"
                >
                  <div class="flex items-center gap-1.5 mb-1 text-primary-700 dark:text-primary-400">
                    <component :is="getChannelIcon(camp.channel)" class="w-3 h-3" />
                    <span class="text-[10px] font-bold uppercase">{{ camp.channel === 'Correo electrónico' ? 'Correo' : camp.channel }}</span>
                  </div>
                  <p class="text-xs font-medium text-gray-900 dark:text-white leading-tight line-clamp-2">{{ camp.subject }}</p>
                  <p class="text-[10px] text-gray-500 mt-1">{{ camp.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

    </Card>
  </div>
</template>
