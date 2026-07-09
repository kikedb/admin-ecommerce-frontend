<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketingStore } from '@/stores/mockMarketing'

const router = useRouter()
const marketingStore = useMarketingStore()

const campaignName = ref('')
const selectedChannel = ref('email')
const selectedAudience = ref('all')
const utmTag = ref(`utm_campaign=promo_${Math.floor(Math.random()*1000)}`)

const showToast = ref(false)
const toastMessage = ref('')
const showEditorModal = ref(false)
const showAudienceModal = ref(false)

const showNotification = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const getChannelName = () => {
  switch(selectedChannel.value) {
    case 'email': return 'Correo electrónico'
    case 'sms': return 'SMS'
    case 'whatsapp': return 'WhatsApp'
    case 'audio': return 'Audio'
    default: return 'Desconocido'
  }
}

const handleSaveDraft = () => {
  if (!campaignName.value) {
    showNotification('Por favor, ingresa un nombre para la campaña.')
    return
  }
  marketingStore.addCampaign({ 
    name: campaignName.value,
    channel: getChannelName(),
    status: 'Borrador'
  })
  showNotification('Borrador guardado con éxito.')
  setTimeout(() => router.push('/admin/marketing/campaigns'), 1500)
}

const handleStartCampaign = () => {
  if (!campaignName.value) {
    showNotification('Por favor, ingresa un nombre para la campaña.')
    return
  }
  marketingStore.addCampaign({ 
    name: campaignName.value,
    channel: getChannelName(),
    status: 'Programado'
  })
  showNotification('Campaña programada exitosamente.')
  setTimeout(() => router.push('/admin/marketing/campaigns'), 1500)
}

const handleAudienceChange = () => {
  if (selectedAudience.value === 'custom') {
    showAudienceModal.value = true
  }
}

const goToVisualEditor = () => {
  showEditorModal.value = true
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-20">
    
    <!-- Top Bar -->
    <div class="bg-[#1a1a1a] text-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 rounded-b-xl">
      <div class="flex items-center gap-3">
        <RouterLink to="/admin/marketing/campaigns" class="p-1.5 hover:bg-gray-800 rounded-md transition text-gray-300 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </RouterLink>
        <div class="flex items-center gap-2 text-sm font-medium">
          <span class="text-gray-400">Campañas</span>
          <span class="text-gray-600">/</span>
          <span>Crear nueva campaña</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button @click="handleSaveDraft" class="px-4 py-1.5 text-sm font-medium text-white hover:text-gray-300 transition">
          Guardar borrador
        </button>
        <button @click="handleStartCampaign" class="px-4 py-1.5 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-100 transition shadow-sm">
          Activar Campaña
        </button>
      </div>
    </div>

    <!-- Configuration Wizard -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 md:p-8 space-y-8">
        
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Detalles Generales</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Asigna un nombre interno para identificar esta campaña en tus reportes.</p>
          <input 
            v-model="campaignName"
            type="text" 
            class="w-full text-lg px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm dark:text-white"
            placeholder="Ej. Promoción Especial de Navidad"
          >
        </div>

        <hr class="border-gray-100 dark:border-gray-700" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white mb-2">Canal Principal</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">¿Por dónde quieres contactar a tus clientes?</p>
            <div class="space-y-3">
              <label class="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition" :class="{'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20': selectedChannel === 'email'}">
                <input type="radio" v-model="selectedChannel" value="email" class="w-4 h-4 text-blue-600" />
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <span class="block text-sm font-semibold text-gray-900 dark:text-white">Correo Electrónico</span>
                    <span class="block text-xs text-gray-500">Ideal para contenido visual</span>
                  </div>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition" :class="{'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20': selectedChannel === 'sms'}">
                <input type="radio" v-model="selectedChannel" value="sms" class="w-4 h-4 text-blue-600" />
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                  </div>
                  <div>
                    <span class="block text-sm font-semibold text-gray-900 dark:text-white">Mensaje SMS</span>
                    <span class="block text-xs text-gray-500">Alta tasa de apertura rápida</span>
                  </div>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition" :class="{'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20': selectedChannel === 'whatsapp'}">
                <input type="radio" v-model="selectedChannel" value="whatsapp" class="w-4 h-4 text-blue-600" />
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <span class="block text-sm font-semibold text-gray-900 dark:text-white">WhatsApp</span>
                    <span class="block text-xs text-gray-500">Comunicación directa y conversacional</span>
                  </div>
                </div>
              </label>

              <label class="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition" :class="{'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20': selectedChannel === 'audio'}">
                <input type="radio" v-model="selectedChannel" value="audio" class="w-4 h-4 text-blue-600" />
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <span class="block text-sm font-semibold text-gray-900 dark:text-white">Llamada de Audio</span>
                    <span class="block text-xs text-gray-500">Mensajes de voz automatizados</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white mb-2">Público Objetivo</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">¿A quién va dirigida esta campaña?</p>
            <select v-model="selectedAudience" @change="handleAudienceChange" class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="all">Todos los suscriptores (Recomendado)</option>
              <option value="purchased">Clientes que han comprado antes</option>
              <option value="abandoned">Clientes con carritos abandonados</option>
              <option value="custom">Segmento personalizado...</option>
            </select>

            <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Regla de Seguimiento UTM</h3>
              <p class="text-xs text-gray-500 mb-2">Esta etiqueta se añadirá a tus enlaces para medir las ventas.</p>
              <input type="text" readonly :value="utmTag" class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 font-mono" />
            </div>
          </div>
        </div>

        <hr class="border-gray-100 dark:border-gray-700" />

        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Diseño y Contenido</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Crea el mensaje que verán tus clientes.</p>
          
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900/30">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Aún no has creado el contenido</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Utiliza nuestro editor visual para diseñar un mensaje atractivo que convierta.</p>
            <button @click="goToVisualEditor" class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
              Abrir Editor Visual
            </button>
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
    <!-- Custom Audience Modal -->
    <div v-if="showAudienceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Segmento Personalizado</h2>
          <button @click="showAudienceModal = false; selectedAudience = 'all'" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">Define las reglas para tu segmento personalizado.</p>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Criterio 1</label>
            <div class="flex gap-2">
              <select class="w-1/3 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                <option>Ubicación</option>
                <option>Total gastado</option>
                <option>Última compra</option>
              </select>
              <select class="w-1/3 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                <option>Es igual a</option>
                <option>Contiene</option>
                <option>Mayor que</option>
              </select>
              <input type="text" placeholder="Valor..." class="w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <button class="text-sm text-blue-600 hover:underline font-medium">+ Añadir otra condición</button>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showAudienceModal = false; selectedAudience = 'all'" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button @click="showAudienceModal = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Aplicar Segmento
          </button>
        </div>
      </div>
    </div>

    <!-- Visual Editor Modal -->
    <div v-if="showEditorModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl flex flex-col h-[85vh]">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-[#1a1a1a] rounded-t-2xl text-white">
          <h2 class="text-lg font-medium flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            Editor Visual: {{ campaignName || 'Nueva Campaña' }}
          </h2>
          <button @click="showEditorModal = false" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="flex-1 flex overflow-hidden">
          <!-- Sidebar / Blocks -->
          <div class="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto hidden md:block">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Bloques de Contenido</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 hover:shadow-sm transition">
                <svg class="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Texto</span>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 hover:shadow-sm transition">
                <svg class="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Imagen</span>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 hover:shadow-sm transition">
                <svg class="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Botón</span>
              </div>
            </div>
          </div>
          
          <!-- Canvas -->
          <div class="flex-1 bg-gray-100 dark:bg-black/20 p-8 overflow-y-auto flex justify-center">
            <div class="bg-white w-full max-w-md min-h-[600px] shadow-sm rounded-lg border border-gray-200 relative p-6">
              <div v-if="selectedChannel === 'email'" class="mb-4 pb-4 border-b border-gray-200">
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Asunto del correo</label>
                <input type="text" class="w-full text-sm font-semibold border-none p-0 focus:ring-0" placeholder="Escribe el asunto aquí..." />
              </div>
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 text-gray-400 hover:bg-gray-100 hover:border-blue-400 transition cursor-pointer">
                <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <p class="text-sm font-medium text-gray-500">Arrastra bloques de contenido aquí</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3 rounded-b-2xl">
          <button @click="showEditorModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button @click="showEditorModal = false; showNotification('Diseño guardado exitosamente.')" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Guardar diseño
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, 1rem);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
</style>
