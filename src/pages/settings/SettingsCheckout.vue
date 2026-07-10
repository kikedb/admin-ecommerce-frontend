<script setup>
import { ref } from 'vue'

const customerAccounts = ref('optional')
const requirePhone = ref(false)
const emailMarketing = ref(true)

</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12 relative">
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Página de pago (Checkout)</h1>
    </div>

    <!-- Personalizar / Previsualizar -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Estilo de la página de pago</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Personaliza el diseño, agrega tu logotipo y cambia los colores del carrito de compras.</p>
        </div>
        <button class="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg hover:bg-gray-800 transition shadow-sm">
          Personalizar apariencia
        </button>
      </div>
      <div class="bg-gray-100 dark:bg-gray-900 p-8 flex justify-center items-center">
        <!-- Mock visualizer -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full border border-gray-200 dark:border-gray-700 overflow-hidden transform scale-90">
          <div class="h-16 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <span class="text-sm font-bold text-gray-400">Tu Logotipo Aquí</span>
          </div>
          <div class="p-4 space-y-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div class="space-y-2">
              <div class="h-8 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"></div>
              <div class="h-8 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="h-10 bg-blue-600 rounded mt-4 flex items-center justify-center">
              <span class="text-xs text-white font-medium">Pagar ahora</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contacto del cliente -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Opciones de contacto</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Elige cómo se pueden contactar los clientes durante la pantalla de pago.</p>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Método de contacto</label>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="radio" name="contact_method" value="email" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">Solo correo electrónico</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="contact_method" value="phone_email" checked class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">Teléfono o correo electrónico</span>
            </label>
          </div>
        </div>
      </div>
    </section>

    <!-- Información del cliente -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Información del cliente</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Configura qué información deben ingresar durante la compra.</p>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Requerir nombre y apellido</span>
          <select class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block p-2">
            <option>Solo apellido</option>
            <option selected>Nombre y apellido</option>
          </select>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Nombre de la empresa</span>
          <select class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block p-2">
            <option>Oculto</option>
            <option selected>Opcional</option>
            <option>Obligatorio</option>
          </select>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Línea de dirección 2 (apartamento, unidad, etc.)</span>
          <select class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block p-2">
            <option>Oculto</option>
            <option selected>Opcional</option>
            <option>Obligatorio</option>
          </select>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Teléfono de la dirección de envío</span>
          <select class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block p-2">
            <option>Oculto</option>
            <option selected>Opcional</option>
            <option>Obligatorio</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Propinas (Tipping) -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Propinas</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Dales a tus clientes la opción de añadir una propina al finalizar la compra.</p>
      </div>
      <div class="p-6 space-y-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Mostrar opciones de propina al finalizar la compra</span>
        </label>
      </div>
    </section>

    <!-- Procesamiento de pedidos -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Procesamiento de pedidos</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Configura el comportamiento del proceso de pago.</p>
      </div>
      <div class="p-6 space-y-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Usar la dirección de envío como dirección de facturación por defecto</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Requerir un paso de confirmación</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Habilitar el autocompletado de direcciones</span>
        </label>
      </div>
    </section>

    <!-- Consentimiento de marketing -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Consentimiento de marketing</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Pide a los clientes que se suscriban a tus correos promocionales.</p>
      </div>
      <div class="p-6 space-y-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Mostrar una opción de suscripción al finalizar la compra</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer pl-6">
          <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Preseleccionar la opción de suscripción</span>
        </label>
      </div>
    </section>

    <!-- Carritos abandonados -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Correos de carritos abandonados</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Envía automáticamente un recordatorio a los clientes que no completaron su compra.</p>
      </div>
      <div class="p-6 space-y-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Enviar correos de recuperación de carritos de forma automática</span>
        </label>
        <div class="pl-6 space-y-4 mt-4">
          <div>
            <span class="text-sm font-medium text-gray-900 dark:text-white block mb-2">Enviar a</span>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="radio" name="abandoned_who" value="anyone" checked class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                <span class="text-sm text-gray-700 dark:text-gray-300">Cualquiera que abandone su carrito</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" name="abandoned_who" value="subscribers" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                <span class="text-sm text-gray-700 dark:text-gray-300">Solo a suscriptores de correo electrónico</span>
              </label>
            </div>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-900 dark:text-white block mb-2">Enviar después de</span>
            <select class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block p-2 max-w-xs w-full">
              <option>1 hora</option>
              <option>6 horas</option>
              <option selected>10 horas (Recomendado)</option>
              <option>24 horas</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <div class="flex justify-end gap-3 mt-6">
      <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Descartar</button>
      <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Guardar</button>
    </div>
  </div>
</template>
