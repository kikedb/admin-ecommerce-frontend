<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPreview = ref(false)
const selectedAutomation = ref(null)

const openPreview = (automation) => {
  selectedAutomation.value = automation
  showPreview.value = true
}

const goToEditor = () => {
  showPreview.value = false
  router.push('/admin/marketing/automations/edit')
}

const automationCategories = [
  {
    title: 'Recuperar visitantes del sitio',
    automations: [
      {
        id: 1,
        title: 'Recupera el carrito abandonado',
        description: 'Envía un correo de marketing cuando un cliente añade al menos un producto al carrito pero no avanza al pago.',
        channels: ['email', 'sms'],
        smsCompatible: true
      },
      {
        id: 2,
        title: 'Recupera el pedido abandonado',
        description: 'Envía un mensaje a los clientes 10 horas después de que inicien el pago pero no realicen un pedido, para animarlos a completar la compra.',
        channels: ['email', 'sms'],
        smsCompatible: true
      },
      {
        id: 3,
        title: 'Convierte la navegación de producto abandonada',
        description: 'Envía un correo de marketing a quienes vieron un producto pero no lo añadieron al carrito.',
        channels: ['email', 'sms'],
        smsCompatible: true
      }
    ]
  },
  {
    title: 'Dar la bienvenida a nuevos suscriptores',
    automations: [
      {
        id: 4,
        title: 'Da la bienvenida a nuevos suscriptores con un correo con descuento',
        description: 'Envía a quienes se suscriben a través de un formulario en tu tienda online un correo de bienvenida con un descuento.',
        channels: ['email'],
        smsCompatible: false
      },
      {
        id: 5,
        title: 'Da la bienvenida a nuevos suscriptores con una serie de correos',
        description: 'Envía una serie de mensajes de bienvenida a los nuevos suscriptores cuando se suscriban al marketing a través de tu tienda online.',
        channels: ['email'],
        smsCompatible: false
      }
    ]
  },
  {
    title: 'Poscompra',
    automations: [
      {
        id: 6,
        title: 'Recupera clientes',
        description: 'Ofrece un descuento a quienes no hayan realizado un pedido en tu tienda en los últimos 60 días.',
        channels: ['email'],
        smsCompatible: false
      },
      {
        id: 7,
        title: 'Haz una venta adicional después de la primera compra',
        description: 'Envía un correo de marketing destacando productos destacados después de que un cliente haga su primera compra.',
        channels: ['email'],
        smsCompatible: false
      },
      {
        id: 8,
        title: 'Agradece a los clientes después de su compra',
        description: 'Envía un correo de agradecimiento distinto a los clientes después de su primera y segunda compra.',
        channels: ['email'],
        smsCompatible: false
      }
    ]
  }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-3">
        <RouterLink to="/admin/marketing/campaigns" class="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </RouterLink>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Plantillas de automatización</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Crea flujos de trabajo automatizados para tus clientes.</p>
        </div>
      </div>
      <button @click="goToEditor" class="px-4 py-2 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm">
        Crear automatización personalizada
      </button>
    </div>

    <!-- Automation Categories -->
    <div class="space-y-8 mt-8">
      <div v-for="category in automationCategories" :key="category.title" class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white px-1">{{ category.title }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="automation in category.automations" 
            :key="automation.id"
            @click="openPreview(automation)"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ automation.title }}
              </h3>
              
              <!-- Channels & Badges -->
              <div class="flex items-center gap-3 mb-4 text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1.5">
                  <svg v-if="automation.channels.includes('email')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <svg v-if="automation.channels.includes('sms')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </div>
                
                <span v-if="automation.smsCompatible" class="text-[11px] font-medium px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                  Compatible con SMS
                </span>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {{ automation.description }}
              </p>
            </div>
            
            <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
              <span class="text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Usar plantilla &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Previsualización de plantilla</h2>
          <button @click="showPreview = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ selectedAutomation?.title }}</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">{{ selectedAutomation?.description }}</p>
          
          <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Flujo de trabajo propuesto</h4>
            
            <div class="space-y-4 relative before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-gray-300 dark:before:bg-gray-600">
              
              <!-- Trigger -->
              <div class="relative flex gap-4 items-start">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 z-10 ring-4 ring-gray-50 dark:ring-gray-900">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 shadow-sm mt-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">Disparador</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Cuando el cliente cumple las condiciones</p>
                </div>
              </div>

              <!-- Action -->
              <div class="relative flex gap-4 items-start">
                <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 z-10 ring-4 ring-gray-50 dark:ring-gray-900">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 shadow-sm mt-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">Enviar mensaje</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Contenido pre-diseñado para esta automatización</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button @click="showPreview = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Cancelar
          </button>
          <button @click="goToEditor" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Editar automatización
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
