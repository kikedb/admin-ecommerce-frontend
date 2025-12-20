<template>
  <div>
    <!-- Lista de direcciones -->
    <div v-if="addresses.length > 0" class="space-y-3 mb-4">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        :class="{ 'border-blue-500 bg-blue-50': address.is_default }"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <p class="font-medium text-gray-900">{{ address.address_line_1 }}</p>
              <span v-if="address.is_default" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Predeterminada
              </span>
            </div>
            <p v-if="address.address_line_2" class="text-sm text-gray-600">{{ address.address_line_2 }}</p>
            <p class="text-sm text-gray-600">
              {{ address.city }}, {{ address.region }} {{ address.postal_code }}
            </p>
            <p class="text-sm text-gray-600">{{ address.country }}</p>
          </div>
          
          <div class="flex gap-2">
            <button
              v-if="!address.is_default"
              @click="setDefault(address.id)"
              class="text-sm text-blue-600 hover:text-blue-800"
              title="Marcar como predeterminada"
            >
              Predeterminada
            </button>
            <button
              @click="editAddress(address)"
              class="text-sm text-gray-600 hover:text-gray-800"
            >
              Editar
            </button>
            <button
              @click="confirmDelete(address.id)"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <p class="mt-2">No hay direcciones registradas</p>
    </div>

    <!-- Botón agregar -->
    <button
      @click="openModal()"
      class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      + Agregar Dirección
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ editingAddress ? 'Editar Dirección' : 'Nueva Dirección' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveAddress" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección Línea 1 *</label>
            <input
              v-model="form.address_line_1"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Calle, número"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección Línea 2</label>
            <input
              v-model="form.address_line_2"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Depto, oficina, etc."
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input
                v-model="form.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Región</label>
              <input
                v-model="form.region"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
              <input
                v-model="form.postal_code"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">País *</label>
              <input
                v-model="form.country"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              v-model="form.is_default"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label class="ml-2 text-sm text-gray-700">Marcar como dirección predeterminada</label>
          </div>

          <div v-if="error" class="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
            {{ error }}
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              :disabled="saving"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import customerAddressesService from '@/services/customerAddresses.service'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['updated'])

const addresses = ref([])
const showModal = ref(false)
const editingAddress = ref(null)
const saving = ref(false)
const error = ref('')

const form = ref({
  address_line_1: '',
  address_line_2: '',
  city: '',
  region: '',
  postal_code: '',
  country: 'Chile',
  is_default: false
})

onMounted(() => {
  loadAddresses()
})

async function loadAddresses() {
  try {
    const response = await customerAddressesService.getAddresses(props.customerId)
    addresses.value = response.data.data
  } catch (err) {
    console.error('Error al cargar direcciones:', err)
  }
}

function openModal(address = null) {
  editingAddress.value = address
  if (address) {
    form.value = { ...address }
  } else {
    resetForm()
  }
  showModal.value = true
  error.value = ''
}

function closeModal() {
  showModal.value = false
  editingAddress.value = null
  resetForm()
  error.value = ''
}

function resetForm() {
  form.value = {
    address_line_1: '',
    address_line_2: '',
    city: '',
    region: '',
    postal_code: '',
    country: 'Chile',
    is_default: false
  }
}

function editAddress(address) {
  openModal(address)
}

async function saveAddress() {
  saving.value = true
  error.value = ''

  try {
    if (editingAddress.value) {
      await customerAddressesService.updateAddress(props.customerId, editingAddress.value.id, form.value)
    } else {
      await customerAddressesService.createAddress(props.customerId, form.value)
    }
    
    await loadAddresses()
    closeModal()
    emit('updated')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar la dirección'
  } finally {
    saving.value = false
  }
}

async function setDefault(addressId) {
  try {
    await customerAddressesService.setDefaultAddress(props.customerId, addressId)
    await loadAddresses()
    emit('updated')
  } catch (err) {
    alert('Error al marcar como predeterminada')
  }
}

async function confirmDelete(addressId) {
  if (!confirm('¿Estás seguro de eliminar esta dirección?')) return

  try {
    await customerAddressesService.deleteAddress(props.customerId, addressId)
    await loadAddresses()
    emit('updated')
  } catch (err) {
    alert('Error al eliminar la dirección')
  }
}
</script>
