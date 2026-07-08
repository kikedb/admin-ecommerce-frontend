<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { globalOrders } from '@/stores/mockOrders'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const notification = useNotification()

const selectedProducts = ref([])
const searchProductTerm = ref('')
const searchCustomerTerm = ref('')
const showCustomerSearch = ref(false)
const selectedCustomer = ref(null)
const notes = ref('')
const tags = ref('')
const discountAmount = ref(0)
const shippingAmount = ref(0)
const paymentStatus = ref('Pendiente')
const paymentMethod = ref('Transferencia bancaria')
const isSaving = ref(false)

// Modals
const showDiscountModal = ref(false)
const tempDiscountAmount = ref(0)

// Simulated product database
const mockProducts = [
  { id: '1', name: 'Sujetador de chupete conejo rayas azul', price: 12990, sku: 'EBAB0464', image: null, stock: 45 },
  { id: '2', name: 'Set de Baberos Algodón Orgánico', price: 15990, sku: 'EBAB0501', image: null, stock: 12 },
  { id: '3', name: 'Manta Tejida Bebé', price: 24990, sku: 'EBAB0600', image: null, stock: 8 },
  { id: '4', name: 'Pack 3 Calcetines Recién Nacido', price: 8990, sku: 'EBAB0711', image: null, stock: 100 }
]

const mockCustomers = [
  { id: 'c1', name: 'Macarena Pizarro', email: 'maca@ejemplo.com', phone: '+56 9 1234 5678', address: 'Las Condes, Santiago' },
  { id: 'c2', name: 'Juan Pérez', email: 'juan@ejemplo.com', phone: '+56 9 8765 4321', address: 'Providencia, Santiago' },
  { id: 'c3', name: 'Camila Rojas', email: 'camila@ejemplo.com', phone: '+56 9 5555 5555', address: 'Vitacura, Santiago' }
]

const showProductSearch = ref(false)

const filteredProducts = computed(() => {
  if (!searchProductTerm.value) return mockProducts
  return mockProducts.filter(p => p.name.toLowerCase().includes(searchProductTerm.value.toLowerCase()) || p.sku.toLowerCase().includes(searchProductTerm.value.toLowerCase()))
})

const filteredCustomers = computed(() => {
  if (!searchCustomerTerm.value) return mockCustomers
  return mockCustomers.filter(c => c.name.toLowerCase().includes(searchCustomerTerm.value.toLowerCase()) || c.email.toLowerCase().includes(searchCustomerTerm.value.toLowerCase()))
})

const selectCustomer = (customer) => {
  selectedCustomer.value = customer
  searchCustomerTerm.value = ''
  showCustomerSearch.value = false
}

const removeCustomer = () => {
  selectedCustomer.value = null
}

const goToCreateCustomer = () => {
  router.push('/customers/create')
}

const addProduct = (product) => {
  const existing = selectedProducts.value.find(p => p.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    selectedProducts.value.push({ ...product, quantity: 1 })
  }
  searchProductTerm.value = ''
  showProductSearch.value = false
}

const removeProduct = (index) => {
  selectedProducts.value.splice(index, 1)
}

const subtotalNeto = computed(() => {
  return selectedProducts.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const ivaAmount = computed(() => {
  return Math.round(subtotalNeto.value * 0.19)
})

const total = computed(() => {
  return subtotalNeto.value + ivaAmount.value - discountAmount.value + shippingAmount.value
})

const formattedTotal = computed(() => {
  return `$${total.value.toLocaleString('es-CL')}`
})

const saveOrder = () => {
  if (selectedProducts.value.length === 0) {
    notification.error('Agrega al menos un producto al pedido.')
    return
  }

  isSaving.value = true

  setTimeout(() => {
    // Generate correlative ID (highest ID + 1)
    let nextId = 5889 // Default if array is empty
    if (globalOrders.value.length > 0) {
      const maxId = Math.max(...globalOrders.value.map(o => parseInt(o.id.split('-')[0]) || 0))
      nextId = maxId + 1
    }
    
    const newOrderId = nextId.toString()
    const newOrder = {
      id: newOrderId,
      date: 'Justo ahora',
      client: selectedCustomer.value ? selectedCustomer.value.name : 'Sin cliente',
      canal: 'Borrador',
      total: formattedTotal.value,
      paymentStatus: paymentStatus.value,
      fulfillmentStatus: 'No preparado',
      deliveryStatus: '',
      items: `${selectedProducts.value.reduce((acc, p) => acc + p.quantity, 0)} artículos`,
      deliveryMethod: 'Por definir',
      status: 'active'
    }

    globalOrders.value.unshift(newOrder)
    
    notification.success('Pedido creado exitosamente')
    router.push(`/admin/orders/${newOrderId}`)
  }, 800)
}

const applyDiscount = () => {
  discountAmount.value = tempDiscountAmount.value
  showDiscountModal.value = false
  notification.info(`Descuento de $${discountAmount.value.toLocaleString('es-CL')} aplicado.`)
}

const goToShipping = () => {
  notification.info('Redirigiendo al módulo de Tarifas y Transportistas...')
  setTimeout(() => {
    router.push('/admin/shipping')
  }, 800)
}

const goBack = () => {
  router.push('/admin/orders')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Crear pedido</h1>
      </div>
      <div class="flex space-x-3">
        <button @click="goBack" class="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium text-sm transition shadow-sm">
          Descartar
        </button>
        <button @click="saveOrder" :disabled="isSaving || selectedProducts.length === 0" class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
          <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Guardar pedido
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 mt-4 flex flex-col lg:flex-row gap-6">
      <!-- Left Column -->
      <div class="flex-1 space-y-6">
        
        <!-- Products Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-5 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900 mb-4">Productos</h2>
            
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                v-model="searchProductTerm" 
                @focus="showProductSearch = true"
                type="text" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow" 
                placeholder="Buscar productos"
              >
              
              <!-- Search Results Dropdown -->
              <div v-if="showProductSearch && searchProductTerm" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <ul class="py-1">
                  <li v-for="product in filteredProducts" :key="product.id" @click="addProduct(product)" class="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-gray-100 rounded mr-3 flex items-center justify-center">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                        <p class="text-xs text-gray-500">{{ product.sku }} &bull; {{ product.stock }} disponibles</p>
                      </div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">${{ product.price.toLocaleString('es-CL') }}</span>
                  </li>
                  <li v-if="filteredProducts.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                    No se encontraron productos.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Selected Products List -->
          <div v-if="selectedProducts.length > 0" class="divide-y divide-gray-200">
            <div v-for="(item, index) in selectedProducts" :key="item.id" class="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-4 flex-1">
                <div class="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{{ item.name }}</h4>
                  <p class="text-xs text-gray-500">{{ item.sku }}</p>
                  <div class="text-xs text-gray-500 mt-1">${{ item.price.toLocaleString('es-CL') }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-6">
                <div class="flex items-center border border-gray-300 rounded-md bg-white">
                  <button @click="item.quantity > 1 ? item.quantity-- : removeProduct(index)" class="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-l-md border-r border-gray-300">&minus;</button>
                  <input type="number" v-model.number="item.quantity" class="w-12 text-center text-sm border-none focus:ring-0 p-1 bg-transparent" min="1">
                  <button @click="item.quantity++" class="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-r-md border-l border-gray-300">&plus;</button>
                </div>
                <div class="text-sm font-medium text-gray-900 w-24 text-right">
                  ${{ (item.price * item.quantity).toLocaleString('es-CL') }}
                </div>
                <button @click="removeProduct(index)" class="text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="p-12 text-center border-t border-gray-100">
            <svg class="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <p class="text-sm text-gray-500">Busca y selecciona productos para agregarlos al pedido.</p>
          </div>
        </div>

        <!-- Payment & Summary Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Pago</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Subtotal Neto</span>
              <span>{{ selectedProducts.length > 0 ? `$${subtotalNeto.toLocaleString('es-CL')}` : '—' }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600 group">
              <span @click="showDiscountModal = true" class="text-blue-600 hover:underline cursor-pointer border-b border-dashed border-blue-600">
                {{ discountAmount > 0 ? 'Editar descuento' : 'Agregar descuento' }}
              </span>
              <div class="flex items-center">
                <span v-if="discountAmount > 0" class="text-red-600 font-medium">-${{ discountAmount.toLocaleString('es-CL') }}</span>
                <span v-else>—</span>
                <button v-if="discountAmount > 0" @click.stop="discountAmount = 0" class="ml-2 text-gray-400 hover:text-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600">
              <span @click="goToShipping" class="text-blue-600 hover:underline cursor-pointer border-b border-dashed border-blue-600">Agregar envío</span>
              <span v-if="shippingAmount > 0" class="text-gray-900 font-medium">${{ shippingAmount.toLocaleString('es-CL') }}</span>
              <span v-else>—</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600">
              <span>IVA (19%)</span>
              <span>{{ selectedProducts.length > 0 ? `$${ivaAmount.toLocaleString('es-CL')}` : '—' }}</span>
            </div>
            <div class="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
              <span class="font-semibold text-gray-900">Total</span>
              <span class="font-bold text-gray-900 text-lg">{{ selectedProducts.length > 0 ? formattedTotal : '$0' }}</span>
            </div>
          </div>

          <div class="mt-6 pt-5 border-t border-gray-200">
            <label class="block text-sm font-medium text-gray-700 mb-3">Estado del pago inicial</label>
            <div class="flex space-x-6 mb-4">
              <label class="inline-flex items-center cursor-pointer">
                <input type="radio" v-model="paymentStatus" value="Pagado" class="text-blue-600 border-gray-300 focus:ring-blue-500 w-4 h-4">
                <span class="ml-2 text-sm text-gray-700">Pagado (Cobrado)</span>
              </label>
              <label class="inline-flex items-center cursor-pointer">
                <input type="radio" v-model="paymentStatus" value="Pendiente" class="text-blue-600 border-gray-300 focus:ring-blue-500 w-4 h-4">
                <span class="ml-2 text-sm text-gray-700">Pendiente (Por cobrar)</span>
              </label>
            </div>
            
            <div v-if="paymentStatus === 'Pagado'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Forma de pago</label>
              <select v-model="paymentMethod" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Transferencia bancaria</option>
                <option>Tarjeta de crédito / Débito</option>
                <option>Efectivo</option>
                <option>MercadoPago / Webpay</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="w-full lg:w-80 flex-shrink-0 space-y-6">
        
        <!-- Customer Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-gray-900">Cliente</h2>
            <button v-if="selectedCustomer" @click="removeCustomer" class="text-gray-400 hover:text-red-600 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div v-if="!selectedCustomer" class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              v-model="searchCustomerTerm"
              @focus="showCustomerSearch = true"
              type="text" 
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow" 
              placeholder="Buscar o crear cliente"
            >
            
            <!-- Customer Search Dropdown -->
            <div v-if="showCustomerSearch" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <ul class="py-1">
                <!-- Create Customer Action -->
                <li @click="goToCreateCustomer" class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center text-blue-600">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                  <span class="text-sm font-medium">Crear nuevo cliente</span>
                </li>
                
                <li v-for="customer in filteredCustomers" :key="customer.id" @click="selectCustomer(customer)" class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ customer.name }}</p>
                    <p class="text-xs text-gray-500">{{ customer.email }}</p>
                  </div>
                </li>
                <li v-if="filteredCustomers.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                  No se encontraron clientes.
                </li>
              </ul>
            </div>
          </div>
          
          <div v-if="selectedCustomer" class="mt-2">
            <h4 class="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{{ selectedCustomer.name }}</h4>
            <div class="mt-3 space-y-2 text-sm text-gray-600">
              <p class="flex items-center"><svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> {{ selectedCustomer.email }}</p>
              <p class="flex items-center"><svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> {{ selectedCustomer.phone }}</p>
              <p class="flex items-start mt-2 border-t border-gray-100 pt-2"><svg class="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg> {{ selectedCustomer.address }}</p>
            </div>
          </div>
          
          <!-- Mock client states -->
          <div v-if="!selectedCustomer" class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-sm text-gray-500">No se ha seleccionado ningún cliente.</p>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-3">Notas</h2>
          <textarea 
            v-model="notes"
            rows="3" 
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none" 
            placeholder="Añadir nota al pedido..."
          ></textarea>
        </div>

        <!-- Tags Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-3">Etiquetas</h2>
          <input 
            v-model="tags"
            type="text" 
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            placeholder="Encontrar o crear etiquetas"
          >
          <p class="text-xs text-gray-500 mt-2">Separa las etiquetas con comas.</p>
        </div>
      </div>
    </div>
    
    <!-- Discount Modal -->
    <Teleport to="body">
      <div v-if="showDiscountModal" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 class="text-lg font-medium text-gray-900">Aplicar descuento</h3>
            <button @click="showDiscountModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="p-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Monto del descuento ($ CLP)</label>
            <div class="relative mt-1 rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input type="number" v-model.number="tempDiscountAmount" class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="0">
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button @click="showDiscountModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button @click="applyDiscount" class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">Aplicar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
