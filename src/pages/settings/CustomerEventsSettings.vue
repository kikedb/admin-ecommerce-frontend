<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const pixels = ref([
  { id: 1, name: 'B2B Wholesale Pricing Discount', state: ['Web'], data: '' },
  { id: 2, name: 'facebook', state: ['Web'], data: '22 abr 2024' },
  { id: 3, name: 'google', state: ['Web'], data: '25 abr 2024' },
  { id: 4, name: 'Judge.me Product Reviews', state: ['Web'], data: '' },
  { id: 5, name: 'Pinterest', state: ['Web'], data: '' },
  { id: 6, name: 'Shopify Inbox', state: ['Web'], data: '' },
  { id: 7, name: 'Snapchat Ads', state: ['Web'], data: '' }
])
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Eventos del cliente</h1>
      </div>
      <div class="flex gap-2">
        <button @click="router.push('/admin/settings/customer-events/new')" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Agregar píxel personalizado
        </button>
        <button @click="router.push('/admin/sales-channels')" class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Explorar aplicaciones de píxeles
        </button>
      </div>
    </div>

    <!-- Píxeles de aplicaciones y personalizados -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Píxeles de aplicaciones y personalizados</h2>
        <p class="text-sm text-gray-500 mt-1">Conecta píxeles que registran el comportamiento de los clientes e integran con servicios externos.</p>
      </div>
      
      <div class="bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between text-sm font-medium text-gray-500 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div class="w-1/2 flex items-center gap-1 cursor-pointer">
          Píxeles
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
        </div>
        <div class="w-1/4">Estado</div>
        <div class="w-1/4">Datos</div>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="pixel in pixels" :key="pixel.id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition group cursor-pointer" @click="router.push(`/admin/settings/customer-events/${pixel.id}`)">
          <div class="w-1/2 flex items-center gap-3">
            <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <span class="font-medium text-gray-900 dark:text-white text-sm">{{ pixel.name }}</span>
          </div>
          
          <div class="w-1/4 flex gap-1.5 flex-wrap">
            <span v-for="s in pixel.state" :key="s" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" :class="s === 'Servidor' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
              <span v-if="s === 'Web'" class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span v-else class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {{ s }}
            </span>
          </div>

          <div class="w-1/4 flex items-center justify-between">
            <span v-if="pixel.data" class="text-sm text-gray-600">{{ pixel.data }}</span>
            <span v-else class="text-sm text-gray-400">—</span>
            
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600 rounded">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <div class="text-center mt-6">
      <a href="#" class="text-sm text-blue-600 hover:underline">Más información sobre píxeles</a>
    </div>
  </div>
</template>
