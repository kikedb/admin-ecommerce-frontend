<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-md w-full">
      <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Módulo de Envíos y Tarifas</h1>
      <p class="text-gray-500 mb-6">Esta sección está en construcción. Aquí integraremos las APIs de transportistas para tarifar envíos dinámicamente.</p>
      <button @click="router.back()" class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium">
        Volver atrás
      </button>
    </div>
  </div>
</template>
