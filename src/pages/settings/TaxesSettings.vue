<script setup>
import { ref, computed } from 'vue'

const currentView = ref('main')
const currentRegion = ref(null)
const searchQuery = ref('')
const isApiModalOpen = ref(false)
const isAduanaEdit = ref(false)
const isTaxReportModalOpen = ref(false)

const aduanaData = ref({
  paisOrigen: '',
  codigoSA: ''
})

const countryRegions = ref([
  { id: 'chile', flag: '🇨🇱', name: 'Chile', recaudacion: '—', taxService: 'Manual Tax' },
  { id: 'colombia', flag: '🇨🇴', name: 'Colombia', recaudacion: 'Impuestos', taxService: 'Manual Tax' },
  { id: 'ecuador', flag: '🇪🇨', name: 'Ecuador', recaudacion: 'Impuestos', taxService: 'Manual Tax' },
  { id: 'estados-unidos', flag: '🇺🇸', name: 'Estados Unidos', recaudacion: 'Impuestos', taxService: 'Bilbola Tax' },
  { id: 'resto-del-mundo', flag: '🌐', name: 'Resto del mundo', recaudacion: 'Impuestos', taxService: 'Manual Tax' }
])

const filteredCountryRegions = computed(() => {
  if (!searchQuery.value) return countryRegions.value
  const query = searchQuery.value.toLowerCase()
  return countryRegions.value.filter(c => c.name.toLowerCase().includes(query))
})

const regions = ref([
  { id: 'antofagasta', name: 'Antofagasta', taxRate: 0, taxType: 'VAT', taxBehavior: 'agregado al 0% de imp...' },
  { id: 'araucania', name: 'Araucanía', taxRate: 0, taxType: 'VAT', taxBehavior: 'agregado al 0% de imp...' },
  { id: 'arica', name: 'Arica y Parinacota', taxRate: 0, taxType: 'VAT', taxBehavior: 'agregado al 0% de imp...' },
  { id: 'atacama', name: 'Atacama', taxRate: 0, taxType: 'VAT', taxBehavior: 'agregado al 0% de imp...' },
  { id: 'aysen', name: 'Aysén', taxRate: 0, taxType: 'VAT', taxBehavior: 'agregado al 0% de imp...' },
  { id: 'biobio', name: 'Biobío', taxRate: 0, taxType: 'VAT', taxBehavior: 'agregado al 0% de imp...' },
  { id: 'coquimbo', name: 'Coquimbo', taxRate: 0, taxType: 'VAT', taxBehavior: 'agregado al 0% de imp...' },
  { id: 'los-lagos', name: 'Los Lagos', taxRate: 0, taxType: 'VAT', taxBehavior: 'agregado al 0% de imp...' }
])

const openRegion = (regionName) => {
  currentRegion.value = countryRegions.value.find(c => c.name === regionName)
  currentView.value = 'region_detail'
}
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-[#F1F2F4] p-8">
    <div class="max-w-3xl mx-auto space-y-6">

      <!-- MAIN VIEW -->
      <template v-if="currentView === 'main'">
        <div class="mb-6">
          <h1 class="text-xl font-semibold text-gray-900">Impuestos y aranceles</h1>
        </div>

        <!-- Servicio fiscal -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">Servicio fiscal</h2>
            <button @click="isApiModalOpen = true" class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Gestionar
            </button>
          </div>
          <div class="p-5 flex items-center gap-3">
            <div class="w-8 h-8 flex items-center justify-center bg-[#95BF47] rounded text-white font-bold text-xs">
              S
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900">Servicios fiscales de Bilbola</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                <span class="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                Activo
              </span>
            </div>
          </div>
        </div>

        <!-- Regiones de impuestos -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-5 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900 flex items-center gap-1">
              Regiones de impuestos
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </h2>
            <p class="text-sm text-gray-500 mt-2">
              Son las zonas donde tus clientes pagarán impuestos y donde tú los recaudarás y remitirás. Crea una <a href="#" class="text-blue-600 hover:underline">zona de envío</a> para agregar una nueva región fiscal. Si no tienes clara tu responsabilidad fiscal, consulta a un profesional de impuestos.
            </p>
          </div>
          
          <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <div class="relative max-w-sm w-full">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input type="text" v-model="searchQuery" placeholder="Buscar país..." class="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <button class="ml-4 p-1.5 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h5m0 0v8m0-8h14"></path></svg>
            </button>
          </div>

          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500">Región</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500">Recaudación</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500">Servicio fiscal</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="country in filteredCountryRegions" :key="country.id" class="hover:bg-gray-50 cursor-pointer" @click="openRegion(country.name)">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                  <span class="text-lg">{{ country.flag }}</span> {{ country.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ country.recaudacion }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ country.taxService }}</td>
              </tr>
              <tr v-if="filteredCountryRegions.length === 0">
                <td colspan="3" class="px-6 py-8 text-center text-sm text-gray-500">
                  No se encontraron regiones con "{{ searchQuery }}"
                </td>
              </tr>
            </tbody>
          </table>

          <div class="px-6 py-3 bg-white border-t border-gray-200">
            <button @click="isTaxReportModalOpen = true" class="text-sm text-gray-700 hover:underline flex items-center justify-between w-full">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Informe global de impuestos recaudados
              </span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        <!-- Configuración adicional -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-5 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">Configuración adicional</h2>
          </div>
          <div class="p-5 space-y-6">
            
            <div class="flex items-start gap-3">
              <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <div>
                <label class="text-sm font-medium text-gray-900">Incluir impuesto sobre las ventas en el precio del producto y la tarifa de envío</label>
                <p class="text-sm text-gray-500 mt-1">Asume una tasa predeterminada de impuestos del 19 % (IVA), que se ajusta a las tasas locales si se agregan más regiones en el futuro.</p>
                
                <div class="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-2">
                  <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p class="text-sm text-gray-700">La tasa de impuestos de la tienda es del 19 % (IVA) al estar operando bajo las leyes y normativas de Chile para ventas dentro del país.</p>
                </div>
              </div>
            </div>

          </div>
          
          <div class="p-4 bg-gray-50 border-t border-gray-200 text-center">
            <a href="https://www.sii.cl/portales/investigadores/impuestos_chile/impuestos_chile.htm" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 hover:underline">Más información sobre impuestos en Chile (SII)</a>
          </div>
        </div>
        
        <!-- API Config Modal -->
        <div v-if="isApiModalOpen" class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Configuración API (SII)</h3>
              <button @click="isApiModalOpen = false" class="text-gray-400 hover:text-gray-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <p class="text-sm text-gray-600 mb-4">Configura la conexión con el facturador electrónico o el Servicio de Impuestos Internos (SII) de Chile.</p>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">URL de la API / Endpoint</label>
                <input type="text" placeholder="https://api.sii.cl/v1/..." class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Clave de API / Token</label>
                <input type="password" placeholder="••••••••••••••••" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              </div>
              <div class="pt-2">
                <button class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Probar conexión
                </button>
              </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button @click="isApiModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
              <button @click="isApiModalOpen = false" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition">Guardar</button>
            </div>
          </div>
        </div>
      </template>

      <!-- REGION VIEW (Dinámico) -->
      <template v-if="currentView === 'region_detail' && currentRegion">
        <!-- Header con Breadcrumb -->
        <div class="flex items-center text-sm text-gray-500 mb-2 cursor-pointer hover:text-gray-900 transition" @click="currentView = 'main'">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          <span class="mx-1 font-medium">Impuestos y aranceles</span>
          <span class="mx-1">&rsaquo;</span>
          <h1 class="text-xl font-semibold text-gray-900 ml-1">{{ currentRegion.name }}</h1>
        </div>

        <!-- Servicio fiscal (Detalle) -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-5 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">Servicio fiscal</h2>
          </div>
          <div class="p-5">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-medium text-gray-900">Manual Tax</h3>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    <span class="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Activo
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">Servicio gratuito</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Impuestos base (Detalle) -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-5 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">Impuestos base</h2>
          </div>
          
          <div class="p-5">
            <!-- Regiones Header -->
            <div class="flex items-center justify-between py-3 border-b border-gray-100 mb-2">
              <span class="text-sm font-medium text-gray-900">Regiones</span>
              <button class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Restablecer tasas de impuestos predeterminadas
              </button>
            </div>

            <!-- Base -->
            <div class="flex items-center justify-between py-4">
              <span class="text-sm font-medium text-gray-900 w-1/3">{{ currentRegion.name }}</span>
              <div class="w-2/3 flex items-center gap-3">
                <div class="relative w-32">
                  <input type="number" value="19" class="block w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

    </div>

    <!-- Tax Report Modal -->
    <div v-if="isTaxReportModalOpen" class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Informe global de impuestos recaudados</h3>
          <button @click="isTaxReportModalOpen = false" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-500 mb-4">Resumen de la recaudación fiscal por país para el período actual.</p>
          <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden text-left">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-2 text-xs font-medium text-gray-500">País</th>
                <th class="px-4 py-2 text-xs font-medium text-gray-500">Tasa Promedio</th>
                <th class="px-4 py-2 text-xs font-medium text-gray-500">Monto Imponible</th>
                <th class="px-4 py-2 text-xs font-medium text-gray-500">Impuesto Recaudado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="px-4 py-3 text-sm text-gray-900 font-medium">🇨🇱 Chile</td>
                <td class="px-4 py-3 text-sm text-gray-500">19%</td>
                <td class="px-4 py-3 text-sm text-gray-500">$1,500,000 CLP</td>
                <td class="px-4 py-3 text-sm text-gray-900">$285,000 CLP</td>
              </tr>
              <tr>
                <td class="px-4 py-3 text-sm text-gray-900 font-medium">🇺🇸 Estados Unidos</td>
                <td class="px-4 py-3 text-sm text-gray-500">0%</td>
                <td class="px-4 py-3 text-sm text-gray-500">$0 USD</td>
                <td class="px-4 py-3 text-sm text-gray-900">$0 USD</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button @click="isTaxReportModalOpen = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Cerrar informe</button>
        </div>
      </div>
    </div>
  </div>
</template>
