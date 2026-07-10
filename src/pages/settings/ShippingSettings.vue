<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import settingsService from '@/services/settings.service'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const notification = useNotification()

const showModal = ref(false)
const modalType = ref('')
const isLoading = ref(true)

const estimatedDatesEnabled = ref(false)
const packages = ref([
  { id: 1, name: 'Caja pequeña', type: 'Caja', length: 20, width: 20, height: 10, weight: 0.5 },
  { id: 2, name: 'Sobre acolchado', type: 'Sobre', length: 30, width: 20, height: 2, weight: 0.1 }
])
const editingPackage = ref(null)
const newPackage = ref({ name: '', type: 'Caja', length: '', width: '', height: '', weight: '' })
const carriers = ref([])
const newCarrier = ref({ provider: 'FedEx', accountNumber: '' })
const orderRouting = ref('closest') // closest, cheapest
const localDeliveryRadius = ref(5) // km
const localDeliveryPrice = ref(2000) // CLP
const storePickupEnabled = ref(true)

const openModal = (type) => {
  modalType.value = type
  showModal.value = true
}

const savePackage = () => {
  if (editingPackage.value) {
    const index = packages.value.findIndex(p => p.id === editingPackage.value.id)
    packages.value[index] = { ...editingPackage.value }
    editingPackage.value = null
  } else {
    packages.value.push({ id: Date.now(), ...newPackage.value })
    newPackage.value = { name: '', type: 'Caja', length: '', width: '', height: '', weight: '' }
  }
}

const removePackage = (id) => {
  packages.value = packages.value.filter(p => p.id !== id)
}

const saveCarrier = () => {
  if (newCarrier.value.accountNumber) {
    carriers.value.push({ id: Date.now(), ...newCarrier.value })
    newCarrier.value = { provider: 'FedEx', accountNumber: '' }
  }
}

const removeCarrier = (id) => {
  carriers.value = carriers.value.filter(c => c.id !== id)
}

const loadShippingSettings = async () => {
  try {
    isLoading.value = true
    const response = await settingsService.getSettings()
    const data = response.data.data
    
    if(data['estimatedDatesEnabled']) estimatedDatesEnabled.value = data['estimatedDatesEnabled'].value
    if(data['shippingPackages']) packages.value = data['shippingPackages'].value || []
    if(data['shippingCarriers']) carriers.value = data['shippingCarriers'].value || []
    if(data['orderRouting']) orderRouting.value = data['orderRouting'].value
    if(data['localDeliveryRadius']) localDeliveryRadius.value = data['localDeliveryRadius'].value
    if(data['localDeliveryPrice']) localDeliveryPrice.value = data['localDeliveryPrice'].value
    if(data['storePickupEnabled']) storePickupEnabled.value = data['storePickupEnabled'].value
  } catch (error) {
    notification.error('Error al cargar configuración de envíos')
  } finally {
    isLoading.value = false
  }
}

const closeModal = async () => {
  try {
    const payload = [
      { key: 'estimatedDatesEnabled', value: estimatedDatesEnabled.value, type: 'boolean', group: 'shipping' },
      { key: 'shippingPackages', value: packages.value, type: 'json', group: 'shipping' },
      { key: 'shippingCarriers', value: carriers.value, type: 'json', group: 'shipping' },
      { key: 'orderRouting', value: orderRouting.value, type: 'string', group: 'shipping' },
      { key: 'localDeliveryRadius', value: localDeliveryRadius.value, type: 'integer', group: 'shipping' },
      { key: 'localDeliveryPrice', value: localDeliveryPrice.value, type: 'integer', group: 'shipping' },
      { key: 'storePickupEnabled', value: storePickupEnabled.value, type: 'boolean', group: 'shipping' }
    ]
    await settingsService.updateSettings(payload)
    notification.success('Configuración guardada correctamente')
  } catch (error) {
    notification.error('Error al guardar configuración')
  }
  showModal.value = false
  editingPackage.value = null
}

onMounted(() => {
  loadShippingSettings()
})
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Envío y entrega</h1>
    </div>

    <!-- Envío Section -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Envío</h2>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        
        <!-- Perfiles de envío -->
        <div class="p-5">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Perfiles de envío</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Administra dónde haces envíos y las tarifas de los productos.</p>
          
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <!-- Predeterminado -->
            <div class="bg-gray-50 dark:bg-gray-900/50 p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Predeterminado de la tienda</span>
              <span class="text-xs text-gray-500">1 perfil</span>
            </div>
            
            <div 
              @click="router.push('/admin/settings/shipping/profiles/general')"
              class="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer flex items-center justify-between transition group"
            >
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">Perfil general</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Todos los productos
                  </span>
                </div>
              </div>
              
              <div class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>1 de 2 sucursal</span>
                <span>1 zona</span>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>
          </div>
          
          <div class="mt-4 flex justify-between items-center">
            <a href="#" @click.prevent="router.push('/admin/settings/locations')" class="text-sm text-blue-600 hover:underline">Gestiona la configuración de inventario preparable y envío dividido</a>
            <button @click="router.push('/admin/settings/shipping/profiles/new')" class="text-sm font-medium text-blue-600 hover:text-blue-700">Agregar perfil personalizado</button>
          </div>
        </div>

        <!-- Fechas de entrega estimadas -->
        <div @click="openModal('fechas')" class="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Fechas de entrega estimadas</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Muestra cuándo se espera que lleguen los pedidos en la pantalla de pago y en los perfiles.</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-900 dark:text-white">{{ estimatedDatesEnabled ? 'Activado' : 'Desactivado' }}</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        <!-- Paquetes -->
        <div @click="openModal('paquetes')" class="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div class="pr-8">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Paquetes</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Configura los tamaños de los paquetes para obtener tarifas de envío precisas con las aplicaciones de tarifas calculadas.</p>
          </div>
          <div class="flex items-center gap-3 whitespace-nowrap">
            <span class="text-sm text-gray-900 dark:text-white">{{ packages.length }} cajas</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        <!-- Cuentas de transporte -->
        <div @click="openModal('cuentas')" class="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div class="pr-8">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Cuentas de empresas de transporte</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Conecta tu cuenta de la empresa de transporte existente para usar tus propias tarifas.</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">{{ carriers.length > 0 ? carriers.length + ' cuentas' : 'Ninguna' }}</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        <!-- Enrutamiento -->
        <div @click="openModal('enrutamiento')" class="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div class="pr-8">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Enrutamiento de pedidos</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Configura cómo se asignan las sucursales a los pedidos nuevos para la preparación.</p>
          </div>
          <div class="flex items-center gap-3 whitespace-nowrap">
            <span class="text-sm text-gray-900 dark:text-white">{{ orderRouting === 'closest' ? 'Más cercana' : 'Más barata' }}</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Entrega Adicional -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Formas de entrega adicionales</h2>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        
        <!-- Entrega local -->
        <div @click="openModal('entrega_local')" class="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div class="pr-8">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Entrega local</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Realiza entregas a clientes en el área de forma directa en ubicaciones seleccionadas.</p>
          </div>
          <div class="flex items-center gap-3 whitespace-nowrap">
            <span class="text-sm text-gray-500">Configurado</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        <!-- Retiro local -->
        <div @click="openModal('retiro_local')" class="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div class="pr-8">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Retiro en tienda</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Permite a los clientes recoger sus pedidos en la tienda o almacén.</p>
          </div>
          <div class="flex items-center gap-3 whitespace-nowrap">
            <span class="text-sm text-gray-900 dark:text-white">{{ storePickupEnabled ? 'Activado' : 'Desactivado' }}</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

      </div>
    </section>

    <!-- Modal Funcional -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            <span v-if="modalType === 'fechas'">Fechas de entrega estimadas</span>
            <span v-if="modalType === 'paquetes'">Configuración de Paquetes</span>
            <span v-if="modalType === 'cuentas'">Cuentas de empresas de transporte</span>
            <span v-if="modalType === 'enrutamiento'">Enrutamiento de pedidos</span>
            <span v-if="modalType === 'entrega_local'">Configuración de Entrega Local</span>
            <span v-if="modalType === 'retiro_local'">Configuración de Retiro en Tienda</span>
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto">
          
          <!-- Modal: Fechas de Entrega -->
          <div v-if="modalType === 'fechas'" class="space-y-4">
            <label class="flex items-center gap-3 cursor-pointer">
              <div class="relative">
                <input type="checkbox" v-model="estimatedDatesEnabled" class="sr-only">
                <div class="w-10 h-6 bg-gray-200 rounded-full transition" :class="{'bg-blue-600': estimatedDatesEnabled}"></div>
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform" :class="{'translate-x-4': estimatedDatesEnabled}"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Mostrar fechas de entrega estimadas al finalizar la compra</span>
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">Las fechas se calcularán en función del tiempo de procesamiento y el tiempo de tránsito configurados en tus tarifas de envío.</p>
          </div>

          <!-- Modal: Paquetes -->
          <div v-if="modalType === 'paquetes'" class="space-y-6">
            <div class="space-y-3">
              <div v-for="pkg in packages" :key="pkg.id" class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ pkg.name }} ({{ pkg.type }})</h4>
                  <p class="text-xs text-gray-500">{{ pkg.length }} x {{ pkg.width }} x {{ pkg.height }} cm, {{ pkg.weight }} kg</p>
                </div>
                <div class="flex gap-2">
                  <button @click="editingPackage = pkg; newPackage = { ...pkg }" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                  <button @click="removePackage(pkg.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">{{ editingPackage ? 'Editar paquete' : 'Agregar nuevo paquete' }}</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                  <input type="text" v-model="newPackage.name" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                  <select v-model="newPackage.type" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                    <option>Caja</option>
                    <option>Sobre</option>
                    <option>Embalaje blando</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dimensiones (L x W x H cm)</label>
                  <div class="flex gap-1">
                    <input type="number" v-model="newPackage.length" placeholder="L" class="w-1/3 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                    <input type="number" v-model="newPackage.width" placeholder="W" class="w-1/3 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                    <input type="number" v-model="newPackage.height" placeholder="H" class="w-1/3 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (kg)</label>
                  <input type="number" v-model="newPackage.weight" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                </div>
              </div>
              <button @click="savePackage" class="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition">Guardar paquete</button>
            </div>
          </div>

          <!-- Modal: Cuentas -->
          <div v-if="modalType === 'cuentas'" class="space-y-6">
             <div class="space-y-3">
              <div v-for="carrier in carriers" :key="carrier.id" class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ carrier.provider }}</h4>
                  <p class="text-xs text-gray-500">Cuenta: {{ carrier.accountNumber }}</p>
                </div>
                <button @click="removeCarrier(carrier.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Desconectar</button>
              </div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Conectar cuenta</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Proveedor</label>
                  <select v-model="newCarrier.provider" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                    <option>FedEx</option>
                    <option>UPS</option>
                    <option>DHL Express</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Número de cuenta</label>
                  <input type="text" v-model="newCarrier.accountNumber" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                </div>
              </div>
              <button @click="saveCarrier" class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">Conectar</button>
            </div>
          </div>

          <!-- Modal: Enrutamiento -->
          <div v-if="modalType === 'enrutamiento'" class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Determina cómo se asignan las ubicaciones a los pedidos con múltiples artículos o ubicaciones.</p>
            
            <label class="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition" :class="{'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10': orderRouting === 'closest'}">
              <input type="radio" v-model="orderRouting" value="closest" class="mt-1 text-blue-600 border-gray-300 focus:ring-blue-500">
              <div>
                <span class="text-sm font-medium text-gray-900 dark:text-white block">Ubicación más cercana</span>
                <span class="text-xs text-gray-500 mt-0.5 block">Asigna el pedido a la sucursal más cercana al cliente para reducir tiempos de envío.</span>
              </div>
            </label>

            <label class="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition" :class="{'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10': orderRouting === 'cheapest'}">
              <input type="radio" v-model="orderRouting" value="cheapest" class="mt-1 text-blue-600 border-gray-300 focus:ring-blue-500">
              <div>
                <span class="text-sm font-medium text-gray-900 dark:text-white block">Priorizar ubicación con inventario completo</span>
                <span class="text-xs text-gray-500 mt-0.5 block">Intenta enviar todo desde una sola ubicación para minimizar cajas, aunque esté más lejos.</span>
              </div>
            </label>
          </div>

          <!-- Modal: Entrega Local -->
          <div v-if="modalType === 'entrega_local'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Radio de entrega (km)</label>
              <input type="number" v-model="localDeliveryRadius" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio de entrega local (CLP)</label>
              <input type="number" v-model="localDeliveryPrice" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
            </div>
            <p class="text-xs text-gray-500">Los clientes dentro del radio verán esta opción al finalizar la compra.</p>
          </div>

          <!-- Modal: Retiro Local -->
          <div v-if="modalType === 'retiro_local'" class="space-y-4">
            <label class="flex items-center gap-3 cursor-pointer">
              <div class="relative">
                <input type="checkbox" v-model="storePickupEnabled" class="sr-only">
                <div class="w-10 h-6 bg-gray-200 rounded-full transition" :class="{'bg-blue-600': storePickupEnabled}"></div>
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform" :class="{'translate-x-4': storePickupEnabled}"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Ofrecer retiro en tienda</span>
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">Los clientes pueden seleccionar recoger sus productos en tu sucursal principal. Generalmente el retiro es gratuito.</p>
          </div>

        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translate(-50%, 10px); }
  to { opacity: 1; transform: translate(0, 0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
}
</style>
