<script setup>
import { ref, computed } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { success: showNotification, error: showError } = useNotification()

const categories = ref([
  { id: 1, name: 'Bebés', description: 'Ropa y accesorios para recién nacidos', status: 'active' },
  { id: 2, name: 'Niños', description: 'Ropa para niños de 2 a 10 años', status: 'active' },
  { id: 3, name: 'Juguetes', description: 'Juguetes didácticos y madera', status: 'inactive' }
])

const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const currentCategory = ref({ name: '', description: '', status: 'active' })
const categoryToDelete = ref(null)

const openCreateModal = () => {
  modalMode.value = 'create'
  currentCategory.value = { name: '', description: '', status: 'active' }
  showModal.value = true
}

const openEditModal = (category) => {
  modalMode.value = 'edit'
  currentCategory.value = { ...category }
  showModal.value = true
}

const openDeleteModal = (category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const saveCategory = () => {
  if (!currentCategory.value.name) {
    showError('El nombre de la categoría es obligatorio')
    return
  }

  if (modalMode.value === 'create') {
    const newId = categories.value.length > 0 ? Math.max(...categories.value.map(c => c.id)) + 1 : 1
    categories.value.push({
      ...currentCategory.value,
      id: newId
    })
    showNotification('Categoría creada exitosamente')
  } else {
    const index = categories.value.findIndex(c => c.id === currentCategory.value.id)
    if (index !== -1) {
      categories.value[index] = { ...currentCategory.value }
      showNotification('Categoría actualizada exitosamente')
    }
  }
  showModal.value = false
}

const confirmDelete = () => {
  if (categoryToDelete.value) {
    categories.value = categories.value.filter(c => c.id !== categoryToDelete.value.id)
    showNotification('Categoría eliminada')
  }
  showDeleteModal.value = false
  categoryToDelete.value = null
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Categorías</h1>
      <button @click="openCreateModal" class="px-4 py-2 bg-gray-900 text-white rounded shadow-sm hover:bg-gray-800 text-sm font-medium transition">
        Crear categoría
      </button>
    </div>

    <!-- Lista de Categorías -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ category.name }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
              {{ category.description || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="category.status === 'active'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Activa</span>
              <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inactiva</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(category)" class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
              <button @click="openDeleteModal(category)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">
              No hay categorías creadas.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ modalMode === 'create' ? 'Crear categoría' : 'Editar categoría' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" v-model="currentCategory.name" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Bebés">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="currentCategory.description" rows="3" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Descripción opcional..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="currentCategory.status" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="saveCategory" class="px-4 py-2 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Eliminar categoría</h3>
          <button @click="showDeleteModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600">¿Estás seguro de que deseas eliminar la categoría <strong>{{ categoryToDelete?.name }}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>
