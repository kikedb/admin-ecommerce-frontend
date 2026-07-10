<script setup>
import { ref } from 'vue'

const channels = ref([
  { id: 'online_store', name: 'Tienda online', actionNeeded: true, description: 'Vende online y personaliza tu tienda.' },
  { id: 'pos', name: 'Point of Sale', actionNeeded: false, description: 'Vende en persona en sucursales minoristas.' },
  { id: 'google', name: 'Google & YouTube', actionNeeded: false, description: 'Llega a clientes que buscan en Google.' },
  { id: 'shop', name: 'Shop', actionNeeded: false, description: 'Aparece en la app de compras de Shop.' },
  { id: 'facebook', name: 'Facebook & Instagram', actionNeeded: false, description: 'Vende productos en redes sociales.' }
])

const showModal = ref(false)
const selectedChannel = ref(null)

const openChannel = (channel) => {
  selectedChannel.value = channel
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedChannel.value = null
}
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path></svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Canales de ventas</h1>
    </div>

    <!-- Filtros mock -->
    <div class="flex items-center gap-2 mb-4">
      <button class="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium">Instaladas</button>
      <button class="text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium transition">Recomendadas</button>
    </div>

    <!-- Lista -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between text-sm font-medium text-gray-500">
        <div class="w-1/2">Canal</div>
        <div class="w-1/4 hidden md:block">Estado</div>
        <div class="w-1/4 text-right">Acciones</div>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="channel in channels" :key="channel.id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition group">
          <div class="w-1/2 flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                {{ channel.name }}
                <span v-if="channel.actionNeeded" class="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">Acción necesaria</span>
              </div>
              <div class="text-sm text-gray-500 truncate mt-0.5 max-w-[200px] sm:max-w-xs">{{ channel.description }}</div>
            </div>
          </div>
          
          <div class="w-1/4 hidden md:block">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Instalada</span>
          </div>

          <div class="w-1/4 text-right">
            <button @click="openChannel(channel)" class="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-blue-600 font-medium hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md">
              Abrir
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Funcional -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Configuración de {{ selectedChannel?.name }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ selectedChannel?.description }}
          </p>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">Panel en construcción</h3>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Pronto podrás modificar todos los aspectos del canal de ventas {{ selectedChannel?.name }} desde esta vista.
            </p>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Cerrar
          </button>
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">
            Gestionar en el canal
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
