<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Customer Detail -->
    <div v-else-if="customer" class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <h1 class="text-3xl font-bold text-gray-900">
                {{ customerName }}
              </h1>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                statusBadgeClass
              ]">
                {{ statusLabel }}
              </span>
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                customer.customer_type === 'business' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              ]">
                {{ customer.customer_type === 'business' ? 'B2B - Empresa' : 'B2C - Persona' }}
              </span>
            </div>
            
            <div class="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <span v-if="customer.email" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                {{ customer.email }}
              </span>
              <span v-if="customer.phone" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                {{ customer.phone }}
              </span>
              <span v-if="customer.customer_since" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Cliente desde {{ formatDate(customer.customer_since) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <button
              @click="goToEdit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Editar
            </button>
            <button
              v-if="customer.status === 'active'"
              @click="suspendCustomer"
              class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Suspender
            </button>
            <button
              v-else-if="customer.status === 'suspended'"
              @click="activateCustomer"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Activar
            </button>
            <button
              @click="goBack"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow">
        <!-- Tab Headers -->
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Tab 1: Información General -->
          <div v-if="activeTab === 'general'" class="space-y-6">
            <!-- Datos Básicos -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Datos Básicos</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField v-if="customer.customer_type === 'individual'" label="Nombre" :value="customer.first_name" />
                <InfoField v-if="customer.customer_type === 'individual'" label="Apellido" :value="customer.last_name" />
                <InfoField v-if="customer.customer_type === 'business'" label="Razón Social" :value="customer.business_name" />
                <InfoField v-if="customer.customer_type === 'business'" label="Nombre Comercial" :value="customer.trade_name" />
                
                <InfoField 
                  :label="customer.customer_type === 'business' ? 'RUT Empresa' : 'Documento'" 
                  :value="customer.customer_type === 'business' ? customer.tax_id : customer.document_number" 
                />
                
                <InfoField v-if="customer.customer_type === 'individual' && customer.date_of_birth" 
                  label="Fecha de Nacimiento" 
                  :value="formatDate(customer.date_of_birth)" 
                />
                <InfoField v-if="customer.customer_type === 'individual' && customer.gender" 
                  label="Género" 
                  :value="customer.gender === 'male' ? 'Masculino' : customer.gender === 'female' ? 'Femenino' : 'Otro'" 
                />
                <InfoField v-if="customer.customer_type === 'business'" label="Actividad Comercial" :value="customer.business_activity" />
                
                <InfoField label="Email" :value="customer.email" />
                <InfoField label="Teléfono Principal" :value="customer.phone" />
                <InfoField label="Teléfono Móvil" :value="customer.mobile" />
                <InfoField label="Teléfono Alternativo" :value="customer.alternative_phone" />
              </div>
            </div>

            <!-- Dirección Principal -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Dirección Principal</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Dirección Línea 1" :value="customer.address_line_1" />
                <InfoField label="Dirección Línea 2" :value="customer.address_line_2" />
                <InfoField label="Ciudad" :value="customer.city" />
                <InfoField label="Región" :value="customer.region" />
                <InfoField label="Código Postal" :value="customer.postal_code" />
                <InfoField label="País" :value="customer.country" />
              </div>
            </div>

            <!-- Información Comercial -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Información Comercial</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Segmento" :value="segmentLabel" />
                <InfoField label="Método de Pago Preferido" :value="customer.preferred_payment_method" />
                <InfoField v-if="customer.customer_type === 'business'" label="Límite de Crédito" :value="formatCurrency(customer.credit_limit)" />
                <InfoField label="Descuento %" :value="customer.discount_percentage ? customer.discount_percentage + '%' : '-'" />
                <InfoField label="Es Mayorista" :value="customer.is_wholesale ? 'Sí' : 'No'" />
                <InfoField label="Exento de Impuestos" :value="customer.tax_exempt ? 'Sí' : 'No'" />
                <InfoField label="Canal de Adquisición" :value="customer.acquisition_channel" />
                <InfoField v-if="customer.rating" label="Calificación" :value="'⭐'.repeat(customer.rating)" />
              </div>
            </div>
          </div>

          <!-- Tab 2: Direcciones -->
          <div v-if="activeTab === 'addresses'" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Múltiples direcciones</h3>
            <p class="mt-1 text-sm text-gray-500">Esta funcionalidad estará disponible en la Fase 5</p>
            <button
              disabled
              class="mt-4 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Agregar Dirección
            </button>
          </div>

          <!-- Tab 3: Contactos -->
          <div v-if="activeTab === 'contacts'" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Contactos adicionales</h3>
            <p class="mt-1 text-sm text-gray-500">Esta funcionalidad estará disponible en la Fase 5</p>
            <button
              disabled
              class="mt-4 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Agregar Contacto
            </button>
          </div>

          <!-- Tab 4: Notas y Observaciones -->
          <div v-if="activeTab === 'notes'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notas Internas</label>
              <div class="bg-gray-50 border border-gray-300 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap">
                {{ customer.notes || 'No hay notas registradas' }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <InfoField label="Suscrito a Newsletter" :value="customer.subscribe_newsletter ? 'Sí' : 'No'" />
              <InfoField label="Suscrito a Promociones" :value="customer.subscribe_promotions ? 'Sí' : 'No'" />
              <InfoField label="Suscrito a Notificaciones" :value="customer.subscribe_notifications ? 'Sí' : 'No'" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <InfoField label="Fecha de Creación" :value="formatDateTime(customer.created_at)" />
              <InfoField label="Última Actualización" :value="formatDateTime(customer.updated_at)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <p class="text-red-600">No se pudo cargar la información del cliente</p>
      <button @click="goBack" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
        Volver a la lista
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import customersService from '@/services/customers.service'

// Components
const InfoField = {
  props: ['label', 'value'],
  template: `
    <div>
      <dt class="text-sm font-medium text-gray-500">{{ label }}</dt>
      <dd class="mt-1 text-sm text-gray-900">{{ value || '-' }}</dd>
    </div>
  `
}

const router = useRouter()
const route = useRoute()
const customerStore = useCustomerStore()

const customer = ref(null)
const loading = ref(true)
const activeTab = ref('general')

const tabs = [
  { id: 'general', label: 'Información General' },
  { id: 'addresses', label: 'Direcciones' },
  { id: 'contacts', label: 'Contactos' },
  { id: 'notes', label: 'Notas y Observaciones' }
]

const customerName = computed(() => {
  if (!customer.value) return ''
  if (customer.value.customer_type === 'business') {
    return customer.value.trade_name || customer.value.business_name
  }
  return `${customer.value.first_name} ${customer.value.last_name}`
})

const statusBadgeClass = computed(() => {
  const status = customer.value?.status
  if (status === 'active') return 'bg-green-100 text-green-800'
  if (status === 'suspended') return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
})

const statusLabel = computed(() => {
  const status = customer.value?.status
  if (status === 'active') return 'Activo'
  if (status === 'suspended') return 'Suspendido'
  return 'Inactivo'
})

const segmentLabel = computed(() => {
  const segment = customer.value?.segment
  const labels = {
    vip: 'VIP',
    premium: 'Premium',
    regular: 'Regular',
    new: 'Nuevo'
  }
  return labels[segment] || segment
})

onMounted(async () => {
  try {
    const customerId = route.params.id
    const response = await customersService.getCustomerById(customerId)
    customer.value = response.data.data
  } catch (error) {
    console.error('Error al cargar cliente:', error)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/customers')
}

function goToEdit() {
  router.push(`/customers/${customer.value.id}/edit`)
}

async function suspendCustomer() {
  if (!confirm('¿Estás seguro de suspender este cliente?')) return
  
  try {
    await customersService.suspendCustomer(customer.value.id)
    customer.value.status = 'suspended'
  } catch (error) {
    alert('Error al suspender cliente')
    console.error(error)
  }
}

async function activateCustomer() {
  try {
    await customersService.activateCustomer(customer.value.id)
    customer.value.status = 'active'
  } catch (error) {
    alert('Error al activar cliente')
    console.error(error)
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CL')
}

function formatDateTime(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('es-CL')
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount)
}
</script>
