<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketingStore } from '@/stores/mockMarketing'

const router = useRouter()
const marketingStore = useMarketingStore()

const isSaved = ref(false)
const showEmailEditor = ref(false)
const showTriggerModal = ref(false)
const showActionModal = ref(false)
const showDelayModal = ref(false)
const showNodeSelector = ref(false)
const editingNode = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const showNotification = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const flowNodes = ref([
  { id: 1, type: 'trigger', title: 'Disparador', subtitle: 'El cliente abandona el carrito', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'gray' },
  { id: 2, type: 'delay', title: 'Esperar 1 hora', subtitle: '', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'gray' },
  { id: 3, type: 'action', title: 'Enviar correo', subtitle: 'Recuperación de carrito 1', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'blue' }
])

const goBack = () => {
  router.back()
}

const addNode = () => {
  showNodeSelector.value = true
}

const selectNodeType = (type) => {
  if (type === 'action') {
    flowNodes.value.push({
      id: Date.now(),
      type: 'action',
      title: 'Enviar correo',
      subtitle: 'Nuevo mensaje',
      color: 'blue',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    })
  } else if (type === 'delay') {
    flowNodes.value.push({
      id: Date.now(),
      type: 'delay',
      title: 'Esperar 1 hora',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    })
  } else if (type === 'condition') {
    flowNodes.value.push({
      id: Date.now(),
      type: 'condition',
      title: '¿Abrió el correo?',
      color: 'purple',
      icon: 'M8 7h8M8 11h8M8 15h8M4 4h16v16H4V4z'
    })
  }
  showNodeSelector.value = false
}

const removeNode = (index) => {
  flowNodes.value.splice(index, 1)
}

const openEditor = (node) => {
  editingNode.value = node
  if (node.type === 'trigger') {
    showTriggerModal.value = true
  } else if (node.type === 'action') {
    showActionModal.value = true
  } else if (node.type === 'delay') {
    showDelayModal.value = true
  } else {
    showEmailEditor.value = true
  }
}

// Helper for delay modal to extract number and unit from "Esperar 1 hora"
const tempDelayNumber = ref(1)
const tempDelayUnit = ref('hora(s)')

const openDelayModal = (node) => {
  editingNode.value = node
  // Basic parsing for "Esperar X horas"
  const match = node.title.match(/Esperar (\d+)\s+(.+)/)
  if (match) {
    tempDelayNumber.value = parseInt(match[1]) || 1
    tempDelayUnit.value = match[2]
  }
  showDelayModal.value = true
}

const saveDelay = () => {
  if (editingNode.value) {
    editingNode.value.title = `Esperar ${tempDelayNumber.value} ${tempDelayUnit.value}`
  }
  showDelayModal.value = false
}

const handleSave = () => {
  // Add the automation as a campaign to the store
  const newCampaign = {
    id: Date.now(),
    subject: 'Automatización: ' + (flowNodes.value[0]?.subtitle || 'Flujo'),
    status: 'Activo',
    channel: 'Correo electrónico',
    openRate: '0%',
    clickRate: '0%',
    conversion: '0%',
    sales: '$0',
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  
  // unshift adds it to the beginning of the list
  marketingStore.campaigns.unshift(newCampaign)
  
  isSaved.value = true
  showNotification('Automatización guardada exitosamente y añadida a tus Campañas')
  setTimeout(() => {
    router.push('/admin/marketing/campaigns')
  }, 1500)
}
</script>

<template>
  <div class="h-[calc(100vh-theme(spacing.16))] flex flex-col bg-[#F1F2F4]">
    
    <!-- Top Bar (Shopify Style) -->
    <div class="bg-[#1a1a1a] text-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="p-1.5 hover:bg-gray-800 rounded-md transition text-gray-300 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div class="flex items-center gap-2 text-sm font-medium">
          <RouterLink to="/admin/marketing/automations" class="text-gray-400 hover:text-white transition">Automatizaciones</RouterLink>
          <span class="text-gray-600">/</span>
          <span>Editor visual (Borrador)</span>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <span v-if="!isSaved" class="text-sm text-gray-400 flex items-center gap-1.5">
          <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
          Cambios sin guardar
        </span>
        <span v-else class="text-sm text-green-400 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Guardado
        </span>
        <div class="flex items-center gap-2">
          <button @click="goBack" class="px-3 py-1.5 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-white text-sm font-medium rounded-md transition">
            Descartar
          </button>
          <button @click="handleSave" class="px-3 py-1.5 bg-white hover:bg-gray-100 text-black text-sm font-medium rounded-md transition">
            Guardar
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content: Visual Editor Canvas -->
    <div class="flex-1 overflow-y-auto relative bg-[#F9FAFB]">
      
      <!-- Grid Background -->
      <div class="absolute inset-0 z-0 pointer-events-none" style="background-image: radial-gradient(#e5e7eb 1px, transparent 1px); background-size: 20px 20px;"></div>

      <div class="relative z-10 p-10 flex flex-col items-center min-h-full pb-32">
        
        <template v-for="(node, index) in flowNodes" :key="node.id">
          
          <!-- Line before (except first) -->
          <div v-if="index > 0" class="w-0.5 h-12 bg-gray-300"></div>

          <!-- Node -->
          <div 
            v-if="node.type !== 'condition'"
            @click="node.type === 'delay' ? openDelayModal(node) : openEditor(node)"
            class="bg-white rounded-xl shadow-sm relative z-20 group transition flex flex-col items-center hover:-translate-y-1 hover:shadow-md"
            :class="[
              node.type === 'trigger' ? 'border-2 border-gray-900 p-4 w-72 cursor-pointer' : 
              node.type === 'delay' ? 'border border-gray-300 p-3 w-56 flex-row justify-center gap-2 cursor-pointer' : 
              'border-2 p-4 w-72 cursor-pointer',
              node.color === 'blue' ? 'border-blue-500 hover:border-blue-600' : 
              node.color === 'orange' ? 'border-orange-500 hover:border-orange-600' : ''
            ]"
          >
            <!-- Delete Button -->
            <button 
              v-if="node.type !== 'trigger'"
              @click.stop="removeNode(index)" 
              class="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm z-30"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div 
              v-if="node.type !== 'delay'"
              class="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
              :class="[
                node.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                node.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                'bg-gray-100 text-gray-700'
              ]"

            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="node.icon"></path></svg>
            </div>
            
            <svg v-if="node.type === 'delay'" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="node.icon"></path></svg>

            <div>
              <h3 v-if="node.type !== 'delay'" class="font-bold text-gray-900 text-sm">{{ node.title }}</h3>
              <span v-if="node.type === 'delay'" class="text-xs font-medium text-gray-700">{{ node.title }}</span>
              <p v-if="node.subtitle" class="text-xs text-gray-500 mt-1">{{ node.subtitle }}</p>
            </div>

            <button 
              v-if="node.type === 'action'" 
              @click.stop="showEmailEditor = true; editingNode = node"
              class="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition w-full"
              :class="node.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'"
            >
              Editar contenido
            </button>
          </div>

          <!-- Condition Node (Bifurcation) -->
          <div v-if="node.type === 'condition'" class="flex flex-col items-center relative w-full z-20 group">
            
            <div class="border-2 border-purple-500 bg-white p-4 w-72 rounded-xl shadow-sm cursor-pointer hover:-translate-y-1 transition relative">
              <button 
                @click.stop="removeNode(index)" 
                class="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm z-30"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div class="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 bg-purple-50 text-purple-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8M8 11h8M8 15h8M4 4h16v16H4V4z"></path></svg>
              </div>
              <h3 class="font-bold text-gray-900 text-sm text-center">{{ node.title }}</h3>
            </div>
            
            <!-- Splitting visual -->
            <div class="flex w-full max-w-[400px] mt-6">
              <div class="flex-1 flex flex-col items-center relative">
                <!-- horizontal line left -->
                <div class="absolute top-0 left-1/2 right-0 h-0.5 bg-gray-300"></div>
                <!-- vertical line down -->
                <div class="w-0.5 h-6 bg-gray-300 absolute top-0"></div>
                <div class="bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 text-xs font-bold rounded mt-3 z-10 shadow-sm relative">Sí</div>
                <div class="w-0.5 h-6 bg-gray-300"></div>
                <!-- Mini placeholder node for branch -->
                <div class="border border-dashed border-gray-400 p-3 rounded-lg text-gray-500 text-xs w-36 text-center bg-gray-50 mt-1">Sigue el flujo...</div>
              </div>
              <div class="flex-1 flex flex-col items-center relative">
                <!-- horizontal line right -->
                <div class="absolute top-0 left-0 right-1/2 h-0.5 bg-gray-300"></div>
                <!-- vertical line down -->
                <div class="w-0.5 h-6 bg-gray-300 absolute top-0"></div>
                <div class="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 text-xs font-bold rounded mt-3 z-10 shadow-sm relative">No</div>
                <div class="w-0.5 h-6 bg-gray-300"></div>
                <div class="border border-dashed border-gray-400 p-3 rounded-lg text-gray-500 text-xs w-36 text-center bg-gray-50 mt-1">Termina flujo</div>
              </div>
            </div>
          </div>

          
        </template>

        <!-- Final Line -->
        <div class="w-0.5 h-12 bg-gray-300"></div>

        <!-- Add Button -->
        <button @click="addNode" class="w-10 h-10 bg-white border border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-900 transition shadow-sm z-20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </button>

      </div>
    </div>

    <!-- Email Editor Modal -->
    <div v-if="showEmailEditor" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl flex flex-col h-[80vh]">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-[#1a1a1a] rounded-t-2xl text-white">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <h2 class="text-lg font-medium">Redactar correo: {{ editingNode?.subtitle }}</h2>
          </div>
          <button @click="showEmailEditor = false" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <!-- Editor Body -->
        <div class="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div class="space-y-4 max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Asunto</label>
              <input type="text" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white font-medium" value="Tus artículos te están esperando 🛒" />
            </div>
            
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Contenido (Arrastra y suelta bloques)</label>
              <!-- Mock Visual Editor Area -->
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 text-gray-400 hover:bg-gray-100 hover:border-blue-400 transition cursor-pointer">
                <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p>Haz clic para añadir un bloque de imagen</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Editor Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3 rounded-b-2xl">
          <button @click="showEmailEditor = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button @click="showEmailEditor = false; showNotification('Diseño guardado exitosamente.')" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Guardar diseño
          </button>
        </div>
      </div>
    </div>
    
    <!-- Node Selector Modal -->
    <div v-if="showNodeSelector" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Añadir Módulo</h2>
          <button @click="showNodeSelector = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div @click="selectNodeType('action')" class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition bg-gray-50 dark:bg-gray-900/50">
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Acción</h3>
            <p class="text-xs text-gray-500 mt-1">Enviar un correo, SMS o mensaje</p>
          </div>
          
          <div @click="selectNodeType('delay')" class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:border-gray-500 hover:shadow-md transition bg-gray-50 dark:bg-gray-900/50">
            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Espera (Tiempo)</h3>
            <p class="text-xs text-gray-500 mt-1">Pausa el flujo temporalmente</p>
          </div>

          <div @click="selectNodeType('condition')" class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:border-purple-500 hover:shadow-md transition bg-gray-50 dark:bg-gray-900/50">
            <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8M8 11h8M8 15h8M4 4h16v16H4V4z"></path></svg>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Condición Sí/No</h3>
            <p class="text-xs text-gray-500 mt-1">Divide el flujo basado en reglas</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Trigger Editor Modal -->
    <div v-if="showTriggerModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Disparador</h2>
          <button @click="showTriggerModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">¿Qué inicia esta automatización?</label>
            <select v-if="editingNode" v-model="editingNode.subtitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none">
              <option>El cliente abandona el carrito</option>
              <option>El cliente realiza una compra</option>
              <option>El cliente se suscribe al boletín</option>
              <option>El cliente cumple años</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 flex justify-end gap-3">
          <button @click="showTriggerModal = false" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
    
    <!-- Action Editor Modal -->
    <div v-if="showActionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Configurar Acción</h2>
          <button @click="showActionModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de mensaje</label>
            <select v-if="editingNode" v-model="editingNode.title" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Enviar correo">Correo electrónico</option>
              <option value="Enviar SMS">Mensaje SMS</option>
              <option value="Enviar WhatsApp">WhatsApp</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre interno</label>
            <input v-if="editingNode" type="text" v-model="editingNode.subtitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 flex justify-end gap-3">
          <button @click="showActionModal = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Aplicar
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delay Editor Modal -->
    <div v-if="showDelayModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Configurar Espera</h2>
          <button @click="showDelayModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo a esperar</label>
          <div class="flex gap-2">
            <input type="number" min="1" v-model="tempDelayNumber" class="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <select v-model="tempDelayUnit" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="minuto(s)">Minutos</option>
              <option value="hora(s)">Horas</option>
              <option value="día(s)">Días</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 flex justify-end gap-3">
          <button @click="saveDelay" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Aplicar
          </button>
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

  </div>
</template>
