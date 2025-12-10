<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  isLoading: Boolean,
  productId: Number,
  initialData: Object
})

const emit = defineEmits(['close', 'submit'])
const form = ref({
  name: '', category: '', brand: '', price: '', stock: '', weight: '',
  length: '', width: '', height: '', description: '', status: 'draft', saleType: 'both'
})
const errors = ref({})

const resetForm = () => {
  form.value = {
    name: '', category: '', brand: '', price: '', stock: '', weight: '',
    length: '', width: '', height: '', description: '', status: 'draft', saleType: 'both'
  }
  errors.value = {}
  return form.value
}

watch(() => props.initialData, (n) => {
  form.value = n ? { ...n } : resetForm()
}, { deep: true, immediate: true })

const validateForm = () => {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Requerido'
  if (!form.value.category) errors.value.category = 'Requerido'
  if (!form.value.price) errors.value.price = 'Requerido'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  emit('submit', form.value)
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <div v-if="isOpen">
    <div class="fixed inset-0 bg-black/50 z-40" @click="handleClose"></div>
    <div class="fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 z-50 overflow-y-auto shadow-xl">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ productId ? 'Editar' : 'Nuevo' }} Producto</h2>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
          <input v-model="form.name" type="text" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
          <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
          <select v-model="form.category" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
            <option value="">Selecciona</option>
            <option value="PC">PC</option>
            <option value="Phone">Phone</option>
            <option value="Tablet">Tablet</option>
          </select>
          <p v-if="errors.category" class="text-red-500 text-sm">{{ errors.category }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white">Marca</label>
          <select v-model="form.brand" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
            <option value="">Selecciona</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white">Precio</label>
          <input v-model="form.price" type="number" step="0.01" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
          <p v-if="errors.price" class="text-red-500 text-sm">{{ errors.price }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white">Stock</label>
          <input v-model="form.stock" type="number" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white">Estado</label>
          <select v-model="form.status" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
        <button @click="handleClose" class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">Cancelar</button>
        <button @click="handleSubmit" :disabled="isLoading" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">{{ isLoading ? 'Guardando' : (productId ? 'Actualizar' : 'Crear') }}</button>
      </div>
    </div>
  </div>
</template>