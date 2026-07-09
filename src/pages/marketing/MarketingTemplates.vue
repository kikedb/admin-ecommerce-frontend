<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('email')
const tabs = [
  { id: 'email', label: 'Correo electrónico' },
  { id: 'sms', label: 'SMS' }
]

const emailTemplates = [
  { id: 1, title: 'En blanco', category: 'Básico', image: null, isBlank: true },
  { id: 2, title: 'Conoce los favoritos', category: 'Promociones', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 3, title: 'Nueva colección', category: 'Lanzamientos', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 4, title: 'Oferta de temporada', category: 'Ventas', image: 'https://images.unsplash.com/photo-1555529771-835f59bfc50c?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 5, title: 'Boletín mensual', category: 'Boletín', image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=400&h=300' }
]

const smsTemplates = [
  { 
    id: 1, 
    title: 'En blanco', 
    content: '', 
    isBlank: true 
  },
  { 
    id: 2, 
    title: 'Lanzamiento de producto', 
    content: '¡Hola, {first_name}! Nuestra nueva colección de invierno ya está disponible. Usa el código INVIERNO20 para un 20% de descuento. Compra ahora: {shop_link}' 
  },
  { 
    id: 3, 
    title: 'Oferta flash', 
    content: '⏳ Oferta Flash de 24 hrs. ¡Obtén envío gratis en todos los pedidos superiores a $50! Toca el enlace para comprar: {shop_link}' 
  },
  { 
    id: 4, 
    title: 'Evento especial', 
    content: 'Estás invitado a nuestro evento VIP de ventas anticipadas. Muestra este mensaje en la tienda para un regalo especial. 🎁' 
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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Plantillas</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Elige un diseño inicial para tu próxima campaña.</p>
        </div>
      </div>
    </div>

    <!-- Main Content Box -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 px-6 flex gap-8">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-4 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.id ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="p-6">
        <!-- Email Templates Grid -->
        <div v-if="activeTab === 'email'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="template in emailTemplates" 
            :key="template.id"
            class="group cursor-pointer"
          >
            <!-- Thumbnail -->
            <div class="aspect-[3/4] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden relative mb-3 transition-shadow group-hover:shadow-md group-hover:border-gray-300 dark:group-hover:border-gray-500">
              <template v-if="template.isBlank">
                <div class="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg>
                </div>
              </template>
              <template v-else>
                <div class="absolute inset-x-0 top-0 h-12 bg-gray-200 dark:bg-gray-700 flex items-center px-4 border-b border-gray-300 dark:border-gray-600">
                  <div class="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-1/3"></div>
                </div>
                <img :src="template.image" :alt="template.title" class="w-full h-full object-cover mt-12 opacity-90 group-hover:opacity-100 transition-opacity" />
              </template>
              
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button @click="router.push('/admin/marketing/campaigns/new')" class="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50">
                  Seleccionar
                </button>
              </div>
            </div>
            <!-- Meta -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ template.title }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ template.category }}</p>
            </div>
          </div>
        </div>

        <!-- SMS Templates Grid -->
        <div v-if="activeTab === 'sms'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="template in smsTemplates" 
            :key="template.id"
            class="group cursor-pointer"
          >
            <!-- SMS Preview Box -->
            <div class="h-64 rounded-2xl border-4 border-gray-800 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden relative mb-4 flex flex-col p-4 transition-transform group-hover:-translate-y-1">
              <!-- Mock Header -->
              <div class="flex justify-center mb-4">
                <div class="w-1/3 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>
              
              <!-- Message Bubble -->
              <div v-if="template.isBlank" class="flex-1 flex items-center justify-center text-gray-400">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <div v-else class="bg-blue-500 text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-sm leading-relaxed max-w-[90%] self-end">
                {{ template.content }}
              </div>
              
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button @click="router.push('/admin/marketing/campaigns/new')" class="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50">
                  Usar plantilla
                </button>
              </div>
            </div>
            <!-- Meta -->
            <div class="text-center">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ template.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
