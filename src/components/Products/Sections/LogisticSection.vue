<template>
  <div class="space-y-0">
    <!-- Encabezado informativo -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900 dark:text-white">Información Logística</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Completa detalles de envío y logística (todos los campos son opcionales)</p>
        </div>
      </div>
    </div>

    <!-- Dimensiones -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-cyan-600 rounded"></span>Dimensiones</h4>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Alto</label>
          <input
            :value="formatNumber(store.height)"
            @input="handleNumberInput($event, (val) => store.height = val)"
            type="text"
            inputmode="numeric"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ancho</label>
          <input
            :value="formatNumber(store.width)"
            @input="handleNumberInput($event, (val) => store.width = val)"
            type="text"
            inputmode="numeric"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Largo</label>
          <input
            :value="formatNumber(store.large)"
            @input="handleNumberInput($event, (val) => store.large = val)"
            type="text"
            inputmode="numeric"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Profundidad</label>
        <input
          :value="formatNumber(store.depth)"
          @input="handleNumberInput($event, (val) => store.depth = val)"
          type="text"
          inputmode="numeric"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
        />
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Unidad de Medida</label>
        <select
          v-model="store.measureUnit"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar unidad</option>
          <option value="cm">Centímetros (cm)</option>
          <option value="m">Metros (m)</option>
          <option value="mm">Milímetros (mm)</option>
          <option value="inch">Pulgadas (in)</option>
        </select>
      </div>
    </div>

    <!-- Peso -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-teal-600 rounded"></span>Peso</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Peso</label>
          <input
            :value="formatNumber(store.weight)"
            @input="handleNumberInput($event, (val) => store.weight = val)"
            type="text"
            inputmode="numeric"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Unidad de Peso</label>
          <select
            v-model="store.weightUnit"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar unidad</option>
            <option value="kg">Kilogramos (kg)</option>
            <option value="g">Gramos (g)</option>
            <option value="lb">Libras (lb)</option>
            <option value="oz">Onzas (oz)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Información de Envío -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-blue-600 rounded"></span>Información de Envío</h4>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Clase Logística</label>
        <select
          v-model="store.logisticClass"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar clase</option>
          <option value="standard">Estándar</option>
          <option value="fragile">Frágil</option>
          <option value="hazardous">Peligroso</option>
          <option value="perishable">Perecedero</option>
          <option value="oversized">Sobredimensionado</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Costo de Envío</label>
          <input
            :value="formatNumber(store.shippingCost)"
            @input="handleNumberInput($event, (val) => store.shippingCost = val)"
            type="text"
            inputmode="numeric"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Método de Envío</label>
          <select
            v-model="store.shippingWay"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar método</option>
            <option value="ground">Terrestre</option>
            <option value="air">Aéreo</option>
            <option value="maritime">Marítimo</option>
            <option value="express">Expreso</option>
          </select>
        </div>
      </div>

      <div class="flex items-center">
        <input
          v-model="store.retreatInPerson"
          type="checkbox"
          id="retreat"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="retreat" class="ml-2 text-sm font-medium text-gray-700">
          Disponible para retiro en persona
        </label>
      </div>
    </div>

    <!-- Garantía -->
    <div>
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-amber-600 rounded"></span>Garantía</h4>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Garantía</label>
        <select
          v-model="store.warrantyType"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Sin garantía</option>
          <option value="manufacturer">Garantía del Fabricante</option>
          <option value="seller">Garantía del Vendedor</option>
          <option value="extended">Garantía Extendida</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo de Garantía</label>
          <input
            :value="formatNumber(store.warrantyTime)"
            @input="handleNumberInput($event, (val) => store.warrantyTime = val)"
            type="text"
            inputmode="numeric"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Unidad de Tiempo</label>
          <select
            v-model="store.warrantyTimeUnit"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar unidad</option>
            <option value="days">Días</option>
            <option value="months">Meses</option>
            <option value="years">Años</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/product'
import { useNumberFormat } from '@/composables/useNumberFormat'

const store = useProductStore()
const { formatNumber, handleNumberInput } = useNumberFormat()
</script>
