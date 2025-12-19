<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <!-- Selector de Tipo -->
    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <label class="block text-sm font-medium mb-2">Tipo de Cliente *</label>
      <div class="flex gap-4">
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="store.customerType" value="individual" class="mr-2" />
          <span>👤 Individual (B2C)</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="store.customerType" value="business" class="mr-2" />
          <span>🏢 Empresa (B2B)</span>
        </label>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 border-b-2 font-medium text-sm transition',
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab: Información Básica -->
    <div v-show="activeTab === 'basic'" class="space-y-4">
      <!-- B2C: Persona Natural -->
      <div v-if="store.isB2C" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Nombre *</label>
          <input v-model="store.firstName" type="text" class="form-input" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Apellido *</label>
          <input v-model="store.lastName" type="text" class="form-input" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">RUT/Documento *</label>
          <input v-model="store.documentNumber" type="text" class="form-input" placeholder="12345678-9" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Fecha de Nacimiento</label>
          <input v-model="store.dateOfBirth" type="date" class="form-input" />
        </div>
      </div>

      <!-- B2B: Empresa -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Razón Social *</label>
          <input v-model="store.businessName" type="text" class="form-input" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Nombre Comercial</label>
          <input v-model="store.tradeName" type="text" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">RUT Empresa</label>
          <input v-model="store.taxId" type="text" class="form-input" placeholder="76123456-7" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Giro</label>
          <input v-model="store.businessActivity" type="text" class="form-input" />
        </div>
      </div>

      <!-- Contacto (ambos) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-2">Email *</label>
          <input v-model="store.email" type="email" class="form-input" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Teléfono</label>
          <input v-model="store.phone" type="tel" class="form-input" placeholder="+56 9 1234 5678" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Móvil</label>
          <input v-model="store.mobile" type="tel" class="form-input" placeholder="+56 9 8765 4321" />
        </div>
      </div>

      <!-- Estado y Segmento -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label class="block text-sm font-medium mb-2">Estado</label>
          <select v-model="store.status" class="form-input">
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="suspended">Suspendido</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Segmento</label>
          <select v-model="store.segment" class="form-input">
            <option value="new">Nuevo</option>
            <option value="regular">Regular</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tab: Dirección -->
    <div v-show="activeTab === 'address'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Dirección Línea 1</label>
        <input v-model="store.addressLine1" type="text" class="form-input" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Dirección Línea 2</label>
        <input v-model="store.addressLine2" type="text" class="form-input" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Ciudad</label>
          <input v-model="store.city" type="text" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Región</label>
          <select v-model="store.region" class="form-input">
            <option value="">Seleccionar</option>
            <option value="Región Metropolitana">Región Metropolitana</option>
            <option value="Región de Valparaíso">Región de Valparaíso</option>
            <option value="Región del Bío-Bío">Región del Bío-Bío</option>
            <option value="Región de Coquimbo">Región de Coquimbo</option>
            <option value="Región de La Araucanía">Región de La Araucanía</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Código Postal</label>
          <input v-model="store.postalCode" type="text" class="form-input" />
        </div>
      </div>
    </div>

    <!-- Tab: Información Comercial -->
    <div v-show="activeTab === 'commercial'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Cliente Desde</label>
          <input v-model="store.customerSince" type="date" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Método de Pago Preferido</label>
          <input v-model="store.preferredPaymentMethod" type="text" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Límite de Crédito ($)</label>
          <input v-model.number="store.creditLimit" type="number" class="form-input" min="0" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Descuento (%)</label>
          <input v-model.number="store.discountPercentage" type="number" class="form-input" min="0" max="100" />
        </div>
      </div>

      <div class="flex gap-6 pt-4 border-t">
        <label class="flex items-center cursor-pointer">
          <input v-model="store.isWholesale" type="checkbox" class="mr-2" />
          <span>Cliente Mayorista</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input v-model="store.taxExempt" type="checkbox" class="mr-2" />
          <span>Exento de Impuestos</span>
        </label>
      </div>
    </div>

    <!-- Tab: Notas y Marketing -->
    <div v-show="activeTab === 'notes'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Notas Internas</label>
        <textarea v-model="store.notes" rows="4" class="form-input"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Canal de Adquisición</label>
        <input v-model="store.acquisitionChannel" type="text" class="form-input" placeholder="Web, Referido, Publicidad..." />
      </div>

      <div class="space-y-2 pt-4 border-t">
        <p class="text-sm font-medium">Email Marketing</p>
        <label class="flex items-center cursor-pointer">
          <input v-model="store.subscribeNewsletter" type="checkbox" class="mr-2" />
          <span class="text-sm">Suscrito a Newsletter</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input v-model="store.subscribePromotions" type="checkbox" class="mr-2" />
          <span class="text-sm">Recibir Promociones</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input v-model="store.subscribeNotifications" type="checkbox" class="mr-2" />
          <span class="text-sm">Notificaciones de Productos</span>
        </label>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-6 pt-6 border-t">
      <button 
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Cancelar
      </button>
      <button 
        type="button"
        @click="handleSubmit"
        :disabled="loading"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Guardando...' : (store.id ? 'Actualizar' : 'Crear') }} Cliente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCustomerStore } from '@/stores/customer'

const props = defineProps({
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const store = useCustomerStore()
const activeTab = ref('basic')

const tabs = [
  { id: 'basic', label: 'Información Básica' },
  { id: 'address', label: 'Dirección' },
  { id: 'commercial', label: 'Info Comercial' },
  { id: 'notes', label: 'Notas' }
]

function handleSubmit() {
  // Validación básica
  if (store.isB2C && (!store.firstName || !store.lastName)) {
    alert('Por favor complete nombre y apellido')
    return
  }
  if (store.isB2B && !store.businessName) {
    alert('Por favor complete la razón social')
    return
  }
  if (!store.email) {
    alert('El email es requerido')
    return
  }

  emit('submit', store.getFormData())
}
</script>

<style scoped>
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white;
}
</style>
