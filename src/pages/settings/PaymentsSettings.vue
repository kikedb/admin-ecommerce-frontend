<script setup>
import { ref, onMounted } from 'vue'
import paymentsService from '@/services/payments.service'
import settingsService from '@/services/settings.service'
import { useNotification } from '@/composables/useNotification'

const notification = useNotification()

const showProviderModal = ref(false)
const showManualModal = ref(false)
const showMercadoPagoModal = ref(false)
const isLoading = ref(true)
const mpProviderId = ref(null)

const paymentCapture = ref('automatic')
const mpStatus = ref('inactive')
const mpKeys = ref({
  publicKey: '',
  accessToken: ''
})

const manualMethods = ref([
  { id: 1, name: 'Transferencia bancaria', description: 'Realiza el pago directamente a nuestra cuenta bancaria.', status: 'active' },
  { id: 2, name: 'Pago contra entrega (COD)', description: 'Paga en efectivo al momento de recibir el producto.', status: 'inactive' }
])

const loadPaymentSettings = async () => {
  try {
    isLoading.value = true
    
    // Cargar config de captura
    const settingsRes = await settingsService.getSettings()
    const settingsData = settingsRes.data.data
    if(settingsData['paymentCapture']) paymentCapture.value = settingsData['paymentCapture'].value
    
    // Cargar proveedores
    const providersRes = await paymentsService.getProviders()
    const providers = providersRes.data.data
    
    const mp = providers.find(p => p.provider === 'mercadopago')
    if (mp) {
      mpProviderId.value = mp.id
      mpStatus.value = mp.is_active ? 'active' : 'inactive'
      if (mp.settings) {
        mpKeys.value = mp.settings
      }
    }
  } catch (error) {
    notification.error('Error al cargar configuración de pagos')
  } finally {
    isLoading.value = false
  }
}

const toggleManualStatus = (method) => {
  method.status = method.status === 'active' ? 'inactive' : 'active'
  notification.success(`${method.name} ${method.status === 'active' ? 'activado' : 'desactivado'}`)
}

const toggleMpStatus = async () => {
  try {
    const newStatus = mpStatus.value === 'active' ? false : true
    if (mpProviderId.value) {
      await paymentsService.updateProvider(mpProviderId.value, {
        is_active: newStatus
      })
    } else {
      const res = await paymentsService.createProvider({
        name: 'Mercado Pago',
        provider: 'mercadopago',
        is_active: newStatus,
        settings: mpKeys.value
      })
      mpProviderId.value = res.data.data.id
    }
    mpStatus.value = newStatus ? 'active' : 'inactive'
    notification.success(`Mercado Pago ha sido ${newStatus ? 'activado' : 'desactivado'}`)
  } catch (error) {
    notification.error('Error al actualizar estado de Mercado Pago')
  }
}

const saveMpConfig = async () => {
  try {
    if (mpProviderId.value) {
      await paymentsService.updateProvider(mpProviderId.value, {
        settings: mpKeys.value
      })
    } else {
      const res = await paymentsService.createProvider({
        name: 'Mercado Pago',
        provider: 'mercadopago',
        is_active: false,
        settings: mpKeys.value
      })
      mpProviderId.value = res.data.data.id
    }
    notification.success('Credenciales guardadas correctamente')
    showMercadoPagoModal.value = false
  } catch (error) {
    notification.error('Error al guardar credenciales')
  }
}

const updatePaymentCapture = async () => {
  try {
    await settingsService.updateSettings([
      { key: 'paymentCapture', value: paymentCapture.value, type: 'string', group: 'payments' }
    ])
    notification.success('Configuración guardada')
  } catch (error) {
    notification.error('Error al guardar configuración')
  }
}

onMounted(() => {
  loadPaymentSettings()
})
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12 relative">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Pasarelas de pago</h1>
    </div>

    <!-- Proveedores de pago -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Proveedores de pago admitidos</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Los proveedores que habilites determinan cómo los clientes pueden pagar.</p>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Tarjeta Mercado Pago -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative overflow-hidden transition-all duration-300" :class="{'bg-gray-50/50 dark:bg-gray-900/30': mpStatus === 'inactive'}">
          <div class="absolute top-0 right-0 p-4">
            <span v-if="mpStatus === 'active'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Activo
            </span>
            <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400">
              Inactivo
            </span>
          </div>
          <div class="flex items-start gap-4 transition-opacity duration-300" :class="{'opacity-50 grayscale': mpStatus === 'inactive'}">
            <div class="w-12 h-12 bg-[#009EE3] rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold text-xs text-center leading-tight">Mercado<br>Pago</span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Mercado Pago</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Tarjetas de crédito, débito y dinero en cuenta.</p>
              
              <div class="flex flex-wrap gap-2 mt-4">
                <div class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 font-medium">Visa</div>
                <div class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 font-medium">Mastercard</div>
                <div class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 font-medium">Amex</div>
                <div class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 font-medium">RedCompra</div>
              </div>
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button @click="showMercadoPagoModal = true" class="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-4 py-2 shadow-sm transition">
              Administrar
            </button>
            <button @click="toggleMpStatus" :class="mpStatus === 'active' ? 'text-red-600 hover:bg-red-50 dark:hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'" class="text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 shadow-sm transition">
              {{ mpStatus === 'active' ? 'Desactivar' : 'Activar' }}
            </button>
          </div>
        </div>
        
        <!-- Botón agregar otro -->
        <button @click="showProviderModal = true" class="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span class="text-sm font-medium">Agregar proveedor de pago</span>
        </button>
      </div>
    </section>

    <!-- Proveedores externos (Third-party providers) -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Proveedores externos</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Habilita otros proveedores que procesen tarjetas de crédito para que los clientes tengan más opciones.</p>
      </div>
      <div class="p-6">
        <button @click="showProviderModal = true" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          Elegir proveedor externo
        </button>
      </div>
    </section>

    <!-- Métodos de pago alternativos -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Métodos de pago alternativos</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Acepta formas de pago alternativas como criptomonedas o billeteras locales.</p>
      </div>
      <div class="p-6">
        <button class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          Elegir método de pago alternativo
        </button>
      </div>
    </section>

    <!-- Métodos de pago manuales -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Formas de pago manuales</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Pagos que se realizan fuera de la tienda online (ej. transferencia, efectivo).</p>
        </div>
        <button @click="showManualModal = true" class="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition">
          Agregar método
        </button>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="method in manualMethods" :key="method.id" class="p-5 flex items-start justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
          <div class="flex gap-4">
            <div class="mt-1">
              <svg v-if="method.status === 'active'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ method.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ method.description }}</p>
            </div>
          </div>
          <button @click="toggleManualStatus(method)" class="text-sm font-medium" :class="method.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'">
            {{ method.status === 'active' ? 'Desactivar' : 'Activar' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Captura de pagos -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Captura de pagos</h2>
      </div>
      <div class="p-6">
        <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">Cuándo capturar fondos para pedidos de tarjetas</label>
        
        <div class="space-y-4">
          <label class="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition" :class="{'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10': paymentCapture === 'automatic'}">
            <input type="radio" v-model="paymentCapture" value="automatic" @change="updatePaymentCapture" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
            <div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white block">Automáticamente al realizar el pedido</span>
              <span class="text-sm text-gray-500 dark:text-gray-400 mt-1 block">El importe se cobra a la tarjeta del cliente de inmediato tras completar el pedido.</span>
            </div>
          </label>
          
          <label class="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition" :class="{'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10': paymentCapture === 'manual'}">
            <input type="radio" v-model="paymentCapture" value="manual" @change="updatePaymentCapture" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
            <div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white block">Manualmente</span>
              <span class="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Tú debes capturar los fondos antes de que venza el plazo de autorización de la tarjeta. Útil si deseas confirmar inventario antes del cobro real.</span>
            </div>
          </label>
        </div>
      </div>
    </section>

    <!-- Modal Mercado Pago -->
    <div v-if="showMercadoPagoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-[#009EE3] rounded flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold text-[8px] text-center leading-tight">MP</span>
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Configuración de Mercado Pago</h2>
          </div>
          <button @click="showMercadoPagoModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4 overflow-y-auto">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Ingresa tus credenciales de producción para procesar pagos con Mercado Pago.</p>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Public Key</label>
            <input type="text" v-model="mpKeys.publicKey" class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Access Token</label>
            <input type="password" v-model="mpKeys.accessToken" class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3">
          </div>

          <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex gap-2">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p>Encuentra tus credenciales en el panel de desarrolladores de Mercado Pago, sección "Credenciales de Producción".</p>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showMercadoPagoModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
          <button @click="saveMpConfig" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Guardar credenciales</button>
        </div>
      </div>
    </div>

    <!-- Modals Placeholders -->
    <div v-if="showProviderModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Agregar proveedor</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Aquí se listaría el directorio de integraciones (VentiPay, Webpay, Getnet, etc).</p>
        <div class="flex justify-end">
          <button @click="showProviderModal = false" class="px-4 py-2 bg-gray-900 text-white rounded-lg">Cerrar</button>
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
