<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import settingsService from '@/services/settings.service'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const notification = useNotification()
const activeTab = ref('details') // 'details', 'branding', 'metafields'

const isLoading = ref(true)
const isSaving = ref(false)

const storeData = ref({
  storeName: '',
  email: '',
  phone: '',
  addressName: '',
  addressFull: '',
  currency: 'Peso chileno (CLP $)',
  unitSystem: 'Sistema métrico',
  defaultWeight: 'Kilogramo (kg)',
  timezone: '(GMT-04:00) Santiago',
  backupRegion: 'Chile',
  businessName: '',
  businessCountry: ''
})

const brandingData = ref({
  primaryColor: '#D1EFED',
  contrastColor: '#96CFBE',
  squareLogoPreview: 'Cuadrado'
})

const secondaryColors = ref([])

const addSecondaryColor = () => {
  secondaryColors.value.push('#000000')
}

const removeSecondaryColor = (index) => {
  secondaryColors.value.splice(index, 1)
}

const loadSettings = async () => {
  try {
    isLoading.value = true
    const response = await settingsService.getSettings()
    const data = response.data.data
    
    // Asignar si existen
    if(data['storeData']) storeData.value = { ...storeData.value, ...data['storeData'].value }
    if(data['brandingData']) brandingData.value = { ...brandingData.value, ...data['brandingData'].value }
    if(data['secondaryColors']) secondaryColors.value = data['secondaryColors'].value || []
  } catch (error) {
    notification.error('Error al cargar la configuración general')
  } finally {
    isLoading.value = false
  }
}

const saveSettings = async (section) => {
  try {
    isSaving.value = true
    const settingsPayload = [
      { key: 'storeData', value: storeData.value, type: 'json', group: 'general' },
      { key: 'brandingData', value: brandingData.value, type: 'json', group: 'branding' },
      { key: 'secondaryColors', value: secondaryColors.value, type: 'json', group: 'branding' }
    ]
    await settingsService.updateSettings(settingsPayload)
    notification.success('Configuración guardada correctamente')
    
    if (section === 'storeContact') editMode.value.storeContact = false
    if (section === 'storeAddress') editMode.value.storeAddress = false
  } catch (error) {
    notification.error('Error al guardar la configuración')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadSettings()
})

const metafieldsSearch = ref('')

const editMode = ref({
  storeContact: false,
  storeAddress: false
})

const fileInput = ref(null)
const squareFileInput = ref(null)

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click()
}
const triggerSquareFileInput = () => {
  if (squareFileInput.value) squareFileInput.value.click()
}
</script>

<template>
  <div class="max-w-5xl pb-12">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">General</h1>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button 
          @click="activeTab = 'details'"
          :class="[activeTab === 'details' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300', 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition']"
        >
          Detalles de la tienda
        </button>
        <button 
          @click="activeTab = 'branding'"
          :class="[activeTab === 'branding' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300', 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition']"
        >
          Marca (Branding)
        </button>
        <button 
          @click="activeTab = 'metafields'"
          :class="[activeTab === 'metafields' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300', 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition']"
        >
          Metacampos y Avanzado
        </button>
      </nav>
    </div>

    <!-- TAB 1: Detalles de la tienda -->
    <div v-if="activeTab === 'details'" class="space-y-6">
      <!-- Información comercial -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Información comercial</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Entidad comercial que se usa para productos financieros, mercados, apps e impuestos en esta tienda.</p>
        </div>
        <div class="p-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 900 600" class="w-full h-full">
                <rect width="900" height="600" fill="#d52b1e"/>
                <rect width="900" height="300" fill="#fff"/>
                <rect width="300" height="300" fill="#0039a6"/>
                <polygon points="150,55 179,145 274,145 197,201 226,291 150,235 74,291 103,201 26,145 121,145" fill="#fff"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ storeData.businessName }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ storeData.businessCountry }}</p>
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
          </button>
        </div>
      </section>

      <!-- Detalles de contacto -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Detalles de contacto de la tienda</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">La información que ven los clientes en tu tienda online.</p>
        </div>
        
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Bloque Contacto -->
          <div v-if="!editMode.storeContact" class="p-6 flex items-start justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition" @click="editMode.storeContact = true">
            <div class="flex gap-4">
              <div class="mt-0.5 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ storeData.storeName }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ storeData.email }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ storeData.phone }}</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div v-else class="p-6 bg-gray-50 dark:bg-gray-900/50">
             <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Editar contacto de la tienda</h3>
             <div class="grid grid-cols-1 gap-4 mb-4">
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la tienda</label>
                 <input type="text" v-model="storeData.storeName" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
               </div>
             </div>
             <div class="grid grid-cols-2 gap-4">
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo electrónico</label>
                 <input type="email" v-model="storeData.email" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                 <input type="text" v-model="storeData.phone" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
               </div>
             </div>
             <div class="mt-5 flex justify-end gap-3">
               <button @click="editMode.storeContact = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">Cancelar</button>
               <button @click="editMode.storeContact = false" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-gray-900 transition">Guardar</button>
             </div>
          </div>
          
          <!-- Bloque Dirección -->
          <div v-if="!editMode.storeAddress" class="p-6 flex items-start justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition" @click="editMode.storeAddress = true">
            <div class="flex gap-4">
              <div class="mt-0.5 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ storeData.addressName }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg">{{ storeData.addressFull }}</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <div v-else class="p-6 bg-gray-50 dark:bg-gray-900/50">
             <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Editar dirección</h3>
             <div class="grid grid-cols-1 gap-4">
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la dirección</label>
                 <input type="text" v-model="storeData.addressName" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección completa</label>
                 <textarea v-model="storeData.addressFull" rows="3" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
               </div>
             </div>
             <div class="mt-5 flex justify-end gap-3">
               <button @click="editMode.storeAddress = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">Cancelar</button>
               <button @click="editMode.storeAddress = false" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-gray-900 transition">Guardar</button>
             </div>
          </div>
        </div>
      </section>

      <!-- Valores predeterminados -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Valores predeterminados de la tienda</h2>
        </div>
        <div class="p-6 space-y-6">
          
          <!-- Moneda -->
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Visualización de la moneda</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Para gestionar las monedas que ven los clientes, ve a <a href="#" @click.prevent="router.push('/admin/settings/markets')" class="text-blue-600 hover:underline">Markets</a></p>
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                {{ storeData.currency }}
              </span>
              <button @click="router.push('/admin/settings/markets')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
              </button>
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-700">

          <!-- Región de copia de seguridad -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Región de copia de seguridad</label>
            <select v-model="storeData.backupRegion" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>Chile</option>
              <option>Estados Unidos</option>
              <option>Unión Europea</option>
            </select>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Determina la configuración para clientes fuera de tus mercados</p>
          </div>

          <hr class="border-gray-200 dark:border-gray-700">

          <!-- Unidades -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Sistema de unidades</label>
              <select v-model="storeData.unitSystem" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Sistema métrico</option>
                <option>Sistema imperial</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Unidad de peso predeterminada</label>
              <select v-model="storeData.defaultWeight" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Kilogramo (kg)</option>
                <option>Gramo (g)</option>
              </select>
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-700">

          <!-- Zona horaria -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Zona horaria</label>
            <select v-model="storeData.timezone" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>(GMT-04:00) Santiago</option>
              <option>(GMT-03:00) Buenos Aires</option>
              <option>(GMT-05:00) Lima, Bogota</option>
            </select>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Establece la hora en la que se registran los pedidos y los informes y estadísticas.</p>
          </div>
        </div>
      </section>
    </div>

    <!-- TAB 2: Marca (Branding) -->
    <div v-if="activeTab === 'branding'" class="space-y-6">
      
      <!-- Logotipos -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Logotipos</h2>
        </div>
        <div class="p-6 space-y-8">
          
          <input type="file" ref="fileInput" class="hidden" accept="image/*" />
          <input type="file" ref="squareFileInput" class="hidden" accept="image/*" />

          <!-- Logo principal -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Logotipo</h3>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50">
              <h1 class="text-3xl font-serif text-blue-900 dark:text-blue-300 tracking-wider font-bold mb-4">Bilbola <span class="text-sm font-sans block text-center font-normal tracking-widest text-gray-500">DECO KIDS</span></h1>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <button @click="triggerFileInput" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">Cambiar</button>
              <button class="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-red-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition">Eliminar</button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">HEIC, WEBP, SVG, PNG o JPG. Ancho recomendado: mínimo 512 píxeles.</p>
          </div>

          <hr class="border-gray-200 dark:border-gray-700">

          <!-- Logo Cuadrado -->
          <div>
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Cuadrado</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Lo usan algunos canales de redes sociales. Puede recortarse en forma de círculo.</p>
              </div>
              <div class="flex flex-col items-end">
                <label class="text-xs text-gray-500 mb-1">Vista previa</label>
                <select v-model="brandingData.squareLogoPreview" class="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>Cuadrado</option>
                  <option>Círculo</option>
                  <option>Favicon</option>
                </select>
              </div>
            </div>
            
            <div class="w-32 h-32 border-2 border-gray-200 dark:border-gray-700 rounded bg-white flex items-center justify-center text-4xl font-serif text-blue-900 font-bold overflow-hidden" :class="{'rounded-full': brandingData.squareLogoPreview === 'Círculo'}">
              B
            </div>
            
            <div class="mt-4 flex items-center gap-3">
              <button @click="triggerSquareFileInput" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">Cambiar</button>
              <button class="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-red-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition">Eliminar</button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">HEIC, WEBP, SVG, PNG o JPG. Recomendado: mínimo 512x512 píxeles.</p>
          </div>
          
        </div>
      </section>

      <!-- Colores -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Colores</h2>
        </div>
        <div class="p-6 space-y-6">
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Principal</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Los colores de marca que aparecen en tu tienda, redes sociales y más sitios</p>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full shadow-sm border border-gray-200 cursor-pointer relative overflow-hidden">
                    <input type="color" v-model="brandingData.primaryColor" class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer">
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Color principal</span>
                    <span class="text-xs text-gray-500 uppercase">{{ brandingData.primaryColor }}</span>
                  </div>
                </div>
                <button class="text-sm font-medium text-red-600 hover:text-red-700">Eliminar</button>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full shadow-sm border border-gray-200 cursor-pointer relative overflow-hidden">
                    <input type="color" v-model="brandingData.contrastColor" class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer">
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Color de contraste</span>
                    <span class="text-xs text-gray-500 uppercase">{{ brandingData.contrastColor }}</span>
                  </div>
                </div>
                <button class="text-sm font-medium text-red-600 hover:text-red-700">Eliminar</button>
              </div>
            </div>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-700">
          
          <div>
             <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Secundario</h3>
             
             <div v-for="(color, index) in secondaryColors" :key="index" class="flex items-center justify-between mt-4">
               <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-full shadow-sm border border-gray-200 cursor-pointer relative overflow-hidden">
                   <input type="color" v-model="secondaryColors[index]" class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer">
                 </div>
                 <div>
                   <span class="text-sm font-medium text-gray-900 dark:text-white block">Color secundario {{ index + 1 }}</span>
                   <span class="text-xs text-gray-500 uppercase">{{ color }}</span>
                 </div>
               </div>
               <button @click="removeSecondaryColor(index)" class="text-sm font-medium text-red-600 hover:text-red-700">Eliminar</button>
             </div>

             <button @click="addSecondaryColor" class="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">+ Agregar color secundario</button>
          </div>
        </div>
      </section>
    </div>

    <!-- TAB 3: Metacampos -->
    <div v-if="activeTab === 'metafields'" class="space-y-6">
      
      <!-- Búsqueda Header -->
      <div class="flex justify-between items-center mb-4">
        <div class="relative w-full max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input v-model="metafieldsSearch" type="text" placeholder="Buscar en Tiendas" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition">
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">Ver metacampos sin estructurar</button>
          <button class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">Ver definiciones</button>
        </div>
      </div>

      <!-- No fijados -->
      <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">No fijados</h2>
        </div>
        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google: Show Store Widget Ap...</label>
            <input type="text" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google: Merchant ID</label>
            <input type="text" value="759061761" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
        </div>
      </section>

      <div class="text-center mt-6">
        <a href="#" class="text-sm font-medium text-blue-600 hover:underline">Más información sobre metacampos</a>
      </div>
    </div>
  </div>
</template>
