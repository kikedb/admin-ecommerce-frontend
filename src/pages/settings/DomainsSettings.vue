<script setup>
import { ref } from 'vue'

const showConnectModal = ref(false)
const showBuyModal = ref(false)
const showDomainDetails = ref(false)
const selectedDomain = ref(null)

const domains = ref([
  { id: 1, name: 'bilbola.cl', isPrimary: true, status: 'Conectado', type: 'Dominio externo' },
  { id: 2, name: 'bilbola-store.myshopify.com', isPrimary: false, status: 'Conectado', type: 'Dominio alojado en Shopify' },
  { id: 3, name: 'www.bilbola.cl', isPrimary: false, status: 'Redirige a bilbola.cl', type: 'Redireccionamiento' }
])

const domainInput = ref('')
const searchInput = ref('')

const openDetails = (domain) => {
  selectedDomain.value = domain
  showDomainDetails.value = true
}

</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12 relative">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dominios</h1>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showConnectModal = true" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Conectar dominio existente
        </button>
        <button @click="showBuyModal = true" class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Comprar nuevo dominio
        </button>
      </div>
    </div>

    <!-- Lista -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between text-sm font-medium text-gray-500">
        <div class="w-1/2">Dominio</div>
        <div class="w-1/4 hidden md:block">Estado</div>
        <div class="w-1/4 text-right">Acciones</div>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="domain in domains" :key="domain.id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition group cursor-pointer" @click="openDetails(domain)">
          <div class="w-1/2 flex items-center gap-3">
            <div>
              <div class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                {{ domain.name }}
                <span v-if="domain.isPrimary" class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">Principal</span>
              </div>
              <div class="text-sm text-gray-500 mt-0.5">{{ domain.type }}</div>
            </div>
          </div>
          
          <div class="w-1/4 hidden md:block">
            <span v-if="domain.status === 'Conectado'" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-green-700">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {{ domain.status }}
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ domain.status }}
            </span>
          </div>

          <div class="w-1/4 text-right">
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Info box -->
    <div class="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div>
        <p class="text-sm font-medium">Shopify aloja tu tienda en bilbola-store.myshopify.com de forma predeterminada.</p>
        <p class="text-sm mt-1">Conectar un dominio personalizado hace que tu marca sea más reconocible y genera confianza en los clientes.</p>
      </div>
    </div>

    <!-- Modals -->
    <!-- Connect Domain Modal -->
    <div v-if="showConnectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Conectar dominio existente</h2>
          <button @click="showConnectModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Ingresa el dominio que ya posees. Te daremos las instrucciones para conectarlo ajustando los registros DNS en tu proveedor.</p>
          <input v-model="domainInput" type="text" placeholder="ejemplo.com" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showConnectModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
          <button @click="showConnectModal = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">Siguiente</button>
        </div>
      </div>
    </div>

    <!-- Buy Domain Modal -->
    <div v-if="showBuyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Comprar nuevo dominio</h2>
          <button @click="showBuyModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <div class="relative">
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input v-model="searchInput" type="text" placeholder="Busca un dominio..." class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div v-if="searchInput" class="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ searchInput }}.com</div>
                <div class="text-sm text-green-600 mt-1">Disponible</div>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-medium">$14.99 USD / año</span>
                <button class="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">Comprar</button>
              </div>
            </div>
            <div class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ searchInput }}.net</div>
                <div class="text-sm text-green-600 mt-1">Disponible</div>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-medium">$16.99 USD / año</span>
                <button class="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">Comprar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Domain Details Modal -->
    <div v-if="showDomainDetails && selectedDomain" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Detalles del dominio</h2>
          <button @click="showDomainDetails = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm text-gray-500 block">Nombre del dominio</label>
            <div class="font-medium text-gray-900 dark:text-white mt-1">{{ selectedDomain.name }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500 block">Tipo</label>
            <div class="text-gray-900 dark:text-white mt-1">{{ selectedDomain.type }}</div>
          </div>
          <div>
            <label class="text-sm text-gray-500 block">Estado</label>
            <div class="text-gray-900 dark:text-white mt-1 flex items-center gap-2">
              <span v-if="selectedDomain.status === 'Conectado'" class="w-2 h-2 rounded-full bg-green-500"></span>
              {{ selectedDomain.status }}
            </div>
          </div>
          
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <button v-if="!selectedDomain.isPrimary" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Hacer principal</button>
            <button class="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-red-50">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
