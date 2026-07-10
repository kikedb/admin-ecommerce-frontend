<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import locationsService from '@/services/locations.service'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const route = useRoute()
const notification = useNotification()
const isNew = route.params.id === 'new'

const isLoading = ref(false)
const isSaving = ref(false)

const location = ref({
  name: '',
  address: '',
  city: '',
  region: '',
  phone: '',
  isActive: true,
  fulfillOnline: true
})

const fetchLocation = async () => {
  if (isNew) return
  
  try {
    isLoading.value = true
    const response = await locationsService.getLocationById(route.params.id)
    location.value = response.data.data
  } catch (error) {
    notification.error('Error al cargar la sucursal')
  } finally {
    isLoading.value = false
  }
}

const saveLocation = async () => {
  try {
    isSaving.value = true
    if (isNew) {
      await locationsService.createLocation(location.value)
      notification.success('Sucursal creada correctamente')
    } else {
      await locationsService.updateLocation(route.params.id, location.value)
      notification.success('Sucursal actualizada correctamente')
    }
    router.back()
  } catch (error) {
    notification.error('Error al guardar la sucursal')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchLocation()
})
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button @click="router.back()" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </button>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ isNew ? 'Agregar sucursal' : 'Editar sucursal' }}</h1>
    </div>

    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la sucursal</label>
          <input v-model="location.name" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
          <input v-model="location.address" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</label>
          <input v-model="location.city" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
          <input v-model="location.phone" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <label class="flex items-center gap-3">
            <input type="checkbox" v-model="location.fulfillOnline" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Preparar pedidos online desde esta sucursal</span>
          </label>
        </div>
      </div>
    </section>

    <!-- Save Bar -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 z-40">
      <button @click="router.back()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Descartar</button>
      <button @click="saveLocation" :disabled="isSaving" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg hover:bg-gray-800 shadow-sm flex items-center gap-2">
        <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Guardar sucursal
      </button>
    </div>
  </div>
</template>
