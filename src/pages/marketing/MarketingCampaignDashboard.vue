<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMarketingStore } from '@/stores/mockMarketing'

const route = useRoute()
const router = useRouter()
const marketingStore = useMarketingStore()

const campaignId = computed(() => route.params.id)
const campaign = ref(null)

onMounted(() => {
  // En un entorno real, haríamos fetch con el ID
  // Aquí buscamos en el store mock o mostramos datos genéricos
  const found = marketingStore.campaigns.find(c => c.id === parseInt(campaignId.value) || c.id === campaignId.value)
  if (found) {
    campaign.value = found
  } else {
    // Fallback if accessed directly with a mock ID
    campaign.value = {
      id: campaignId.value,
      subject: 'Campaña ' + campaignId.value,
      channel: 'Correo electrónico',
      status: 'Enviado',
      sent: 'hace 2 días'
    }
  }
})

const showPreview = ref(false)
const hasData = ref(false)

const mockStats = ref({
  sessions: '0',
  sales: '$0',
  orders: '0',
  aov: '$0'
})

const chart1Heights = ref([0,0,0,0,0,0,0])
const chart2Heights = ref([0,0,0,0,0,0,0])

const showToast = ref(false)
const toastMessage = ref('')

const showNotification = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const simulateData = () => {
  hasData.value = true
  mockStats.value = {
    sessions: '1,245',
    sales: '$4,520',
    orders: '42',
    aov: '$107'
  }
  
  // Generar alturas aleatorias para los gráficos (en %)
  chart1Heights.value = Array(7).fill(0).map(() => Math.floor(Math.random() * 70) + 30)
  chart2Heights.value = Array(7).fill(0).map(() => Math.floor(Math.random() * 70) + 30)
}

const handleUnsubscribe = () => {
  showPreview.value = false
  showNotification('Te has desuscrito exitosamente. Ya no recibirás más correos.')
}

const goBack = () => {
  router.push('/admin/marketing/campaigns')
}
</script>

<template>
  <div class="space-y-6 pb-20">
    
    <!-- Top Bar -->
    <div class="bg-[#1a1a1a] text-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 rounded-b-xl -mt-6 -mx-6 mb-6">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="p-1.5 hover:bg-gray-800 rounded-md transition text-gray-300 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div class="flex items-center gap-2 text-sm font-medium">
          <span class="text-gray-400">Campañas</span>
          <span class="text-gray-600">/</span>
          <span>Resultados</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button v-if="!hasData" @click="simulateData" class="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition shadow-sm">
          Simular Datos
        </button>
        <span class="px-2.5 py-1 text-xs font-semibold rounded-md bg-green-900/40 text-green-400 border border-green-800 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
          Estado: {{ campaign?.status || 'Enviado' }}
        </span>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      
      <!-- Left Column: Metrics -->
      <div class="flex-1 space-y-6">
        
        <!-- Header Info -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ campaign?.subject || campaign?.name || 'Campaña' }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enviado el {{ campaign?.sent || '15 de Mayo, 2024' }} • Canal: {{ campaign?.channel }}
          </p>
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sesiones</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ mockStats.sessions }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ventas totales</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ mockStats.sales }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pedidos</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ mockStats.orders }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Valor medio del pedido</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ mockStats.aov }}</p>
          </div>
        </div>

        <!-- Charts (Static Mock for Dashboard) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Sesiones por canal</h3>
            <div class="h-48 flex items-end justify-between gap-2 relative">
              <div v-if="!hasData" class="absolute inset-0 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 z-10">Sin datos</div>
              <div v-for="(height, index) in chart1Heights" :key="index" class="w-full bg-blue-50 dark:bg-blue-900/10 rounded-t-sm relative">
                <div class="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-1000 ease-out" :style="{ height: `${height}%` }"></div>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Ventas por día</h3>
            <div class="h-48 flex items-end justify-between gap-2 relative">
              <div v-if="!hasData" class="absolute inset-0 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 z-10">Sin datos</div>
              <div v-for="(height, index) in chart2Heights" :key="index" class="w-full bg-green-50 dark:bg-green-900/10 rounded-t-sm relative">
                <div class="absolute bottom-0 w-full bg-green-500 rounded-t-sm transition-all duration-1000 ease-out" :style="{ height: `${height}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Campaign Details & Preview -->
      <div class="w-full lg:w-80 space-y-6 flex-shrink-0">
        
        <!-- Action: View Preview -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contenido de la Campaña</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">Ver el mensaje exacto que recibieron los clientes.</p>
          <button @click="showPreview = true" class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            Ver vista previa
          </button>
        </div>

        <!-- Read Only Rules -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Configuración de Envío</h3>
          
          <div class="space-y-4">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Público objetivo</p>
              <p class="text-sm text-gray-900 dark:text-white">Todos los suscriptores (12,450)</p>
            </div>
            
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Regla UTM (Rastreo)</p>
              <div class="px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs font-mono text-gray-600 dark:text-gray-400 inline-block">
                utm_campaign={{ campaign?.id || 'c35c07' }}
              </div>
            </div>

            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Atribución de Ventas</p>
              <p class="text-sm text-gray-900 dark:text-white">Último clic no directo</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
          <h2 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            Vista Previa del Mensaje
          </h2>
          <button @click="showPreview = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <!-- Modal Body (Mock Content based on channel) -->
        <div class="p-6 bg-gray-100 dark:bg-black/20 flex justify-center items-center min-h-[400px]">
          
          <!-- Email Preview -->
          <div v-if="!campaign?.channel || campaign?.channel === 'Correo electrónico'" class="bg-white w-full max-w-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">M</div>
              <div>
                <p class="text-xs font-semibold text-gray-900">Mi Tienda Online</p>
                <p class="text-[10px] text-gray-500">Para: cliente@ejemplo.com</p>
              </div>
            </div>
            <div class="p-6 text-center space-y-4">
              <h1 class="text-xl font-bold text-gray-900 tracking-tight">¡Llegó la Nueva Colección!</h1>
              <p class="text-sm text-gray-600">Descubre los estilos que marcarán tendencia esta temporada. Tienes acceso anticipado.</p>
              <div class="w-full h-40 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Promoción" class="w-full h-full object-cover" />
              </div>
              <button @click="showPreview = false; $router.push('/')" class="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 w-full shadow-md transition transform hover:-translate-y-0.5">
                Comprar Ahora
              </button>
              
              <div class="pt-6 mt-6 border-t border-gray-200">
                <p class="text-[10px] text-gray-400">Estás recibiendo este correo porque te suscribiste en nuestra tienda.</p>
                <button @click="handleUnsubscribe" class="text-[10px] text-gray-400 underline hover:text-gray-600 mt-1 inline-block">Desuscribirme</button>
              </div>
            </div>
          </div>

          <!-- SMS / WhatsApp Preview -->
          <div v-else class="w-full max-w-[280px] bg-white rounded-[2rem] shadow-xl border-[8px] border-gray-800 h-[500px] overflow-hidden flex flex-col relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
            
            <div class="bg-gray-100/90 backdrop-blur-md px-4 py-3 pt-8 flex items-center gap-3 border-b border-gray-200 shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs shadow-sm">M</div>
              <div>
                <p class="text-xs font-semibold text-gray-900">Mi Tienda</p>
                <p class="text-[9px] text-gray-500">{{ campaign.channel }}</p>
              </div>
            </div>
            
            <div class="flex-1 bg-[#E5DDD5] dark:bg-[#121b22] p-4 flex flex-col justify-end gap-2">
              <div class="bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] self-start relative">
                <p class="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  Hola 👋<br/>¡Tu acceso anticipado a la nueva colección está aquí! Usa el código <span class="font-bold">NUEVO20</span> para un 20% de descuento.
                </p>
                <a href="#" class="text-blue-500 text-xs mt-2 block underline">tienda.com/s/c35c07</a>
                <span class="text-[9px] text-gray-400 absolute bottom-1 right-2">14:30</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[60] animate-fade-in-up"
    >
      <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span class="text-sm font-medium">{{ toastMessage }}</span>
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
