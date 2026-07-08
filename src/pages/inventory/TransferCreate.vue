<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { locations, inventoryItems, transfers } from '@/stores/mockInventory'

const router = useRouter()
const origin = ref('')
const destination = ref('')
const referenceNumber = ref('')
const transferType = ref('Reabastecimiento')
const expectedArrival = ref('')
const creationDate = new Date().toLocaleDateString('es-CL')

onMounted(() => {
  referenceNumber.value = '#TR-00' + (transfers.value.length + 1)
})

const searchQuery = ref('')
const selectedItems = ref([])
const pendingItem = ref(null)
const pendingSelections = ref({})

const searchResults = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return inventoryItems.value.filter(item => 
    item.product.toLowerCase().includes(query) || 
    item.sku.toLowerCase().includes(query)
  )
})

const selectSearchResult = (item) => {
  if (item.options && item.options.length > 0) {
    pendingItem.value = item
    pendingSelections.value = {}
    item.options.forEach(opt => {
      pendingSelections.value[opt.name] = opt.values[0]
    })
    searchQuery.value = ''
  } else {
    addItem(item)
  }
}

const confirmPendingItem = () => {
  const variantParts = pendingItem.value.options.map(opt => `${pendingSelections.value[opt.name]}`);
  const variantString = variantParts.join(' / ');
  
  const itemToAdd = {
    ...pendingItem.value,
    selectedVariant: variantString
  };

  const exists = selectedItems.value.find(i => i.id === itemToAdd.id && i.selectedVariant === itemToAdd.selectedVariant)
  if (exists) {
    exists.transferQuantity += 1;
  } else {
    selectedItems.value.push({
      ...itemToAdd,
      uniqueId: Date.now().toString() + Math.random().toString(),
      transferQuantity: 1,
      selectedVariant: variantString
    })
  }
}

const cancelPendingItem = () => {
  pendingItem.value = null;
  pendingSelections.value = {};
}

const addItem = (item) => {
  const exists = selectedItems.value.find(i => i.id === item.id && i.selectedVariant === item.selectedVariant)
  if (exists) {
    exists.transferQuantity += 1;
    searchQuery.value = ''
    return;
  }

  selectedItems.value.push({
    ...item,
    uniqueId: Date.now().toString() + Math.random().toString(),
    transferQuantity: 1,
    selectedVariant: item.selectedVariant || null
  })
  
  searchQuery.value = ''
}

const removeItem = (uniqueId) => {
  selectedItems.value = selectedItems.value.filter(i => i.uniqueId !== uniqueId)
}

const totalItems = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.transferQuantity || 0), 0)
})

const goBack = () => {
  if (origin.value || destination.value || selectedItems.value.length > 0) {
    const confirmDraft = confirm('Tienes información sin guardar. ¿Deseas guardar esta transferencia como borrador antes de salir?');
    if (confirmDraft) {
      alert('Transferencia guardada como borrador exitosamente.');
    }
  }
  router.push('/admin/inventory/transfers')
}

const submitTransfer = () => {
  if (!origin.value || !destination.value) {
    alert('Por favor, selecciona un origen y un destino.');
    return;
  }
  
  const validItems = selectedItems.value.filter(i => i.transferQuantity > 0);
  if (validItems.length === 0) {
    alert('Por favor, ingresa una cantidad mayor a 0 para al menos un producto.');
    return;
  }
  if (!expectedArrival.value) {
    alert('Por favor, ingresa la fecha estimada de llegada.');
    return;
  }
  
  const arrivalDate = new Date(expectedArrival.value + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 5);

  if (arrivalDate < today) {
    alert('La fecha estimada no puede ser en el pasado.');
    return;
  }

  if (arrivalDate > maxDate) {
    alert('La fecha estimada de llegada no puede superar los 5 días desde hoy.');
    return;
  }
  
  alert(`Transferencia de tipo "${transferType.value}" creada exitosamente.`);
  router.push('/admin/inventory/transfers');
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Crear transferencia</h1>
      </div>
      <div>
        <button @click="submitTransfer" class="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition shadow-sm">
          Guardar y crear
        </button>
      </div>
    </div>

    <div class="flex gap-6 items-start">
      <!-- Left Column -->
      <div class="flex-1 space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Origen</label>
              <select v-model="origin" class="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                <option value="">Seleccionar origen</option>
                <option v-for="loc in locations" :key="'orig_' + loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div class="text-gray-400 mt-5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Destino</label>
              <select v-model="destination" class="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                <option value="">Seleccionar destino</option>
                <option v-for="loc in locations" :key="'dest_' + loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
          </div>

          <div class="relative mt-8">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchQuery" type="text" class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Buscar productos para transferir">
            
            <!-- Search Results Dropdown -->
            <div v-if="searchQuery && searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
              <ul class="py-1">
                <li v-for="item in searchResults" :key="item.id" @click="selectSearchResult(item)" class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center border border-gray-200 mr-3">
                       <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ item.product }}</p>
                      <p class="text-xs text-gray-500">SKU: {{ item.sku }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <!-- Pending Variant Selection -->
            <div v-if="pendingItem" class="mt-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h4 class="font-medium text-blue-900 mb-4 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Configurar variantes para: {{ pendingItem.product }}
              </h4>
              <div class="flex gap-4 mb-4">
                <div v-for="opt in pendingItem.options" :key="opt.name" class="flex-1">
                  <label class="block text-xs font-medium text-gray-700 mb-1">{{ opt.name }}</label>
                  <select v-model="pendingSelections[opt.name]" class="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option v-for="val in opt.values" :key="val" :value="val">{{ val }}</option>
                  </select>
                </div>
              </div>
              <div class="flex justify-between items-center border-t border-blue-100 pt-3 mt-2">
                <p class="text-xs text-blue-600 font-medium">Puedes agregar múltiples variantes a la tabla.</p>
                <div class="flex space-x-3">
                  <button @click="cancelPendingItem" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Terminar y cerrar</button>
                  <button @click="confirmPendingItem" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Agregar variante
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else-if="searchQuery && searchResults.length === 0" class="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-4 text-sm text-center text-gray-500">
              No se encontraron productos
            </div>
          </div>

          <!-- Selected Items Table -->
          <div v-if="selectedItems.length > 0" class="mt-8">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="pb-3 text-sm font-semibold text-gray-600">Producto</th>
                  <th class="pb-3 text-sm font-semibold text-gray-600 w-24 text-right">Cantidad</th>
                  <th class="pb-3 text-sm font-semibold text-gray-600 w-10"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in selectedItems" :key="'sel_' + item.uniqueId">
                  <td class="py-4 align-top">
                    <p class="text-sm font-medium text-blue-600">{{ item.product }}</p>
                    <p class="text-xs text-gray-500 mb-2">{{ item.sku }}</p>
                    <p v-if="item.selectedVariant" class="text-xs font-medium text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded">{{ item.selectedVariant }}</p>
                  </td>
                  <td class="py-4 text-right align-top">
                    <input v-model.number="item.transferQuantity" type="number" min="1" class="w-full border border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500 text-right">
                  </td>
                  <td class="py-4 text-right align-top">
                    <button @click="removeItem(item.uniqueId)" class="text-gray-400 hover:text-red-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="w-80 space-y-6">
        <!-- Detalles -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Resumen</h3>
          <div class="flex justify-between text-sm text-gray-600 mb-4">
            <span>{{ selectedItems.length }} productos distintos ({{ totalItems }} unidades)</span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-4 pt-4 border-t border-gray-100">Detalles de operación</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de movimiento</label>
              <select v-model="transferType" class="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                <option value="Reabastecimiento">Reabastecimiento normal</option>
                <option value="Devolución">Devolución a bodega (Restar stock local)</option>
                <option value="Merma">Retiro permanente (Merma/Dañado)</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">El stock se restará del Origen en cuanto se apruebe.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de creación</label>
              <input :value="creationDate" type="text" disabled class="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-500 cursor-not-allowed">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha estimada de llegada (Máx 5 días)</label>
              <input v-model="expectedArrival" type="date" class="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número de referencia o seguimiento</label>
              <input v-model="referenceNumber" type="text" class="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="#TR-xxxx">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
