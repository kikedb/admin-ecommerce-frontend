<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isNew = route.params.id === 'new'

const pixel = ref({
  name: isNew ? '' : 'Facebook Pixel',
  id_pixel: isNew ? '' : '123456789',
  events: {
    page_view: true,
    add_to_cart: true,
    purchase: true,
    search: false
  },
  isActive: true
})
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button @click="router.back()" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </button>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ isNew ? 'Agregar píxel personalizado' : 'Editar píxel' }}</h1>
    </div>

    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del píxel</label>
          <input v-model="pixel.name" type="text" placeholder="Ej. Píxel de Meta, TikTok Pixel" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID del píxel (Identificador único)</label>
          <input v-model="pixel.id_pixel" type="text" placeholder="Ej. 1381283921893" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Eventos a rastrear</h3>
          <div class="space-y-3">
            <label class="flex items-center gap-3">
              <input type="checkbox" v-model="pixel.events.page_view" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Page View (Vistas de página)</span>
            </label>
            <label class="flex items-center gap-3">
              <input type="checkbox" v-model="pixel.events.add_to_cart" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Add To Cart (Agregar al carrito)</span>
            </label>
            <label class="flex items-center gap-3">
              <input type="checkbox" v-model="pixel.events.purchase" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Purchase (Compras)</span>
            </label>
            <label class="flex items-center gap-3">
              <input type="checkbox" v-model="pixel.events.search" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Search (Búsquedas en tienda)</span>
            </label>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <label class="flex items-center gap-3">
            <input type="checkbox" v-model="pixel.isActive" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Píxel Activo (Recopilando datos)</span>
          </label>
        </div>
      </div>
    </section>

    <!-- Save Bar -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 z-40">
      <button @click="router.back()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Descartar</button>
      <button @click="router.back()" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg hover:bg-gray-800 shadow-sm">Guardar píxel</button>
    </div>
  </div>
</template>
