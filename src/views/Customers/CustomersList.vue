<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, DownloadCloud, Search, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import customersService from '@/services/customers.service'
import CustomerImportExport from '@/components/customers/CustomerImportExport.vue'
import { useNotification } from '@/composables/useNotification'

import PageHeader from '@/components/Layout/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Button from '@/components/ui/Button.vue'
import FormInput from '@/components/Form/FormInput.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import Modal from '@/components/ui/Modal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const router = useRouter()
const notification = useNotification()
const loading = ref(false)
const customers = ref([])
const search = ref('')
const showImportExport = ref(false)
const showDeleteModal = ref(false)
const customerToDelete = ref(null)

const filters = ref({
  customer_type: '',
  status: '',
  segment: ''
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  
  for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
    pages.push(i)
  }
  return pages
})

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadCustomers()
  }, 500)
}

async function loadCustomers(page = 1) {
  loading.value = true
  try {
    const params = {
      ...filters.value,
      search: search.value
    }
    
    const response = await customersService.getCustomers(page, params)
    customers.value = response.data.data.data
    pagination.value = {
      current_page: response.data.data.current_page,
      last_page: response.data.data.last_page,
      per_page: response.data.data.per_page,
      total: response.data.data.total,
      from: response.data.data.from,
      to: response.data.data.to
    }
  } catch (error) {
    console.error('Error loading customers:', error)
  } finally {
    loading.value = false
  }
}

function changePage(page) {
  loadCustomers(page)
}

function getCustomerName(customer) {
  if (customer.customer_type === 'business') {
    return customer.trade_name || customer.business_name
  }
  return `${customer.first_name} ${customer.last_name}`
}

function openDeleteModal(customer) {
  customerToDelete.value = customer
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!customerToDelete.value) return
  
  try {
    await customersService.deleteCustomer(customerToDelete.value.id)
    notification.success('Cliente eliminado correctamente')
    showDeleteModal.value = false
    customerToDelete.value = null
    loadCustomers(pagination.value.current_page)
  } catch (error) {
    console.error('Error deleting customer:', error)
    notification.error('Error al eliminar el cliente')
  }
}

function handleImportSuccess() {
  showImportExport.value = false
  loadCustomers(pagination.value.current_page)
}

onMounted(() => {
  loadCustomers()
})

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'segment', label: 'Segmento' },
  { key: 'status', label: 'Estado' }
]

const customerTypeOptions = [
  { value: '', label: 'Todos los tipos' },
  { value: 'individual', label: 'Individual (B2C)' },
  { value: 'business', label: 'Empresa (B2B)' }
]

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'suspended', label: 'Suspendido' }
]

const segmentOptions = [
  { value: '', label: 'Todos los segmentos' },
  { value: 'vip', label: 'VIP' },
  { value: 'premium', label: 'Premium' },
  { value: 'regular', label: 'Regular' },
  { value: 'new', label: 'Nuevo' }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <PageHeader title="Clientes">
      <template #description>Gestión de clientes y base de datos.</template>
      <template #actions>
        <Button variant="outline" @click="showImportExport = true" class="gap-2">
          <DownloadCloud class="w-4 h-4" /> Importar/Exportar
        </Button>
        <Button variant="primary" @click="router.push('/customers/create')" class="gap-2">
          <Plus class="w-4 h-4" /> Nuevo Cliente
        </Button>
      </template>
    </PageHeader>

    <!-- Filtros -->
    <Card class="p-5 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="w-4 h-4 text-gray-400" />
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por nombre, email, RUT..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            @input="debouncedSearch"
          />
        </div>
        <FormSelect
          v-model="filters.customer_type"
          :options="customerTypeOptions"
          @change="loadCustomers"
        />
        <FormSelect
          v-model="filters.status"
          :options="statusOptions"
          @change="loadCustomers"
        />
        <FormSelect
          v-model="filters.segment"
          :options="segmentOptions"
          @change="loadCustomers"
        />
      </div>
    </Card>

    <!-- Tabla -->
    <Card class="p-0 border border-gray-200 dark:border-gray-700">
      <DataTable 
        :columns="columns" 
        :data="customers" 
        :loading="loading" 
        empty-message="No se encontraron clientes."
      >
        <template #cell-name="{ row }">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ getCustomerName(row) }}
          </div>
        </template>
        
        <template #cell-type="{ row }">
          <span v-if="row.customer_type === 'business'" class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            B2B
          </span>
          <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            B2C
          </span>
        </template>
        
        <template #cell-phone="{ row }">
          {{ row.phone || row.mobile || '-' }}
        </template>
        
        <template #cell-segment="{ row }">
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            row.segment === 'vip' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            row.segment === 'premium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
            row.segment === 'new' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          ]">
            {{ (row.segment || 'regular').toUpperCase() }}
          </span>
        </template>
        
        <template #cell-status="{ row }">
          <StatusBadge :status="row.status === 'active' ? 'success' : row.status === 'suspended' ? 'error' : 'default'">
            {{ row.status === 'active' ? 'Activo' : row.status === 'suspended' ? 'Suspendido' : 'Inactivo' }}
          </StatusBadge>
        </template>
        
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" @click="router.push(`/customers/${row.id}`)" title="Ver">
              <Eye class="w-4 h-4 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400" />
            </Button>
            <Button variant="ghost" size="sm" @click="router.push(`/customers/${row.id}/edit`)" title="Editar">
              <Pencil class="w-4 h-4 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" />
            </Button>
            <Button variant="ghost" size="sm" @click="openDeleteModal(row)" title="Eliminar">
              <Trash2 class="w-4 h-4 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" />
            </Button>
          </div>
        </template>
      </DataTable>

      <!-- Paginación API -->
      <div v-if="pagination.total > 0" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-b-xl">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Mostrando <span class="font-medium text-gray-900 dark:text-white">{{ pagination.from }}</span> a <span class="font-medium text-gray-900 dark:text-white">{{ pagination.to }}</span> de <span class="font-medium text-gray-900 dark:text-white">{{ pagination.total }}</span> clientes
        </div>
        <div class="flex gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 text-sm rounded-md transition-colors font-medium border',
              page === pagination.current_page
                ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </Card>

    <!-- Modal Importar/Exportar -->
    <div v-if="showImportExport" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10 shrink-0">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Importar / Exportar Clientes</h2>
          <button @click="showImportExport = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <CustomerImportExport @import-success="handleImportSuccess" />
        </div>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <Modal :is-open="showDeleteModal" title="Eliminar cliente" @close="showDeleteModal = false">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        ¿Estás seguro de que deseas eliminar al cliente <strong>{{ getCustomerName(customerToDelete || {}) }}</strong>? Esta acción no se puede deshacer y eliminará sus datos asociados.
      </p>
      <template #footer>
        <Button variant="outline" @click="showDeleteModal = false">Cancelar</Button>
        <Button variant="danger" @click="confirmDelete">Eliminar</Button>
      </template>
    </Modal>
  </div>
</template>
