<script setup>
import { ref } from 'vue'

const senderEmail = ref('info@bilbola.cl')
const isDnsModalOpen = ref(false)
const isDmarcModalOpen = ref(false)
const activeNotification = ref(null)

const toggleNotification = (id) => {
  activeNotification.value = activeNotification.value === id ? null : id
}
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-[#F1F2F4] p-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center text-sm text-gray-500 mb-2">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        <h1 class="text-xl font-semibold text-gray-900">Notificaciones</h1>
      </div>

      <!-- Sender Email Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-1">Correo electrónico del remitente</h2>
          <p class="text-sm text-gray-500 mb-4">El correo electrónico que usa tu tienda para enviar y recibir correos de tus clientes</p>
          
          <input 
            v-model="senderEmail" 
            type="text" 
            class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
          >

          <!-- Error Alert -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start mb-4">
            <svg class="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div class="flex-1 text-sm text-red-700">
              La autenticación del dominio falló. Revisa la configuración de DNS e inténtalo de nuevo.
            </div>
            <button class="text-red-500 hover:text-red-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- DNS Config -->
          <div class="border border-gray-200 rounded-lg divide-y divide-gray-200">
            <div @click="isDnsModalOpen = true" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Autenticación de dominio de correo electrónico</h3>
                  <p class="text-sm text-gray-500">Gestiona la autenticación de dominio de tu dirección de correo electrónico personalizada</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">DNS no válido</span>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>

            <!-- DMARC Config -->
            <div @click="isDmarcModalOpen = true" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Configuración del registro DMARC</h3>
                  <p class="text-sm text-gray-500">Protege tu dominio de envío para aumentar la confianza y la capacidad de entrega</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition pointer-events-none">Ver pasos</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            Para garantizar que tus notificaciones lleguen a los clientes de forma segura, usaremos un <span class="font-medium text-gray-900">servidor SMTP interno de Bilbola</span> como respaldo si la autenticación o DMARC fallan.
          </p>
        </div>
      </div>

      <!-- Categories -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
        
        <!-- Notificaciones a clientes -->
        <div>
          <div @click="toggleNotification('clientes')" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
            <div class="flex items-start gap-4">
              <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Notificaciones a clientes</h3>
                <p class="text-sm text-gray-500">Notifica a los clientes sobre eventos de pedidos y cuentas</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 transform transition-transform" :class="{ 'rotate-90': activeNotification === 'clientes' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div v-if="activeNotification === 'clientes'" class="p-4 bg-gray-50 border-t border-gray-100">
            <div class="space-y-3">
              <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <span class="text-sm text-gray-700">Confirmación de pedido (Email)</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <span class="text-sm text-gray-700">Actualizaciones de envío (SMS / Email)</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <span class="text-sm text-gray-700">Cuenta creada exitosamente</span></label>
            </div>
          </div>
        </div>

        <!-- WhatsApp Business -->
        <div>
          <div @click="toggleNotification('whatsapp')" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
            <div class="flex items-start gap-4">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">WhatsApp Business</h3>
                <p class="text-sm text-gray-500">Configura notificaciones directas al WhatsApp del cliente</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 transform transition-transform" :class="{ 'rotate-90': activeNotification === 'whatsapp' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div v-if="activeNotification === 'whatsapp'" class="p-4 bg-gray-50 border-t border-gray-100">
            <p class="text-sm text-gray-600 mb-4">Mantén a tus clientes informados mediante mensajes automatizados de WhatsApp.</p>
            <div class="space-y-3">
              <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-green-600 focus:ring-green-500"> <span class="text-sm text-gray-700">Confirmación de pago exitoso</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-green-600 focus:ring-green-500"> <span class="text-sm text-gray-700">Recordatorio de carrito abandonado</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" class="rounded border-gray-300 text-green-600 focus:ring-green-500"> <span class="text-sm text-gray-700">Aviso de envío en tránsito</span></label>
            </div>
            <button class="mt-4 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition">Configurar API de WhatsApp</button>
          </div>
        </div>

        <!-- Agente IA Sofía -->
        <div>
          <div @click="toggleNotification('sofia')" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
            <div class="flex items-start gap-4">
              <svg class="w-5 h-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Agente de IA "Sofía" (Audio / Voz)</h3>
                <p class="text-sm text-gray-500">Automatiza llamadas con inteligencia artificial para confirmar detalles clave</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 transform transition-transform" :class="{ 'rotate-90': activeNotification === 'sofia' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div v-if="activeNotification === 'sofia'" class="p-4 bg-gray-50 border-t border-gray-100">
            <p class="text-sm text-gray-600 mb-4">El agente Sofía puede interactuar por voz (similar a Tulio) para casos que requieran atención especial.</p>
            <div class="space-y-3">
              <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"> <span class="text-sm text-gray-700">Llamada automática para confirmar pedidos sospechosos</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"> <span class="text-sm text-gray-700">Llamada de soporte de bienvenida para compras de alto valor</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"> <span class="text-sm text-gray-700">Aviso telefónico de problemas en la entrega</span></label>
            </div>
            <button class="mt-4 px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition">Entrenar agente IA</button>
          </div>
        </div>

        <!-- Notificaciones a empleados -->
        <div>
          <div @click="toggleNotification('empleados')" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
            <div class="flex items-start gap-4">
              <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Notificaciones a empleados</h3>
                <p class="text-sm text-gray-500">Notifica a los empleados sobre eventos de nuevos pedidos</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 transform transition-transform" :class="{ 'rotate-90': activeNotification === 'empleados' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div v-if="activeNotification === 'empleados'" class="p-4 bg-gray-50 border-t border-gray-100">
            <div class="space-y-3">
              <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <span class="text-sm text-gray-700">Aviso de nuevo pedido (Push app)</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"> <span class="text-sm text-gray-700">Alerta de bajo stock</span></label>
            </div>
          </div>
        </div>

        <!-- Webhooks -->
        <div>
          <div @click="toggleNotification('webhooks')" class="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
            <div class="flex items-start gap-4">
              <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Webhooks y API de terceros</h3>
                <p class="text-sm text-gray-500">Envía notificaciones JSON sobre eventos de la tienda a una URL</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 transform transition-transform" :class="{ 'rotate-90': activeNotification === 'webhooks' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div v-if="activeNotification === 'webhooks'" class="p-4 bg-gray-50 border-t border-gray-100">
             <button class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Crear Webhook</button>
          </div>
        </div>

      </div>

    </div>

    <!-- Modals -->
    <div v-if="isDnsModalOpen" class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Configuración de DNS</h3>
          <button @click="isDnsModalOpen = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">Para autenticar tu dominio de correo, debes agregar los siguientes registros en tu proveedor de dominio (ej. GoDaddy, Namecheap, Cloudflare).</p>
          <div class="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs overflow-x-auto">
            <p><strong>Tipo:</strong> TXT</p>
            <p><strong>Nombre:</strong> _dmarc.bilbola.cl</p>
            <p><strong>Valor:</strong> v=DMARC1; p=none;</p>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button @click="isDnsModalOpen = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Entendido</button>
        </div>
      </div>
    </div>

    <div v-if="isDmarcModalOpen" class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Pasos DMARC</h3>
          <button @click="isDmarcModalOpen = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <ol class="list-decimal pl-5 text-sm text-gray-600 space-y-2">
            <li>Accede a la zona DNS de tu dominio.</li>
            <li>Crea un registro de tipo TXT.</li>
            <li>Ingresa <code>_dmarc</code> en el campo Nombre/Host.</li>
            <li>Ingresa <code>v=DMARC1; p=quarantine;</code> en el campo Valor.</li>
            <li>Guarda los cambios y espera la propagación (hasta 24 horas).</li>
          </ol>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button @click="isDmarcModalOpen = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>
