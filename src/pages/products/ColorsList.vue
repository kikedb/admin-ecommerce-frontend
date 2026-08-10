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

const colors = ref([
  { id: 1, name: 'Azul Marino', hexCode: '#000080', status: 'active' },
  { id: 2, name: 'Rojo Carmesí', hexCode: '#DC143C', status: 'active' },
  { id: 3, name: 'Verde Esmeralda', hexCode: '#50C878', status: 'inactive' }
])

const columns = [
  { key: 'preview', label: 'Color' },
  { key: 'name', label: 'Nombre' },
  { key: 'hexCode', label: 'Código HEX' },
  { key: 'status', label: 'Estado' }
]

const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const currentColor = ref({ name: '', hexCode: '#000000', status: 'active' })
const colorToDelete = ref(null)

const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' }
]

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
  <div>
    <PageHeader title="Colores">
      <template #actions>
        <Button variant="primary" @click="openCreateModal" class="gap-2">
          <Plus class="w-4 h-4" /> Crear color
        </Button>
      </template>
    </PageHeader>

    <DataTable :columns="columns" :data="colors" empty-message="No hay colores creadas.">
      <template #cell-preview="{ row }">
        <div class="w-8 h-8 rounded-full border border-gray-300 shadow-inner" :style="{ backgroundColor: row.hexCode }"></div>
      </template>
      <template #cell-hexCode="{ row }">
        <span class="font-mono text-sm">{{ row.hexCode }}</span>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="row.status === 'active' ? 'success' : 'default'">
          {{ row.status === 'active' ? 'Activo' : 'Inactivo' }}
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
    <Modal :is-open="showModal" :title="modalMode === 'create' ? 'Crear color' : 'Editar color'" @close="showModal = false">
      <div class="space-y-4">
        <FormInput
          v-model="currentColor.name"
          label="Nombre del Color"
          placeholder="Ej: Azul Marino"
          required
        />
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color HEX</label>
          <div class="flex items-center gap-3">
            <input 
              type="color" 
              v-model="currentColor.hexCode" 
              class="h-10 w-16 p-1 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-800"
            >
            <FormInput
              v-model="currentColor.hexCode"
              class="flex-1 font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        <FormSelect
          v-model="currentColor.status"
          label="Estado"
          :options="statusOptions"
        />
      </div>
      <template #footer>
        <Button variant="outline" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="saveColor">Guardar</Button>
      </template>
    </Modal>

    <!-- Modal Eliminar -->
    <Modal :is-open="showDeleteModal" title="Eliminar color" @close="showDeleteModal = false">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        ¿Estás seguro de que deseas eliminar el color <strong>{{ colorToDelete?.name }}</strong>? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <Button variant="outline" @click="showDeleteModal = false">Cancelar</Button>
        <Button variant="danger" @click="confirmDelete">Eliminar</Button>
      </template>
    </Modal>
  </div>
</template>
