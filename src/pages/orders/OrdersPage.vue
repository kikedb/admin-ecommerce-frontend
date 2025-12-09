<script setup>
import { ref } from 'vue'

const orders = ref([])
const isLoading = ref(false)
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Órdenes</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Gestión de órdenes de compra</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Lista de Órdenes</h2>
        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          + Nueva Orden
        </button>
      </div>
      <p v-if="orders.length === 0" class="text-gray-600 dark:text-gray-400">
        No hay órdenes disponibles.
      </p>
      <div v-else class="space-y-2">
        <div v-for="order in orders" :key="order.id" class="border-b pb-2">
          Orden #{{ order.id }}
        </div>
      </div>
    </div>
  </div>
</template>
