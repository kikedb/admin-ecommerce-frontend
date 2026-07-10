<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import locationsService from '@/services/locations.service'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const notification = useNotification()

const locations = ref([])
const isLoading = ref(true)

const fetchLocations = async () => {
  try {
    isLoading.value = true
    const response = await locationsService.getLocations()
    locations.value = response.data.data
  } catch (error) {
    notification.error('Error al cargar las sucursales')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLocations()
})
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Sucursales</h1>
      </div>
      <button @click="router.push('/admin/settings/locations/new')" class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
        Agregar sucursal
      </button>
    </div>

    <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl">
      Administra los lugares donde llevas a cabo el control del inventario, despachas pedidos y vendes productos. <a href="#" class="text-blue-600 hover:underline">Aprende más sobre sucursales</a>
    </p>

    <!-- Locations List -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Tus sucursales</h2>
        <p class="text-sm text-gray-500 mt-1">Has usado 2 de 4 sucursales disponibles en tu plan.</p>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="location in locations" :key="location.id" class="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition cursor-pointer" @click="router.push(`/admin/settings/locations/${location.id}`)">
          <div>
            <div class="flex items-center gap-3">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ location.name }}</h3>
              <span v-if="location.isDefault" class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Predeterminada</span>
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ location.address }}</p>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
      </div>
    </section>

    <!-- POS Section -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="flex gap-4 items-start">
          <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Shopify POS Lite</h2>
            <p class="text-sm text-gray-500 mt-1">Tu plan actual incluye suscripciones a POS Lite para todas tus sucursales.</p>
          </div>
        </div>
        <div class="flex-shrink-0">
          <button @click="router.push('/admin/sales-channels')" class="whitespace-nowrap text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 shadow-sm transition">
            Ir a canales de ventas
          </button>
        </div>
      </div>
      <div class="px-6 pb-6">
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex justify-between items-center border border-gray-200 dark:border-gray-700">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">POS Lite</div>
          <div class="text-sm text-gray-500">{{ locations.length }} sucursales</div>
        </div>
      </div>
    </section>
  </div>
</template>
