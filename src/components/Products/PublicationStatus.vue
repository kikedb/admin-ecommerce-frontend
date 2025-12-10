<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="text-3xl">📋</div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Requisitos de Publicación</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Completa todos los campos requeridos para publicar</p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold text-blue-600">{{ publicationStatus.completionPercentage }}%</div>
        <p class="text-xs text-gray-600 dark:text-gray-400">Completado</p>
      </div>
    </div>

    <!-- Barra de progreso -->
    <div class="mb-6">
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          class="h-full transition-all duration-300"
          :class="{
            'bg-red-500': publicationStatus.completionPercentage < 25,
            'bg-yellow-500': publicationStatus.completionPercentage >= 25 && publicationStatus.completionPercentage < 75,
            'bg-green-500': publicationStatus.completionPercentage >= 75 && publicationStatus.completionPercentage < 100,
            'bg-blue-600': publicationStatus.completionPercentage === 100
          }"
          :style="{ width: publicationStatus.completionPercentage + '%' }"
        />
      </div>
    </div>

    <!-- Estados -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <!-- Completados -->
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">✅</span>
          <span class="font-semibold text-green-900 dark:text-green-200">Completados</span>
        </div>
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ publicationStatus.completed.length }}</div>
        <p class="text-xs text-green-700 dark:text-green-300 mt-1">campos completados</p>
      </div>

      <!-- Faltantes -->
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">❌</span>
          <span class="font-semibold text-red-900 dark:text-red-200">Faltantes</span>
        </div>
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ publicationStatus.missing.length }}</div>
        <p class="text-xs text-red-700 dark:text-red-300 mt-1">campos requeridos</p>
      </div>

      <!-- Recomendados -->
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">💡</span>
          <span class="font-semibold text-amber-900 dark:text-amber-200">Recomendados</span>
        </div>
        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ publicationStatus.recommended.length }}</div>
        <p class="text-xs text-amber-700 dark:text-amber-300 mt-1">campos sugeridos</p>
      </div>
    </div>

    <!-- Sección de Faltantes -->
    <div v-if="publicationStatus.missing.length > 0" class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">⚠️</span>
        <h4 class="font-semibold text-gray-900 dark:text-white">Campos Requeridos Faltantes</h4>
      </div>
      <div class="space-y-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4">
        <div v-for="field in publicationStatus.missing" :key="field.fieldName" class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <span class="text-red-600 dark:text-red-400 font-bold">•</span>
            <span class="text-gray-700 dark:text-gray-300">{{ field.label }}</span>
          </div>
          <button
            @click="$emit('focus-field', field.fieldName, field.tab)"
            class="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
          >
            Ir al campo
          </button>
        </div>
      </div>
    </div>

    <!-- Sección de Recomendados -->
    <div v-if="publicationStatus.recommended.length > 0" class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">💡</span>
        <h4 class="font-semibold text-gray-900 dark:text-white">Campos Recomendados</h4>
      </div>
      <div class="space-y-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4">
        <div v-for="field in publicationStatus.recommended" :key="field.fieldName" class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <span class="text-amber-600 dark:text-amber-400 font-bold">•</span>
            <span class="text-gray-700 dark:text-gray-300">{{ field.label }}</span>
            <span class="text-xs bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">Recomendado</span>
          </div>
          <button
            @click="$emit('focus-field', field.fieldName, field.tab)"
            class="text-sm px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded transition"
          >
            Ir al campo
          </button>
        </div>
      </div>
    </div>

    <!-- Botón de Publicación -->
    <div class="flex gap-4">
      <button
        v-if="publicationStatus.canPublish"
        @click="$emit('publish')"
        class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>🚀</span>
        <span>Publicar Producto</span>
      </button>
      <button
        v-else
        disabled
        class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>🔒</span>
        <span>Completa los campos requeridos</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { usePublicationRequirements } from '@/composables/usePublicationRequirements'

defineEmits(['publish', 'focus-field'])

const store = useProductStore()
const { getPublicationStatus } = usePublicationRequirements()

const publicationStatus = computed(() => getPublicationStatus(store))
</script>
