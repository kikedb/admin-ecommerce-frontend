<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const profileName = ref('Perfil general')

const showProductModal = ref(false)
const searchQuery = ref('')
const selectedProducts = ref([1, 2, 3, 4, 5, 6, 7]) // mock ids

const mockCatalog = [
  { id: 1, name: 'Adorno hotel book', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80' },
  { id: 2, name: 'Alcancía cabra crema pequena', image: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=100&q=80' },
  { id: 3, name: 'Alcancía coneja Anita grande', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=100&q=80' },
  { id: 4, name: 'Alcancía coneja Anita mediana', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=100&q=80' },
  { id: 5, name: 'Alcancía de chanchito rosado', image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=100&q=80' },
  { id: 6, name: 'Alcancía de dinosaurio pequeño', image: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&w=100&q=80' },
  { id: 7, name: 'Alcancía hipopótamo en auto', image: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=100&q=80' }
]

const toggleProduct = (id) => {
  const idx = selectedProducts.value.indexOf(id)
  if (idx > -1) {
    selectedProducts.value.splice(idx, 1)
  } else {
    selectedProducts.value.push(id)
  }
}

const showModal = ref(false)
const modalType = ref('')

const locationForm = ref({ name: '', address: '' })
const zoneForm = ref({ name: '', countries: [] })
const rateForm = ref({ name: '', price: 0, conditions: 'none' })

const openModal = (type) => {
  modalType.value = type
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  locationForm.value = { name: '', address: '' }
  zoneForm.value = { name: '', countries: [] }
  rateForm.value = { name: '', price: 0, conditions: 'none' }
}

const saveAction = () => {
  closeModal()
}
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button @click="router.back()" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </button>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ profileName }}</h1>
    </div>

    <!-- Products -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Productos</h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">Los productos nuevos se agregan por defecto</span>
      </div>
      <div class="p-5">
        <div 
          @click="showProductModal = true"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition group"
        >
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">Todos los productos que no estén en otros perfiles</h3>
            <p class="text-sm text-gray-500 mt-1">{{ selectedProducts.length }} productos seleccionados</p>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
      </div>
    </section>

    <!-- Origin Location -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Ubicación de procesamiento</h2>
        <button @click="openModal('location')" class="text-sm font-medium text-blue-600 hover:text-blue-700">Agregar ubicación</button>
      </div>
      <div class="p-5">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">VENTA VITACURA</h3>
                <p class="text-sm text-gray-500 mt-1">6195 Avenida Vitacura, Pueblo del Ingles Local 19, VITACURA Santiago, Santiago, Chile</p>
              </div>
              <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
              </button>
            </div>
            
            <!-- Shipping Zones inside this location -->
            <div class="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Zonas de envío</h4>
                <button @click="openModal('zone')" class="text-sm font-medium text-blue-600 hover:text-blue-700">Agregar zona</button>
              </div>
              
              <div class="p-4">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-4 bg-gray-200 rounded overflow-hidden">
                      <svg viewBox="0 0 900 600" class="w-full h-full">
                        <rect width="900" height="600" fill="#d52b1e"/>
                        <rect width="900" height="300" fill="#fff"/>
                        <rect width="300" height="300" fill="#0039a6"/>
                        <polygon points="150,55 179,145 274,145 197,201 226,291 150,235 74,291 103,201 26,145 121,145" fill="#fff"/>
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">Chile</span>
                  </div>
                  <button @click="openModal('zone_options')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                  </button>
                </div>

                <!-- Carrier App Rate -->
                <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded bg-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                        <span class="text-xs font-bold text-black uppercase">CHX</span>
                      </div>
                      <div>
                        <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Chilexpress (tarifas proporcionadas por la app)</h5>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">3 servicios • Tiempo de tránsito calculado</p>
                        
                        <div class="mt-3 space-y-1">
                          <p class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <span class="w-1 h-1 bg-gray-400 rounded-full"></span> Chilexpress Entrega dia sabado
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <span class="w-1 h-1 bg-gray-400 rounded-full"></span> Chilexpress Express
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <span class="w-1 h-1 bg-gray-400 rounded-full"></span> Chilexpress Prioritario
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                        Calculado
                      </span>
                      <button @click="openModal('rate')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <button @click="openModal('add_rate')" class="text-sm font-medium text-blue-600 hover:text-blue-700">Agregar opción de envío</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- Floating Save Button -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-end z-40">
      <button @click="router.back()" class="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 text-sm font-medium rounded-lg shadow-sm transition">
        Guardar
      </button>
    </div>
    
    <!-- Manage Products Modal -->
    <div v-if="showProductModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
        
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Gestionar productos</h2>
          <button @click="showProductModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex gap-3">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Buscar productos" class="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition">
          </div>
          <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 shadow-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            Buscar por Todo
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <button class="px-4 py-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition">
            Agregar filtro +
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-0">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 dark:bg-gray-900/80 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="w-12 px-4 py-3 text-center">
                  <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked />
                </th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Perfil</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="product in mockCatalog" 
                :key="product.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                @click="toggleProduct(product.id)"
              >
                <td class="px-4 py-3 text-center" @click.stop>
                  <input type="checkbox" :checked="selectedProducts.includes(product.id)" @change="toggleProduct(product.id)" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img :src="product.image" class="w-10 h-10 rounded border border-gray-200 object-cover" />
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Perfil General
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showProductModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition">
            Cancelar
          </button>
          <button @click="showProductModal = false" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 shadow-sm transition">
            Listo
          </button>
        </div>
        
      </div>
    </div>
    
    <!-- Functional Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            <span v-if="modalType === 'location'">Agregar ubicación</span>
            <span v-if="modalType === 'zone'">Agregar zona</span>
            <span v-if="modalType === 'zone_options'">Opciones de Zona</span>
            <span v-if="modalType === 'rate' || modalType === 'add_rate'">{{ modalType === 'rate' ? 'Editar tarifa' : 'Agregar tarifa' }}</span>
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[70vh]">
          
          <!-- Location Modal -->
          <div v-if="modalType === 'location'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la ubicación</label>
              <input type="text" v-model="locationForm.name" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
              <textarea v-model="locationForm.address" rows="3" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"></textarea>
            </div>
          </div>

          <!-- Zone Modal -->
          <div v-if="modalType === 'zone' || modalType === 'zone_options'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la zona</label>
              <input type="text" v-model="zoneForm.name" placeholder="Ej. Zona Norte" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Países y regiones</label>
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                <label class="flex items-center gap-2"><input type="checkbox" class="rounded border-gray-300"> Chile</label>
                <label class="flex items-center gap-2"><input type="checkbox" class="rounded border-gray-300"> Argentina</label>
                <label class="flex items-center gap-2"><input type="checkbox" class="rounded border-gray-300"> Perú</label>
                <label class="flex items-center gap-2"><input type="checkbox" class="rounded border-gray-300"> Resto del mundo</label>
              </div>
            </div>
            <div v-if="modalType === 'zone_options'" class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button class="text-sm font-medium text-red-600 hover:text-red-700">Eliminar zona</button>
            </div>
          </div>

          <!-- Rate Modal -->
          <div v-if="modalType === 'rate' || modalType === 'add_rate'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la tarifa</label>
              <input type="text" v-model="rateForm.name" placeholder="Ej. Envío estándar" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio</label>
              <input type="number" v-model="rateForm.price" placeholder="CLP" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condiciones</label>
              <select v-model="rateForm.conditions" class="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md">
                <option value="none">Sin condiciones</option>
                <option value="weight">Basado en el peso</option>
                <option value="price">Basado en el precio del pedido</option>
              </select>
            </div>
            <div v-if="modalType === 'rate'" class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button class="text-sm font-medium text-red-600 hover:text-red-700">Eliminar tarifa</button>
            </div>
          </div>

        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">
            Cancelar
          </button>
          <button @click="saveAction" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
