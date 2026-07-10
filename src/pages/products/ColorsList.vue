<script setup>
import { ref, computed } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { success: showNotification, error: showError } = useNotification()

const colors = ref([
  { id: 1, name: 'Azul Marino', hexCode: '#000080', status: 'active' },
  { id: 2, name: 'Rojo Carmesí', hexCode: '#DC143C', status: 'active' },
  { id: 3, name: 'Verde Esmeralda', hexCode: '#50C878', status: 'inactive' }
])

const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const currentColor = ref({ name: '', hexCode: '#000000', status: 'active' })
const colorToDelete = ref(null)

const openCreateModal = () => {
  modalMode.value = 'create'
  currentColor.value = { name: '', hexCode: '#000000', status: 'active' }
  showModal.value = true
}

const openEditModal = (color) => {
  modalMode.value = 'edit'
  currentColor.value = { ...color }
  showModal.value = true
}

const openDeleteModal = (color) => {
  colorToDelete.value = color
  showDeleteModal.value = true
}

const saveColor = () => {
  if (!currentColor.value.name || !currentColor.value.hexCode) {
    showError('El nombre y el color son obligatorios')
    return
  }

  if (modalMode.value === 'create') {
    const newId = colors.value.length > 0 ? Math.max(...colors.value.map(c => c.id)) + 1 : 1
    colors.value.push({
      ...currentColor.value,
      id: newId
    })
    showNotification('Color creado exitosamente')
  } else {
    const index = colors.value.findIndex(c => c.id === currentColor.value.id)
    if (index !== -1) {
      colors.value[index] = { ...currentColor.value }
      showNotification('Color actualizado exitosamente')
    }
  }
  showModal.value = false
}

const confirmDelete = () => {
  if (colorToDelete.value) {
    colors.value = colors.value.filter(c => c.id !== colorToDelete.value.id)
    showNotification('Color eliminado')
  }
  showDeleteModal.value = false
  colorToDelete.value = null
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Colores</h1>
      <button @click="openCreateModal" class="px-4 py-2 bg-gray-900 text-white rounded shadow-sm hover:bg-gray-800 text-sm font-medium transition">
        Crear color
      </button>
    </div>

    <!-- Lista de Colores -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código HEX</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="color in colors" :key="color.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="w-8 h-8 rounded-full border border-gray-300 shadow-inner" :style="{ backgroundColor: color.hexCode }"></div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ color.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
              {{ color.hexCode }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="color.status === 'active'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Activo</span>
              <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inactivo</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(color)" class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
              <button @click="openDeleteModal(color)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
          <tr v-if="colors.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
              No hay colores creados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ modalMode === 'create' ? 'Crear color' : 'Editar color' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Color</label>
            <input type="text" v-model="currentColor.name" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Azul Marino">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div class="flex items-center space-x-3">
              <input type="color" v-model="currentColor.hexCode" class="h-10 w-16 p-1 border border-gray-300 rounded cursor-pointer bg-white">
              <input type="text" v-model="currentColor.hexCode" class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono" placeholder="#000000">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="currentColor.status" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="saveColor" class="px-4 py-2 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Eliminar color</h3>
          <button @click="showDeleteModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600">¿Estás seguro de que deseas eliminar el color <strong>{{ colorToDelete?.name }}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>
