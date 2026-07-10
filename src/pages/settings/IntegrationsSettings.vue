<script setup>
import { ref } from 'vue'

const integrations = ref([
  {
    id: 'canva',
    name: 'Canva Design API',
    description: 'Permite diseñar imágenes para correos, WhatsApp y tiendas directamente usando Canva.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    status: 'connected',
    apiKey: 'cnv_************************89a',
    lastSync: 'Hoy, 14:32'
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    description: 'Potencia el generador de textos e ideas en tus automatizaciones de marketing.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    status: 'disconnected',
    apiKey: '',
    lastSync: '-'
  },
  {
    id: 'meta',
    name: 'API de WhatsApp Business',
    description: 'Envía mensajes de WhatsApp de forma automatizada desde tus flujos de marketing.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    status: 'connected',
    apiKey: 'waba_**********************22x',
    lastSync: 'Hoy, 09:15'
  }
])

const showToast = ref(false)
const toastMessage = ref('')

const showAddModal = ref(false)
const newApi = ref({
  name: '',
  description: '',
  apiKey: ''
})

const addApi = () => {
  if (!newApi.value.name || !newApi.value.apiKey) {
    showNotification('El nombre y la API Key son obligatorios.')
    return
  }
  
  integrations.value.push({
    id: 'custom_' + Date.now(),
    name: newApi.value.name,
    description: newApi.value.description || 'API personalizada.',
    icon: '',
    status: 'connected',
    apiKey: newApi.value.apiKey,
    lastSync: 'Recién conectado'
  })
  
  showNotification(`API "${newApi.value.name}" conectada exitosamente.`)
  showAddModal.value = false
  newApi.value = { name: '', description: '', apiKey: '' }
}

const activeTab = ref('apis')
const fbActiveTab = ref('general')

const toggleConnection = (integration) => {
  if (integration.status === 'connected') {
    integration.status = 'disconnected'
    integration.apiKey = ''
    integration.lastSync = '-'
    showNotification(`${integration.name} desconectado exitosamente.`)
  } else {
    integration.status = 'connected'
    integration.apiKey = `${integration.id}_` + Math.random().toString(36).substr(2, 20)
    integration.lastSync = 'Recién conectado'
    showNotification(`${integration.name} conectado exitosamente.`)
  }
}

const showNotification = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Integraciones y APIs</h1>
      </div>
      <button v-if="activeTab === 'apis'" @click="showAddModal = true" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Añadir nueva API
      </button>
    </div>

    <!-- Main Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button 
          @click="activeTab = 'apis'"
          :class="activeTab === 'apis' ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition"
        >
          APIs y Credenciales
        </button>
        <button 
          @click="activeTab = 'facebook'"
          :class="activeTab === 'facebook' ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
          class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition flex items-center gap-2"
        >
          <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook & Instagram
        </button>
      </nav>
    </div>

    <!-- APIs Content -->
    <div v-show="activeTab === 'apis'" class="space-y-6">

    <!-- Info banner -->
    <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3">
      <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div>
        <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-100">Gestión centralizada de credenciales</h3>
        <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">Conecta tus cuentas de terceros para potenciar las herramientas de tu tienda. Estas credenciales se usarán globalmente en todas las apps y módulos como Marketing y Productos.</p>
      </div>
    </div>

    <!-- Integrations List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Aplicaciones conectadas</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Administra los tokens y llaves de acceso para las plataformas asociadas.</p>
      </div>
      
      <div class="divide-y divide-gray-100 dark:divide-gray-700">
        <div v-for="integration in integrations" :key="integration.id" class="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
          
          <div class="flex gap-4 items-start">
            <!-- Icon -->
            <div class="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 flex items-center justify-center p-2 flex-shrink-0 shadow-sm">
              <img v-if="integration.icon" :src="integration.icon" :alt="integration.name" class="w-full h-full object-contain" />
              <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            
            <!-- Details -->
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ integration.name }}</h3>
                <span v-if="integration.status === 'connected'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Conectado</span>
                <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Desconectado</span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg">{{ integration.description }}</p>
              
              <div v-if="integration.status === 'connected'" class="mt-3 flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 font-mono">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                  {{ integration.apiKey }}
                </div>
                <span class="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Sincronizado: {{ integration.lastSync }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
            <button 
              @click="toggleConnection(integration)"
              :class="integration.status === 'connected' ? 'bg-white border-red-200 text-red-600 hover:bg-red-50 dark:bg-gray-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30' : 'bg-gray-900 text-white border-transparent hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'"
              class="w-full sm:w-auto px-4 py-2 text-sm font-medium border rounded-lg transition shadow-sm"
            >
              {{ integration.status === 'connected' ? 'Desconectar' : 'Conectar cuenta' }}
            </button>
          </div>
          
        </div>
      </div>
    </div>
    </div>
    <!-- Facebook Content -->
    <div v-show="activeTab === 'facebook'" class="space-y-6">
      
      <!-- Sub Tabs Facebook -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-6">
          <button 
            @click="fbActiveTab = 'general'"
            :class="fbActiveTab === 'general' ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            class="whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition"
          >
            Información general
          </button>
          <button 
            @click="fbActiveTab = 'config'"
            :class="fbActiveTab === 'config' ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            class="whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition"
          >
            Configuración
          </button>
        </nav>
      </div>

      <!-- General Info (Facebook) -->
      <div v-show="fbActiveTab === 'general'" class="space-y-6">
        <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex justify-between items-start">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-100">Meta destacará los códigos promocionales y ofertas de suscripción a correos electrónicos en tus anuncios</h3>
              <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">Meta sincronizará ofertas de Shopify y las mostrará en los anuncios con enlaces a tu tienda y sitio web.</p>
            </div>
          </div>
          <button class="text-blue-500 hover:text-blue-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- FB Shop -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Tienda de Facebook</h3>
            <span class="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium mt-1 mb-1">Desactivado</span>
            <p class="text-sm text-gray-500 mb-4">Bilbola</p>
            <button class="text-blue-600 hover:text-blue-700 text-sm font-medium transition">Personalizar tienda &nearr;</button>
          </div>
          
          <!-- IG Shop -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.822a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Tienda de Instagram</h3>
            <span class="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium mt-1 mb-1">Desactivado</span>
            <p class="text-sm text-gray-500 mb-4">Bilbola</p>
            <button class="text-blue-600 hover:text-blue-700 text-sm font-medium transition">Personalizar tienda &nearr;</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Status -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Estado del producto</h3>
            <div class="flex items-center justify-between mb-2 text-sm">
              <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded-md font-medium">Aprobado</span>
              <span class="text-gray-700 dark:text-gray-300">256 productos</span>
            </div>
            <div class="flex items-center justify-between mb-4 text-sm">
              <span class="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md font-medium">Con problemas</span>
              <span class="text-gray-700 dark:text-gray-300">1 producto</span>
            </div>
            <button class="text-blue-600 hover:text-blue-700 text-sm mb-4 block w-full text-left">Ver todos los productos sincronizados</button>
            <div class="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center text-sm font-medium cursor-pointer text-gray-800 dark:text-gray-200">
              Catálogo de productos conectado
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          <!-- Discounts -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Estado de los descuentos</h3>
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-lg flex gap-3 flex-col items-center text-center">
              <div class="flex gap-2 text-blue-800 dark:text-blue-200 text-sm">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p>Aún no hay descuentos asociados a tu tienda. Ve a Shopify para crear y sincronizar los descuentos.</p>
              </div>
              <button class="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 shadow-sm mt-2">
                Administrar en Shopify
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración (Facebook) -->
      <div v-show="fbActiveTab === 'config'" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Configuración</h2>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-semibold text-gray-900 dark:text-white">Comparte datos</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Elige tus preferencias de uso compartido de datos. Shopify mantendrá tu configuración actualizada con las tecnologías más eficaces y adecuadas. <a href="#" class="text-blue-600 hover:underline">Más información &nearr;</a>
          </p>

          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex gap-4 items-start">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 relative">
               <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
               <div class="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white"></div>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-gray-900 dark:text-white">Máximo</h4>
                <button class="text-blue-600 text-sm hover:underline">Cambiar</button>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Los datos de actividad de los clientes se comparten mediante el píxel de Meta, las coincidencias avanzadas y la API de conversiones. Los clientes pueden desconectar estos datos de su cuenta de Facebook cambiando la configuración de la actividad fuera de Facebook.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Con este conjunto de datos se registrará el comportamiento</h3>
          
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex justify-between items-center">
            <div class="flex gap-4 items-center">
              <div class="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">Píxel de BILBOLA CTA PUBLICITARIA</h4>
                <p class="text-xs text-gray-500">Pertenece a Bilbola Store</p>
                <a href="#" class="text-xs text-blue-600 hover:underline">Identificador: 540900369816921 &nearr;</a>
              </div>
            </div>
            <button class="text-blue-600 text-sm hover:underline">Cambiar</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up"
    >
      <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span class="text-sm font-medium">{{ toastMessage }}</span>
    </div>

    <!-- Add API Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Conectar nueva API</h2>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4 flex-1">
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nombre de la Aplicación o Servicio</label>
            <input type="text" v-model="newApi.name" placeholder="Ej. Mailchimp, Shopify, etc." class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Descripción (Opcional)</label>
            <input type="text" v-model="newApi.description" placeholder="¿Para qué usarás esta API?" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Clave Secreta (API Key / Token)</label>
            <input type="password" v-model="newApi.apiKey" placeholder="Copia y pega la llave aquí..." class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono text-gray-900 dark:text-white" />
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showAddModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">
            Cancelar
          </button>
          <button @click="addApi" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">
            Guardar y Conectar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translate(-50%, 10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
</style>
