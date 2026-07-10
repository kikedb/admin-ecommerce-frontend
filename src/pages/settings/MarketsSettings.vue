<script setup>
import { ref } from 'vue'

const showAddMarketModal = ref(false)
const showMarketDetails = ref(false)
const selectedMarket = ref(null)
const newMarketName = ref('')

const markets = ref([
  { id: 1, name: 'Chile', type: 'Mercado principal', status: 'Activo', customers: 'Todos', currency: 'CLP', languages: 'Español' },
  { id: 2, name: 'Latinoamérica', type: 'Mercado internacional', status: 'Inactivo', customers: '0', currency: 'USD', languages: 'Español, Inglés' },
])

const openDetails = (market) => {
  selectedMarket.value = market
  showMarketDetails.value = true
}

const addMarket = () => {
  if (newMarketName.value) {
    markets.value.push({
      id: Date.now(),
      name: newMarketName.value,
      type: 'Mercado internacional',
      status: 'Inactivo',
      customers: '0',
      currency: 'USD',
      languages: 'Español'
    })
    showAddMarketModal.value = false
    newMarketName.value = ''
  }
}
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12 relative">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Mercados</h1>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showAddMarketModal = true" class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Agregar mercado
        </button>
      </div>
    </div>
    
    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Aumenta las ventas globales creando experiencias de compra localizadas. Gestiona divisas, idiomas, precios y más para cada región.</p>

    <!-- Lista -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between text-sm font-medium text-gray-500">
        <div class="w-2/5">Mercado</div>
        <div class="w-1/5 hidden sm:block">Estado</div>
        <div class="w-1/5 hidden md:block">Moneda</div>
        <div class="w-1/5 text-right">Acciones</div>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="market in markets" :key="market.id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition group cursor-pointer" @click="openDetails(market)">
          <div class="w-2/5">
            <div class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              {{ market.name }}
              <span v-if="market.type === 'Mercado principal'" class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">Principal</span>
            </div>
          </div>
          
          <div class="w-1/5 hidden sm:block">
            <span v-if="market.status === 'Activo'" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-green-700 bg-green-50">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {{ market.status }}
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-gray-600 bg-gray-100">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              {{ market.status }}
            </span>
          </div>

          <div class="w-1/5 hidden md:block text-sm text-gray-600">
            {{ market.currency }}
          </div>

          <div class="w-1/5 text-right flex justify-end">
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal: Agregar Mercado -->
    <div v-if="showAddMarketModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Agregar mercado</h2>
          <button @click="showAddMarketModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del mercado</label>
          <input type="text" v-model="newMarketName" placeholder="Ej: Europa, Estados Unidos" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
          <p class="text-xs text-gray-500 mt-2">Los compradores de esta región verán precios y opciones adaptadas a ellos.</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showAddMarketModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
          <button @click="addMarket" :disabled="!newMarketName" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">Guardar mercado</button>
        </div>
      </div>
    </div>

    <!-- Modal: Detalles del mercado -->
    <div v-if="showMarketDetails && selectedMarket" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedMarket.name }}</h2>
            <span v-if="selectedMarket.type === 'Mercado principal'" class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">Principal</span>
          </div>
          <button @click="showMarketDetails = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Estado</label>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedMarket.status }}</div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Tipo de mercado</label>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedMarket.type }}</div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Divisa de pago</label>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedMarket.currency }}</div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Idiomas</label>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedMarket.languages }}</div>
            </div>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-700" />
          
          <div>
             <h3 class="font-medium text-gray-900 dark:text-white mb-2">Configuración regional</h3>
             <button class="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
               <span class="text-sm text-gray-700 dark:text-gray-300">Dominio y subcarpetas</span>
               <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
             <button class="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition mt-3">
               <span class="text-sm text-gray-700 dark:text-gray-300">Impuestos y aranceles</span>
               <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
             </button>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
          <button v-if="selectedMarket.type !== 'Mercado principal'" class="text-sm font-medium text-red-600 hover:text-red-700">Eliminar mercado</button>
          <div v-else></div>
          <button @click="showMarketDetails = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>
