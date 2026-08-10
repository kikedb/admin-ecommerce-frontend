<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { transfers } from '@/stores/mockInventory'
import { Search, Plus } from 'lucide-vue-next'

import PageHeader from '@/components/Layout/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Button from '@/components/ui/Button.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const router = useRouter()
const activeFilter = ref('Todos')
const searchQuery = ref('')
const selectedIds = ref([])

const filteredTransfers = computed(() => {
  return transfers.value.filter(t => {
    if (searchQuery.value && !t.id.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    return true
  })
})

const selectAll = computed({
  get: () => {
    return filteredTransfers.value.length > 0 && selectedIds.value.length === filteredTransfers.value.length
  },
  set: (val) => {
    if (val) {
      selectedIds.value = filteredTransfers.value.map(t => t.id)
    } else {
      selectedIds.value = []
    }
  }
})

const createNew = () => {
  router.push('/admin/inventory/transfers/new')
}

const goToDetail = (id) => {
  router.push(`/admin/inventory/transfers/${id}`)
}

const columns = [
  { key: 'select', label: '' },
  { key: 'id', label: 'Transferencia' },
  { key: 'origin', label: 'Origen' },
  { key: 'destination', label: 'Destino' },
  { key: 'status', label: 'Estado' },
  { key: 'receivedCount', label: 'Recibido' },
  { key: 'expectedArrival', label: 'Llegada prevista', align: 'right' }
]
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <PageHeader title="Transferencias">
      <template #description>Mueve inventario entre tus bodegas y sucursales.</template>
      <template #actions>
        <Button variant="primary" @click="createNew" class="gap-2">
          <Plus class="w-4 h-4" /> Crear transferencia
        </Button>
      </template>
    </PageHeader>

    <!-- Table Container -->
    <Card class="p-0 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Filters -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
        <div class="relative w-full max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="w-4 h-4 text-gray-400" />
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors shadow-sm" 
            placeholder="Buscar transferencias"
          >
        </div>
      </div>

      <!-- Action Bar (when selected) -->
      <div v-if="selectedIds.length > 0" class="bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center text-sm">
        <span class="font-medium text-primary-700 dark:text-primary-300 mr-4">{{ selectedIds.length }} seleccionados</span>
        <Button variant="outline" size="sm" class="mr-3 bg-white dark:bg-gray-800">Recibir transferencia</Button>
      </div>

      <!-- Table -->
      <DataTable :columns="columns" :data="filteredTransfers" empty-message="No hay transferencias.">
        <template #header-select>
          <input type="checkbox" v-model="selectAll" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
        </template>
        
        <template #cell-select="{ row }">
          <input type="checkbox" :value="row.id" v-model="selectedIds" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" @click.stop>
        </template>

        <template #cell-id="{ row }">
          <span class="font-medium text-gray-900 dark:text-white hover:underline cursor-pointer" @click="goToDetail(row.id)">
            #{{ row.id }}
          </span>
        </template>

        <template #cell-status="{ row }">
          <StatusBadge :status="row.status === 'Completado' ? 'success' : row.status === 'Transferido' ? 'info' : 'default'">
            {{ row.status }}
          </StatusBadge>
        </template>

        <template #cell-receivedCount="{ row }">
          <span>{{ row.receivedCount }} de {{ row.itemsCount }}</span>
        </template>
      </DataTable>
    </Card>
  </div>
</template>
