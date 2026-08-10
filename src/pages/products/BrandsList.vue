<script setup>
import { ref } from 'vue'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-vue-next'
import { useNotification } from '@/composables/useNotification'

import PageHeader from '@/components/Layout/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import FormInput from '@/components/Form/FormInput.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const { success: showNotification, error: showError } = useNotification()

const brands = ref([
  { id: 1, name: 'Bilbola', website: 'https://bilbola.com', status: 'active' },
  { id: 2, name: 'EcoBaby', website: 'https://ecobaby.cl', status: 'active' },
  { id: 3, name: 'KidsPlay', website: '', status: 'inactive' }
])

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'website', label: 'Sitio Web' },
  { key: 'status', label: 'Estado' }
]

const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const currentBrand = ref({ name: '', website: '', status: 'active' })
const brandToDelete = ref(null)

const statusOptions = [
  { value: 'active', label: 'Activa' },
  { value: 'inactive', label: 'Inactiva' }
]

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
  <div>
    <PageHeader title="Marcas">
      <template #actions>
        <Button variant="primary" @click="openCreateModal" class="gap-2">
          <Plus class="w-4 h-4" /> Crear marca
        </Button>
      </template>
    </PageHeader>

    <DataTable :columns="columns" :data="brands" empty-message="No hay marcas creadas.">
      <template #cell-website="{ row }">
        <a v-if="row.website" :href="row.website" target="_blank" class="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 hover:underline">
          {{ row.website }}
          <ExternalLink class="w-3 h-3" />
        </a>
        <span v-else class="text-gray-400">-</span>
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
    <Modal :is-open="showModal" :title="modalMode === 'create' ? 'Crear marca' : 'Editar marca'" @close="showModal = false">
      <div class="space-y-4">
        <FormInput
          v-model="currentBrand.name"
          label="Nombre de la Marca"
          placeholder="Ej: Bilbola"
          required
        />
        <FormInput
          v-model="currentBrand.website"
          type="url"
          label="Sitio Web"
          placeholder="https://..."
        />
        <FormSelect
          v-model="currentBrand.status"
          label="Estado"
          :options="statusOptions"
        />
      </div>
      <template #footer>
        <Button variant="outline" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="saveBrand">Guardar</Button>
      </template>
    </Modal>

    <!-- Modal Eliminar -->
    <Modal :is-open="showDeleteModal" title="Eliminar marca" @close="showDeleteModal = false">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        ¿Estás seguro de que deseas eliminar la marca <strong>{{ brandToDelete?.name }}</strong>? Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <Button variant="outline" @click="showDeleteModal = false">Cancelar</Button>
        <Button variant="danger" @click="confirmDelete">Eliminar</Button>
      </template>
    </Modal>
  </div>
</template>
