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
          <h3 class="text-base font-bold text-gray-900 dark:text-white">Características del Producto</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Describe características especiales (todos los campos son opcionales)</p>
        </div>
      </div>
    </div>

    <!-- Información Básica -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-blue-600 rounded"></span>Información Básica</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rango de Edad</label>
          <input
            v-model="store.ageRange"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 3-8 años"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Grupo de Edad</label>
          <input
            v-model="store.ageGroup"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Infantil"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Capacidad</label>
          <input
            v-model="store.capacity"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 500ml"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Número de Piezas</label>
          <input
            :value="formatNumber(store.numberOfPieces)"
            @input="handleNumberInput($event, (val) => store.numberOfPieces = val)"
            type="text"
            inputmode="numeric"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">País de Producción</label>
          <input
            v-model="store.productionCountry"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: China"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <input
            v-model="store.type"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Plástico"
          />
        </div>
      </div>
    </div>

    <!-- Características de Seguridad y Funcionales -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-green-600 rounded"></span>Características de Seguridad y Funcionales</h4>
      <div class="space-y-3">
        <div class="flex items-center">
          <input
            v-model="store.sounds"
            type="checkbox"
            id="sounds"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="sounds" class="ml-2 text-sm font-medium text-gray-700">Produce Sonidos</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.usesBatteries"
            type="checkbox"
            id="batteries"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="batteries" class="ml-2 text-sm font-medium text-gray-700">Usa Baterías</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.lights"
            type="checkbox"
            id="lights"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="lights" class="ml-2 text-sm font-medium text-gray-700">Tiene Luces</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.smallPieces"
            type="checkbox"
            id="smallPieces"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="smallPieces" class="ml-2 text-sm font-medium text-gray-700">Contiene Piezas Pequeñas</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.hipoalergenic"
            type="checkbox"
            id="hipoalergenic"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="hipoalergenic" class="ml-2 text-sm font-medium text-gray-700">Hipoalergénico</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.softMaterials"
            type="checkbox"
            id="softMaterials"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="softMaterials" class="ml-2 text-sm font-medium text-gray-700">Materiales Suaves</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.padded"
            type="checkbox"
            id="padded"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="padded" class="ml-2 text-sm font-medium text-gray-700">Acolchado</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.adjustableHeight"
            type="checkbox"
            id="adjustable"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="adjustable" class="ml-2 text-sm font-medium text-gray-700">Altura Ajustable</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.bpaFree"
            type="checkbox"
            id="bpaFree"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="bpaFree" class="ml-2 text-sm font-medium text-gray-700">Libre de BPA</label>
        </div>
      </div>
    </div>

    <!-- Características de Cocina/Comedor -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-purple-600 rounded"></span>Características de Cocina/Comedor</h4>
      <div class="space-y-3">
        <div class="flex items-center">
          <input
            v-model="store.microwaveSafe"
            type="checkbox"
            id="microwave"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="microwave" class="ml-2 text-sm font-medium text-gray-700">Seguro para Microondas</label>
        </div>
        <div class="flex items-center">
          <input
            v-model="store.dishwasherSafe"
            type="checkbox"
            id="dishwasher"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="dishwasher" class="ml-2 text-sm font-medium text-gray-700">Seguro para Lavavajillas</label>
        </div>
      </div>
    </div>

    <!-- Características de Diseño -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-orange-600 rounded"></span>Características de Diseño</h4>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Forma</label>
          <input
            v-model="store.shape"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Redonda"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Estilo de Decoración</label>
          <input
            v-model="store.decorationStyle"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Moderno"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Hogar</label>
          <input
            v-model="store.typeOfHousehold"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Cocina"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Decoración</label>
          <input
            v-model="store.decorationType"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Vintage"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Copa (si aplica)</label>
        <input
          v-model="store.wineGlassType"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Copas de vino tinto"
        />
      </div>
    </div>

    <!-- Información Adicional -->
    <div>
      <h4 class="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><span class="w-1 h-5 bg-indigo-600 rounded"></span>Información Adicional</h4>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Unidades</label>
          <input
            v-model="store.units"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Caja de 12"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Peso Máximo Soportado</label>
          <input
            v-model="store.maxWeightSupported"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 100kg"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Caracteres Especiales</label>
        <textarea
          v-model="store.characteres"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe cualquier característica especial"
        ></textarea>
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Características Generales</label>
        <textarea
          v-model="store.features"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe las características generales"
        ></textarea>
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
