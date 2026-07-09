<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isSaved = ref(false)
const showEmailEditor = ref(false)
const editingNode = ref(null)

const flowNodes = ref([
  { id: 1, type: 'trigger', title: 'Disparador', subtitle: 'El cliente abandona el carrito', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'gray' },
  { id: 2, type: 'delay', title: 'Esperar 1 hora', subtitle: '', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'gray' },
  { id: 3, type: 'action', title: 'Enviar correo', subtitle: 'Recuperación de carrito 1', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'blue' }
])

const goBack = () => {
  router.back()
}

const addNode = () => {
  flowNodes.value.push(
    { id: Date.now(), type: 'delay', title: 'Esperar 24 horas', subtitle: '', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'gray' },
    { id: Date.now() + 1, type: 'action', title: 'Enviar correo', subtitle: 'Recuperación de carrito 2', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'orange' }
  )
}

const openEditor = (node) => {
  editingNode.value = node
  showEmailEditor.value = true
}

const handleSave = () => {
  isSaved.value = true
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
          <span class="text-gray-400">Automatizaciones</span>
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
            class="bg-white rounded-xl shadow-sm relative z-20 group transition flex flex-col items-center"
            :class="[
              node.type === 'trigger' ? 'border-2 border-gray-900 p-4 w-72' : 
              node.type === 'delay' ? 'border border-gray-300 p-3 w-56 flex-row justify-center gap-2' : 
              'border-2 p-4 w-72 cursor-pointer',
              node.color === 'blue' ? 'border-blue-500 hover:border-blue-600' : 
              node.color === 'orange' ? 'border-orange-500 hover:border-orange-600' : ''
            ]"
          >
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
              @click="openEditor(node)"
              class="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition w-full"
              :class="node.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'"
            >
              Editar correo
            </button>
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
          <button @click="showEmailEditor = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Guardar diseño
          </button>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
