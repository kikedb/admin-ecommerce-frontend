<script setup>
import { ref } from 'vue'

const showLoginLinks = ref(true)
const selfServiceReturns = ref(false)
const storeCredit = ref(true)

const accountUrl = ref('https://shopify.com/27906179207/account')

const showToast = ref(false)
const toastMessage = ref('')
const showNotification = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const toggleLoginLinks = () => {
  showLoginLinks.value = !showLoginLinks.value
  showNotification('Enlaces de inicio de sesión ' + (showLoginLinks.value ? 'activados' : 'desactivados'))
}

const toggleSelfService = () => {
  selfServiceReturns.value = !selfServiceReturns.value
  showNotification('Autoservicio ' + (selfServiceReturns.value ? 'activado' : 'desactivado'))
}

const toggleStoreCredit = () => {
  storeCredit.value = !storeCredit.value
  showNotification('Crédito en tienda ' + (storeCredit.value ? 'activado' : 'desactivado'))
}

const showModal = ref(false)
const modalType = ref('')

const openModal = (type) => {
  modalType.value = type
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const authMethods = ref({ email: true, phone: false })
const authAction = () => {
  showNotification('Configuración de autenticación guardada.')
  closeModal()
}

const domainInput = ref(accountUrl.value)
const saveDomain = () => {
  if(domainInput.value) {
    accountUrl.value = domainInput.value
    showNotification('Dominio actualizado.')
  }
  closeModal()
}
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Cuentas de cliente</h1>
    </div>

    <!-- Enlaces de inicio de sesión -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Enlaces de inicio de sesión</h2>
        
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div class="mt-1">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Mostrar enlaces de inicio de sesión</h3>
              <p class="text-sm text-gray-500 mt-1">Mostrar enlaces de inicio de sesión en el encabezado de la tienda online y en el pago</p>
            </div>
          </div>
          <button 
            @click="toggleLoginLinks"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="showLoginLinks ? 'bg-black dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'"
            role="switch" 
            :aria-checked="showLoginLinks"
          >
            <span 
              aria-hidden="true" 
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="showLoginLinks ? 'translate-x-5' : 'translate-x-0'"
            ></span>
          </button>
        </div>
      </div>
    </section>

    <!-- Cuentas de cliente config -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Cuentas de cliente</h2>
        <button class="text-gray-400 hover:text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </button>
      </div>
      
      <div class="p-6 space-y-4">
        <!-- Personalización -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="mt-1">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Personalización</h3>
              <p class="text-sm text-gray-500 mt-1">Configura las apps, la personalización y las funciones para el pago y las cuentas de cliente</p>
            </div>
          </div>
          <button @click="openModal('customize')" class="whitespace-nowrap text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 shadow-sm transition">
            Personalizar
          </button>
        </div>

        <!-- Autenticación -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="mt-1">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Autenticación</h3>
              <p class="text-sm text-gray-500 mt-1">Gestiona los métodos de inicio de sesión y el acceso a la cuenta</p>
            </div>
          </div>
          <button @click="openModal('auth')" class="whitespace-nowrap text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 shadow-sm transition">
            Gestionar
          </button>
        </div>

        <!-- Devoluciones -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div class="mt-1">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path></svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Devoluciones y cancelaciones de autoservicio</h3>
              <p class="text-sm text-gray-500 mt-1">
                Establece condiciones y cargos con las 
                <a href="#" @click.prevent="openModal('returns')" class="text-blue-600 hover:underline">reglas de devolución y cancelación</a>
              </p>
            </div>
          </div>
          <button 
            @click="toggleSelfService"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="selfServiceReturns ? 'bg-black dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'"
            role="switch" 
            :aria-checked="selfServiceReturns"
          >
            <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="selfServiceReturns ? 'translate-x-5' : 'translate-x-0'"></span>
          </button>
        </div>

        <!-- Crédito en tienda -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div class="mt-1">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Crédito en tienda</h3>
              <p class="text-sm text-gray-500 mt-1">Permite que los clientes vean y gasten el crédito en tienda</p>
            </div>
          </div>
          <button 
            @click="toggleStoreCredit"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="storeCredit ? 'bg-black dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'"
            role="switch" 
            :aria-checked="storeCredit"
          >
            <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="storeCredit ? 'translate-x-5' : 'translate-x-0'"></span>
          </button>
        </div>

        <!-- URL -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div class="flex items-start gap-3">
              <div class="mt-1">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">URL</h3>
                <p class="text-sm text-gray-500 mt-1">Usa esta URL donde quieras que los clientes accedan a las cuentas de cliente</p>
              </div>
            </div>
            <button @click="openModal('domain')" class="whitespace-nowrap text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 shadow-sm transition">
              Cambiar dominio
            </button>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <span class="text-sm text-gray-600 dark:text-gray-400 truncate block">{{ accountUrl }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up"
    >
      <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span class="text-sm font-medium">{{ toastMessage }}</span>
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            <span v-if="modalType === 'customize'">Personalización</span>
            <span v-if="modalType === 'auth'">Métodos de Autenticación</span>
            <span v-if="modalType === 'returns'">Reglas de Devolución</span>
            <span v-if="modalType === 'domain'">Cambiar Dominio</span>
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div v-if="modalType === 'customize'" class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">Las herramientas de personalización estarán disponibles aquí. Podrás configurar los colores, logotipos y disposición de las cuentas de cliente.</p>
            <div class="p-4 border border-blue-200 bg-blue-50 rounded-lg text-blue-800 text-sm">
              <p>Nota: El editor visual se cargará en una nueva ventana.</p>
            </div>
          </div>

          <div v-if="modalType === 'auth'" class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Selecciona los métodos permitidos para que los clientes inicien sesión.</p>
            <div class="space-y-3">
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="authMethods.email" class="rounded border-gray-300 text-blue-600">
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Correo Electrónico (Recomendado)</span>
              </label>
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="authMethods.phone" class="rounded border-gray-300 text-blue-600">
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Número de Teléfono (SMS)</span>
              </label>
            </div>
          </div>

          <div v-if="modalType === 'returns'" class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">Configura el tiempo máximo y los motivos aceptados para devoluciones.</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Días para devolución</label>
              <input type="number" value="30" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarifa de reposición (%)</label>
              <input type="number" value="0" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md text-sm">
            </div>
          </div>

          <div v-if="modalType === 'domain'" class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">Actualiza la URL donde los clientes accederán a sus cuentas.</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de Cuentas</label>
              <input type="text" v-model="domainInput" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md text-sm">
            </div>
          </div>

        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">
            Cancelar
          </button>
          <button @click="modalType === 'domain' ? saveDomain() : (modalType === 'auth' ? authAction() : closeModal())" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">
            Guardar
          </button>
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
