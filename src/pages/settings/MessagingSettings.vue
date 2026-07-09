<script setup>
import { ref } from 'vue'

const isSophiaEnabled = ref(true)
const isChatWidgetEnabled = ref(true)
const inboxEmail = ref('soporte@bilbola.cl')

const isSofiaModalOpen = ref(false)
const activeChannel = ref(null)

const toggleChannel = (id) => {
  activeChannel.value = activeChannel.value === id ? null : id
}
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-[#F1F2F4] p-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center text-sm text-gray-500 mb-2">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        <h1 class="text-xl font-semibold text-gray-900">Mensajería y Atención al Cliente</h1>
      </div>

      <!-- Resumen de Canales -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-1">Bandeja de entrada compartida (Inbox)</h2>
          <p class="text-sm text-gray-500 mb-4">Centraliza todos los mensajes de tus clientes, correos de soporte y chats en vivo en un solo lugar.</p>
          
          <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <div>
                <p class="text-sm font-medium text-gray-900">Correo principal de soporte</p>
                <p class="text-sm text-gray-500">{{ inboxEmail }}</p>
              </div>
            </div>
            <button class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Gestionar Inbox</button>
          </div>
        </div>
      </div>

      <!-- Categories / Canales de Mensajería -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
        
        <!-- Agente IA Sofía -->
        <div>
          <div @click="toggleChannel('sofia')" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
            <div class="flex items-start gap-4">
              <svg class="w-5 h-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Agente Inteligente "Sofía"</h3>
                <p class="text-sm text-gray-500">Respuestas automáticas basadas en IA para consultas frecuentes (Stock, Tallas, Envíos)</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="isSophiaEnabled" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Activa</span>
              <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inactiva</span>
              <svg class="w-5 h-5 text-gray-400 transform transition-transform" :class="{ 'rotate-90': activeChannel === 'sofia' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
          <div v-if="activeChannel === 'sofia'" class="p-4 bg-gray-50 border-t border-gray-100">
            <p class="text-sm text-gray-600 mb-4">Sofía analiza tu catálogo y políticas para responder automáticamente el 80% de las preguntas de los clientes en el chat y WhatsApp.</p>
            <div class="flex gap-3">
              <button @click="isSophiaEnabled = !isSophiaEnabled" class="px-3 py-1.5 text-sm font-medium rounded-lg transition" :class="isSophiaEnabled ? 'text-red-700 bg-red-50 hover:bg-red-100' : 'text-green-700 bg-green-50 hover:bg-green-100'">
                {{ isSophiaEnabled ? 'Desactivar a Sofía' : 'Activar a Sofía' }}
              </button>
              <button @click="isSofiaModalOpen = true" class="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition">Entrenar IA (Reglas)</button>
            </div>
          </div>
        </div>

        <!-- Chat Widget -->
        <div>
          <div @click="toggleChannel('widget')" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
            <div class="flex items-start gap-4">
              <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Burbuja de Chat en la tienda</h3>
                <p class="text-sm text-gray-500">Añade un chat flotante en tu sitio web para conversar en tiempo real</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="isChatWidgetEnabled" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Instalado</span>
              <svg class="w-5 h-5 text-gray-400 transform transition-transform" :class="{ 'rotate-90': activeChannel === 'widget' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
          <div v-if="activeChannel === 'widget'" class="p-4 bg-gray-50 border-t border-gray-100">
             <div class="space-y-3">
               <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <span class="text-sm text-gray-700">Mostrar mensaje de bienvenida proactivo</span></label>
               <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <span class="text-sm text-gray-700">Pedir correo electrónico antes de iniciar el chat</span></label>
             </div>
             <button class="mt-4 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Personalizar diseño (Colores)</button>
          </div>
        </div>

        <!-- Redes Sociales y WhatsApp -->
        <div>
          <div @click="toggleChannel('social')" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
            <div class="flex items-start gap-4">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">WhatsApp y Redes Sociales</h3>
                <p class="text-sm text-gray-500">Conecta WhatsApp Business, Instagram DM y Facebook Messenger</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 transform transition-transform" :class="{ 'rotate-90': activeChannel === 'social' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div v-if="activeChannel === 'social'" class="p-4 bg-gray-50 border-t border-gray-100">
             <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
               <div class="border border-gray-200 bg-white p-3 rounded flex items-center justify-between">
                 <span class="text-sm font-medium text-gray-700">WhatsApp API</span>
                 <button class="text-sm text-blue-600 hover:underline">Conectar</button>
               </div>
               <div class="border border-gray-200 bg-white p-3 rounded flex items-center justify-between">
                 <span class="text-sm font-medium text-gray-700">Instagram Direct</span>
                 <button class="text-sm text-blue-600 hover:underline">Conectar</button>
               </div>
               <div class="border border-gray-200 bg-white p-3 rounded flex items-center justify-between">
                 <span class="text-sm font-medium text-gray-700">Facebook Messenger</span>
                 <button class="text-sm text-blue-600 hover:underline">Conectar</button>
               </div>
             </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Modal: Sofía Rules -->
    <div v-if="isSofiaModalOpen" class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Entrenamiento: Reglas de Sofía</h3>
          <button @click="isSofiaModalOpen = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-500 mb-4">Añade indicaciones específicas o PDFs con tus políticas de la tienda para que la IA sepa qué responder.</p>
          <textarea class="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm focus:ring-purple-500 focus:border-purple-500" placeholder="Ej: No aceptamos devoluciones en prendas de ropa interior. El envío tarda 3 a 5 días hábiles a todo Chile..."></textarea>
          
          <div class="mt-4">
             <label class="block text-sm font-medium text-gray-700 mb-2">Comportamiento al no saber qué responder:</label>
             <select class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-purple-500 focus:border-purple-500">
               <option>Derivar a un agente humano en el Inbox</option>
               <option>Pedir que dejen su correo</option>
               <option>Disculparse y cerrar chat</option>
             </select>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button @click="isSofiaModalOpen = false" class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition">Guardar Reglas</button>
        </div>
      </div>
    </div>

  </div>
</template>
