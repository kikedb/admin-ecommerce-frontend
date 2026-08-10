<script setup>
import { ref } from 'vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { useNotification } from '@/composables/useNotification'

import PageHeader from '@/components/Layout/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import FormInput from '@/components/Form/FormInput.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const { success: showNotification, error: showError } = useNotification()

const categories = ref([
  { id: 1, name: 'Bebés', description: 'Ropa y accesorios para recién nacidos', status: 'active' },
  { id: 2, name: 'Niños', description: 'Ropa para niños de 2 a 10 años', status: 'active' },
  { id: 3, name: 'Juguetes', description: 'Juguetes didácticos y madera', status: 'inactive' }
])

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'status', label: 'Estado' }
]

const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const currentCategory = ref({ name: '', description: '', status: 'active' })
const categoryToDelete = ref(null)

const statusOptions = [
  { value: 'active', label: 'Activa' },
  { value: 'inactive', label: 'Inactiva' }
]

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
  <div>
    <PageHeader title="Categorías">
      <template #actions>
        <Button variant="primary" @click="openCreateModal" class="gap-2">
          <Plus class="w-4 h-4" /> Crear categoría
        </Button>
      </template>
    </PageHeader>

    <DataTable :columns="columns" :data="categories" empty-message="No hay categorías creadas.">
      <template #cell-description="{ row }">
        <span class="truncate max-w-xs block" :title="row.description">{{ row.description || '-' }}</span>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="row.status === 'active' ? 'success' : 'default'">
          {{ row.status === 'active' ? 'Activa' : 'Inactiva' }}
        </StatusBadge>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" @click="openEditModal(row)" title="Editar">
            <Pencil class="w-4 h-4 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" />
          </Button>
          <Button variant="ghost" size="sm" @click="openDeleteModal(row)" title="Eliminar">
            <Trash2 class="w-4 h-4 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" />
          </Button>
        </div>
      </template>
    </DataTable>

    <!-- Modal Crear/Editar -->
    <Modal :is-open="showModal" :title="modalMode === 'create' ? 'Crear categoría' : 'Editar categoría'" @close="showModal = false">
      <div class="space-y-4">
        <FormInput
          v-model="currentCategory.name"
          label="Nombre"
          placeholder="Ej: Bebés"
          required
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
          <textarea
            v-model="currentCategory.description"
            rows="3"
            class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="Descripción opcional..."
          ></textarea>
        </div>
        <FormSelect
          v-model="currentCategory.status"
          label="Estado"
          :options="statusOptions"
        />
      </div>
      <template #footer>
        <Button variant="outline" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="saveCategory">Guardar</Button>
      </template>
    </Modal>

    <!-- Modal Eliminar -->
    <Modal :is-open="showDeleteModal" title="Eliminar categoría" @close="showDeleteModal = false">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        ¿Estás seguro de que deseas eliminar la categoría <strong>{{ categoryToDelete?.name }}</strong>? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <Button variant="outline" @click="showDeleteModal = false">Cancelar</Button>
        <Button variant="danger" @click="confirmDelete">Eliminar</Button>
      </template>
    </Modal>
  </div>
</template>
