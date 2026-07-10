<script setup>
import { ref, computed } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { success: showNotification, error: showError } = useNotification()

const brands = ref([
  { id: 1, name: 'Bilbola', website: 'https://bilbola.com', status: 'active' },
  { id: 2, name: 'EcoBaby', website: 'https://ecobaby.cl', status: 'active' },
  { id: 3, name: 'KidsPlay', website: '', status: 'inactive' }
])

const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const currentBrand = ref({ name: '', website: '', status: 'active' })
const brandToDelete = ref(null)

const openCreateModal = () => {
  modalMode.value = 'create'
  currentBrand.value = { name: '', website: '', status: 'active' }
  showModal.value = true
}

const openEditModal = (brand) => {
  modalMode.value = 'edit'
  currentBrand.value = { ...brand }
  showModal.value = true
}

const openDeleteModal = (brand) => {
  brandToDelete.value = brand
  showDeleteModal.value = true
}

const saveBrand = () => {
  if (!currentBrand.value.name) {
    showError('El nombre de la marca es obligatorio')
    return
  }

  if (modalMode.value === 'create') {
    const newId = brands.value.length > 0 ? Math.max(...brands.value.map(b => b.id)) + 1 : 1
    brands.value.push({
      ...currentBrand.value,
      id: newId
    })
    showNotification('Marca creada exitosamente')
  } else {
    const index = brands.value.findIndex(b => b.id === currentBrand.value.id)
    if (index !== -1) {
      brands.value[index] = { ...currentBrand.value }
      showNotification('Marca actualizada exitosamente')
    }
  }
  showModal.value = false
}

const confirmDelete = () => {
  if (brandToDelete.value) {
    brands.value = brands.value.filter(b => b.id !== brandToDelete.value.id)
    showNotification('Marca eliminada')
  }
  showDeleteModal.value = false
  brandToDelete.value = null
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Marcas</h1>
      <button @click="openCreateModal" class="px-4 py-2 bg-gray-900 text-white rounded shadow-sm hover:bg-gray-800 text-sm font-medium transition">
        Crear marca
      </button>
    </div>

    <!-- Lista de Marcas -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sitio Web</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="brand in brands" :key="brand.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ brand.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <a v-if="brand.website" :href="brand.website" target="_blank" class="text-blue-600 hover:underline">{{ brand.website }}</a>
              <span v-else>-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="brand.status === 'active'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Activa</span>
              <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inactiva</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(brand)" class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
              <button @click="openDeleteModal(brand)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
          <tr v-if="brands.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">
              No hay marcas creadas.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ modalMode === 'create' ? 'Crear marca' : 'Editar marca' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Marca</label>
            <input type="text" v-model="currentBrand.name" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Bilbola">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
            <input type="url" v-model="currentBrand.website" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="https://...">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="currentBrand.status" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="saveBrand" class="px-4 py-2 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Eliminar marca</h3>
          <button @click="showDeleteModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600">¿Estás seguro de que deseas eliminar la marca <strong>{{ brandToDelete?.name }}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>
