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
const hasCustomSegment = ref(false)
const hasContent = ref(false)
const isPreviewMode = ref(false)

const segmentRules = ref([
  { id: Date.now(), field: 'Ubicación', operator: 'Es igual a', value: '' }
])

const addSegmentRule = () => {
  segmentRules.value.push({ id: Date.now(), field: 'Ubicación', operator: 'Es igual a', value: '' })
}

const removeSegmentRule = (index) => {
  segmentRules.value.splice(index, 1)
}

// Editor State
const editorBlocks = ref([])
const savedBlocks = ref([])

const addBlock = (type) => {
  editorBlocks.value.push({
    id: Date.now(),
    type,
    content: type === 'text' ? 'Escribe tu texto aquí...' : type === 'button' ? 'Comprar Ahora' : '',
    imageUrl: '',
    overlayText: '',
    buttonUrl: 'https://'
  })
}

// Drag & Drop
const draggedItemIndex = ref(null)
const dragEnabledIndex = ref(null)

const onDragStart = (index) => {
  draggedItemIndex.value = index
}

const onDrop = (index) => {
  if (draggedItemIndex.value === null) return
  const item = editorBlocks.value.splice(draggedItemIndex.value, 1)[0]
  editorBlocks.value.splice(index, 0, item)
  draggedItemIndex.value = null
}

const openCanva = (block) => {
  showNotification('Abriendo integración con Canva...')
  setTimeout(() => {
    block.imageUrl = 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=400&q=80'
    showNotification('Diseño de Canva importado con éxito.')
  }, 2000)
}

const removeBlock = (index) => {
  editorBlocks.value.splice(index, 1)
}

const handleImageUpload = (block, event) => {
  const file = event.target.files[0]
  if (file) {
    block.imageUrl = URL.createObjectURL(file)
  }
}

const saveDesign = () => {
  if (editorBlocks.value.length === 0) {
    showNotification('Agrega al menos un bloque a tu diseño.')
    return
  }
  savedBlocks.value = JSON.parse(JSON.stringify(editorBlocks.value))
  hasContent.value = true
  showEditorModal.value = false
  showNotification('Diseño guardado exitosamente.')
}

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
  if (!hasContent.value) {
    editorBlocks.value = []
  } else {
    editorBlocks.value = JSON.parse(JSON.stringify(savedBlocks.value))
  }
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
            <select v-model="selectedAudience" @change="handleAudienceChange" class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
              <option value="all">Todos los suscriptores (Recomendado)</option>
              <option value="purchased">Clientes que han comprado antes</option>
              <option value="abandoned">Clientes con carritos abandonados</option>
              <option value="custom">Segmento personalizado...</option>
            </select>
            
            <div v-if="selectedAudience === 'custom' && hasCustomSegment" class="mt-3 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{{ segmentRules.length }} regla(s) de segmento aplicada(s).</span>
              <button @click="showAudienceModal = true" class="ml-auto text-xs font-semibold hover:underline">Editar</button>
            </div>

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
          
          <div v-if="!hasContent" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900/30">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Aún no has creado el contenido</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Utiliza nuestro editor visual para diseñar un mensaje atractivo que convierta.</p>
            <button @click="goToVisualEditor" class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
              Abrir Editor Visual
            </button>
          </div>
          
          <!-- Preview of designed content -->
          <div v-else class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/30">
            <div class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Previsualización del Diseño</h3>
              <button @click="goToVisualEditor" class="text-xs font-medium text-blue-600 hover:underline">Editar diseño</button>
            </div>
            <div class="p-8 flex justify-center">
              <div class="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <div v-for="block in savedBlocks" :key="'prev-'+block.id" class="w-full">
                  <!-- Text Preview -->
                  <div v-if="block.type === 'text'" class="text-gray-800 text-sm whitespace-pre-wrap">{{ block.content }}</div>
                  
                  <!-- Image Preview -->
                  <div v-if="block.type === 'image'" class="w-full rounded-lg overflow-hidden flex justify-center bg-gray-100 py-2">
                    <img v-if="block.imageUrl" :src="block.imageUrl" class="max-w-full h-auto max-h-64 object-contain" />
                  </div>
                  
                  <!-- Button Preview -->
                  <div v-if="block.type === 'button'" class="w-full flex justify-center py-2">
                    <a :href="block.buttonUrl" target="_blank" class="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 shadow-sm transition inline-block">
                      {{ block.content }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
        <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p class="text-sm text-gray-600 dark:text-gray-400">Define las reglas para tu segmento personalizado.</p>
          
          <div v-for="(rule, index) in segmentRules" :key="rule.id" class="relative group">
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Criterio {{ index + 1 }}</label>
            <div class="flex gap-2 items-center">
              <select v-model="rule.field" class="w-1/3 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                <option>Ubicación</option>
                <option>Total gastado</option>
                <option>Última compra</option>
              </select>
              <select v-model="rule.operator" class="w-1/3 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                <option>Es igual a</option>
                <option>Contiene</option>
                <option>Mayor que</option>
              </select>
              <input type="text" v-model="rule.value" placeholder="Valor..." class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
              <button v-if="segmentRules.length > 1" @click="removeSegmentRule(index)" class="p-2 text-gray-400 hover:text-red-500 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
          
          <button @click="addSegmentRule" class="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1 mt-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Añadir otra condición
          </button>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showAudienceModal = false; if(!hasCustomSegment) selectedAudience = 'all'" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button @click="hasCustomSegment = true; showAudienceModal = false; showNotification('Segmento aplicado exitosamente')" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
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
          <div class="flex items-center gap-4">
            <button @click="isPreviewMode = !isPreviewMode" class="px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-lg transition flex items-center gap-2 text-white">
              <svg v-if="!isPreviewMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              {{ isPreviewMode ? 'Volver a Editar' : 'Previsualizar' }}
            </button>
            <button @click="showEditorModal = false" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        
        <div class="flex-1 flex overflow-hidden">
          <!-- Sidebar / Blocks -->
          <div v-if="!isPreviewMode" class="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto hidden md:block shrink-0">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Bloques de Contenido</h3>
            <div class="grid grid-cols-2 gap-3">
              <div @click="addBlock('text')" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 hover:shadow-sm transition">
                <svg class="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Texto</span>
              </div>
              <div @click="addBlock('image')" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 hover:shadow-sm transition">
                <svg class="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Imagen</span>
              </div>
              <div @click="addBlock('button')" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 hover:shadow-sm transition">
                <svg class="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Botón</span>
              </div>
            </div>
          </div>
          
          <!-- Canvas -->
          <div class="flex-1 bg-gray-100 dark:bg-black/20 p-8 overflow-y-auto flex justify-center items-start">
            
            <!-- Editor Container -->
            <div 
              class="relative transition-all duration-300"
              :class="selectedChannel === 'email' ? 'bg-white w-full max-w-2xl min-h-[600px] shadow-sm rounded-lg border border-gray-200 p-8' : 'bg-gray-50 w-full max-w-[320px] min-h-[650px] shadow-2xl rounded-[40px] border-[12px] border-gray-900 p-4 pt-8'"
            >
              
              <!-- Mobile Notch (Only for SMS/WhatsApp) -->
              <div v-if="selectedChannel !== 'email'" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl flex items-center justify-center gap-2">
                <div class="w-10 h-1.5 bg-gray-800 rounded-full"></div>
                <div class="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
              </div>

              <div v-if="selectedChannel === 'email'" class="mb-6 pb-4 border-b border-gray-200">
                <label v-if="!isPreviewMode" class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Asunto del correo</label>
                <input v-if="!isPreviewMode" type="text" class="w-full text-lg font-semibold border-none p-0 focus:ring-0 bg-transparent" placeholder="Escribe el asunto aquí..." />
                <div v-else class="text-lg font-semibold text-gray-900">Asunto: {{ campaignName || 'Nueva Campaña' }}</div>
              </div>
              
              <!-- Empty State -->
              <div v-if="editorBlocks.length === 0" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 text-gray-400 mt-4">
                <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <p class="text-sm font-medium text-gray-500 text-center px-4">Haz clic en los bloques de la izquierda para armar tu diseño</p>
              </div>
              
              <!-- Blocks Render (Drag & Drop container) -->
              <div class="space-y-3">
                <div 
                  v-for="(block, index) in editorBlocks" 
                  :key="block.id" 
                  class="relative group border border-transparent hover:border-blue-400 rounded-lg transition-colors bg-white shadow-sm"
                  :class="selectedChannel !== 'email' ? 'p-3 rounded-2xl bg-[#E8F0FE] ml-auto max-w-[85%] border-blue-100' : 'p-4 border-gray-100'"
                  :draggable="dragEnabledIndex === index"
                  @dragstart="onDragStart(index)"
                  @dragend="dragEnabledIndex = null; draggedItemIndex = null"
                  @dragover.prevent
                  @drop="onDrop(index)"
                >
                  
                  <!-- Drag Handle & Controls -->
                  <div 
                    class="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition z-10 cursor-move"
                    @mousedown="dragEnabledIndex = index"
                    @mouseup="dragEnabledIndex = null"
                    @mouseleave="dragEnabledIndex = null"
                  >
                    <div class="w-6 h-6 bg-gray-200 text-gray-600 rounded flex items-center justify-center">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
                    </div>
                  </div>
                  
                  <!-- Delete Button -->
                  <button v-if="!isPreviewMode" @click="removeBlock(index)" class="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm z-10 hover:bg-red-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
  
                  <!-- Text Block -->
                  <div v-if="block.type === 'text'">
                    <textarea v-if="!isPreviewMode" v-model="block.content" class="w-full min-h-[80px] p-2 text-sm text-gray-800 border-none bg-transparent focus:bg-white/50 rounded outline-none focus:ring-0 resize-y" placeholder="Escribe tu texto..."></textarea>
                    <div v-else class="text-sm text-gray-800 whitespace-pre-wrap p-2">{{ block.content }}</div>
                  </div>
  
                  <!-- Image Block -->
                  <div v-if="block.type === 'image'" class="flex flex-col gap-2">
                    <div v-if="block.imageUrl" class="relative w-full rounded overflow-hidden">
                      <img :src="block.imageUrl" class="w-full h-auto object-cover max-h-64 rounded-lg" />
                      <!-- Overlay Text -->
                      <div v-if="block.overlayText" class="absolute inset-0 flex items-center justify-center p-4">
                        <span class="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg">{{ block.overlayText }}</span>
                      </div>
                    </div>
                    <div v-else class="w-full h-32 bg-gray-100/50 flex flex-col items-center justify-center rounded border border-gray-200">
                      <svg class="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span class="text-xs text-gray-400">Sin imagen</span>
                    </div>
                    <div v-if="!isPreviewMode" class="flex flex-col gap-2 mt-2 border-t border-gray-100 pt-2">
                      <div>
                        <label class="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Texto sobre la imagen (Opcional)</label>
                        <input type="text" v-model="block.overlayText" placeholder="Ej. ¡Nueva Colección!" class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div class="flex items-center gap-2">
                        <input type="file" @change="e => handleImageUpload(block, e)" accept="image/*" class="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer w-full max-w-[180px]" />
                        <span class="text-gray-300 text-xs font-bold hidden sm:inline">o</span>
                        <button @click="openCanva(block)" class="text-xs px-3 py-1.5 font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 rounded flex items-center gap-1 shadow-sm transition whitespace-nowrap">
                          Diseñar con Canva
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <!-- Button Block -->
                  <div v-if="block.type === 'button'" class="flex flex-col gap-3 p-3 bg-transparent rounded-lg">
                    <div v-if="!isPreviewMode">
                      <label class="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Texto del Botón</label>
                      <input type="text" v-model="block.content" class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div v-if="!isPreviewMode">
                      <label class="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Enlace (URL)</label>
                      <input type="text" v-model="block.buttonUrl" class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                    </div>
                    <div class="flex justify-center mt-2">
                      <a :href="block.buttonUrl" target="_blank" @click.prevent="isPreviewMode ? null : ''" class="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 shadow-sm transition inline-block">
                        {{ block.content || 'Botón' }}
                      </a>
                    </div>
                  </div>
  
                </div>
              </div>

            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3 rounded-b-2xl shrink-0">
          <button @click="showEditorModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button @click="saveDesign" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
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
