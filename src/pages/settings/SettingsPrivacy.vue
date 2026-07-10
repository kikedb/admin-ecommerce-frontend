<script setup>
import { ref } from 'vue'

const cookieBannerEnabled = ref(true)
const dataSalesOptOutEnabled = ref(false)
const doubleOptInEnabled = ref(false)

</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12 relative">
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Privacidad del cliente</h1>
    </div>

    <div class="text-sm text-gray-600 dark:text-gray-400 mb-6">
      <p>Configura cómo tu tienda recopila y administra los datos de los clientes. Asegúrate de cumplir con las regulaciones de privacidad y protección de datos aplicables en tu jurisdicción (como el RGPD y la CCPA).</p>
    </div>

    <!-- Banner de cookies -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Banner de cookies de privacidad</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Muestra un banner a los visitantes de la tienda para recopilar el consentimiento del uso de cookies.</p>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <label class="flex items-center justify-between cursor-pointer">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Habilitar el banner de cookies</span>
          <div class="relative">
            <input type="checkbox" v-model="cookieBannerEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </div>
        </label>
        
        <div v-if="cookieBannerEnabled" class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Regiones de consentimiento</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Selecciona las regiones donde los visitantes deben ver el banner antes de recopilar datos (ej. Europa, California).</p>
          <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">Administrar regiones</button>
        </div>
      </div>
    </section>

    <!-- Exclusión de venta de datos -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Página de exclusión voluntaria de venta de datos</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Permite a los clientes elegir no vender ni compartir su información personal (requerido para CCPA).</p>
      </div>
      <div class="p-6">
        <label class="flex items-center justify-between cursor-pointer">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Habilitar página de exclusión</span>
          <div class="relative">
            <input type="checkbox" v-model="dataSalesOptOutEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>
    </section>

    <!-- Configuración de marketing -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Configuración de marketing</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Configura la confirmación para suscripciones (Doble opt-in).</p>
      </div>
      <div class="p-6">
        <label class="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" v-model="doubleOptInEnabled" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Requerir confirmación por correo electrónico para las suscripciones</span>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Los clientes deberán confirmar su suscripción mediante un enlace en un correo electrónico. Esto ayuda a cumplir con normativas anti-spam estrictas.</p>
          </div>
        </label>
      </div>
    </section>

    <!-- Solicitudes de privacidad del cliente -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Solicitudes de privacidad de los clientes</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona el derecho de acceso o eliminación de datos de tus clientes.</p>
      </div>
      <div class="p-6 space-y-4">
        <button class="w-full flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 transition text-left text-sm">
          <div>
            <span class="font-medium text-gray-900 dark:text-white block">Solicitar datos de cliente</span>
            <span class="text-gray-500 block mt-1">Genera un informe con los datos personales que tienes sobre un cliente específico.</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
        <button class="w-full flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 transition text-left text-sm">
          <div>
            <span class="font-medium text-red-600 dark:text-red-400 block">Eliminar datos de cliente</span>
            <span class="text-gray-500 block mt-1">Procesa la solicitud para eliminar de forma permanente la información personal de un cliente.</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </section>

    <div class="flex justify-end gap-3 mt-6">
      <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Guardar configuración</button>
    </div>
  </div>
</template>
