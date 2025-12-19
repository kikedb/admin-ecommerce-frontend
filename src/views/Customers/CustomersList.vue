<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>
      <router-link 
        to="/customers/create"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        + Nuevo Cliente
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nombre, email, RUT..."
          class="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          @input="debouncedSearch"
        />
        <select v-model="filters.customer_type" @change="loadCustomers" class="px-4 py-2 border rounded-lg dark:bg-gray-700">
          <option value="">Todos los tipos</option>
          <option value="individual">Individual (B2C)</option>
          <option value="business">Empresa (B2B)</option>
        </select>
        <select v-model="filters.status" @change="loadCustomers" class="px-4 py-2 border rounded-lg dark:bg-gray-700">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="suspended">Suspendido</option>
        </select>
        <select v-model="filters.segment" @change="loadCustomers" class="px-4 py-2 border rounded-lg dark:bg-gray-700">
          <option value="">Todos los segmentos</option>
          <option value="vip">VIP</option>
          <option value="premium">Premium</option>
          <option value="regular">Regular</option>
          <option value="new">Nuevo</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <p class="text-gray-500">Cargando clientes...</p>
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Teléfono</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Segmento</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Estado</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ getCustomerName(customer) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="customer.customer_type === 'business'" class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                B2B
              </span>
              <span v-else class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                B2C
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ customer.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ customer.phone || customer.mobile || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getSegmentClass(customer.segment)" class="px-2 py-1 text-xs rounded-full">
                {{ customer.segment.toUpperCase() }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(customer.status)" class="px-2 py-1 text-xs rounded-full">
                {{ getStatusLabel(customer.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link 
                :to="`/customers/${customer.id}/edit`"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Editar
              </router-link>
              <button
                @click="deleteCustomer(customer.id)"
                class="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div v-if="pagination.total > 0" class="px-6 py-4 border-t dark:border-gray-700 flex justify-between items-center">
        <div class="text-sm text-gray-500">
          Mostrando {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }} clientes
        </div>
        <div class="flex gap-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded',
              page === pagination.current_page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import customersService from '@/services/customers.service'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const customers = ref([])
const search = ref('')
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

function getSegmentClass(segment) {
  const classes = {
    vip: 'bg-yellow-100 text-yellow-800',
    premium: 'bg-blue-100 text-blue-800',
    regular: 'bg-gray-100 text-gray-800',
    new: 'bg-green-100 text-green-800'
  }
  return classes[segment] || 'bg-gray-100 text-gray-800'
}

function getStatusClass(status) {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status) {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
    suspended: 'Suspendido'
  }
  return labels[status] || status
}

async function deleteCustomer(id) {
  if (!confirm('¿Estás seguro de eliminar este cliente?')) return
  
  try {
    await customersService.deleteCustomer(id)
    loadCustomers(pagination.value.current_page)
  } catch (error) {
    console.error('Error deleting customer:', error)
    alert('Error al eliminar el cliente')
  }
}

onMounted(() => {
  loadCustomers()
})
</script>
