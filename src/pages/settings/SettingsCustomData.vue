<script setup>
import { ref } from 'vue'

const definitions = ref([
  { id: 'productos', label: 'Productos', count: 3, description: 'Agrega atributos a tus productos como instrucciones de cuidado o materiales.' },
  { id: 'variantes', label: 'Variantes', count: 0, description: 'Agrega atributos a variantes individuales como fecha de caducidad.' },
  { id: 'colecciones', label: 'Colecciones', count: 1, description: 'Agrega atributos a tus colecciones como banners destacados.' },
  { id: 'clientes', label: 'Clientes', count: 2, description: 'Agrega datos de perfil adicionales como fecha de cumpleaños o tipo de cliente.' },
  { id: 'pedidos', label: 'Pedidos', count: 0, description: 'Agrega instrucciones especiales o números de seguimiento externos.' },
  { id: 'empresas', label: 'Empresas', count: 0, description: 'Agrega atributos B2B a los perfiles de empresa.' },
  { id: 'sucursales', label: 'Sucursales', count: 0, description: 'Agrega atributos específicos a las ubicaciones físicas.' },
])

const metaobjects = ref([
  { id: 1, name: 'Perfil de Autor', entries: 12 },
  { id: 2, name: 'Tienda Física', entries: 4 }
])
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12 relative">
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
      </svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Datos personalizados</h1>
    </div>

    <div class="text-sm text-gray-600 dark:text-gray-400 mb-6">
      <p>Agrega campos personalizados y metaobjetos a tu tienda para guardar información adicional sobre tus productos, clientes, pedidos y otros recursos.</p>
    </div>

    <!-- Metacampos -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Metacampos</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Crea nuevas definiciones de campos para la información que Shopify no recopila de forma predeterminada.</p>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="def in definitions" :key="def.id" class="p-4 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div class="flex-1 pr-4">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ def.label }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{{ def.description }}</p>
          </div>
          <div class="flex items-center gap-4 flex-shrink-0">
            <span v-if="def.count > 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {{ def.count }} definiciones
            </span>
            <span v-else class="text-sm text-gray-400">0</span>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Metaobjetos -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Metaobjetos</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Crea y gestiona objetos de datos estructurados para tu escaparate.</p>
        </div>
        <button class="text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">
          Agregar definición
        </button>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="obj in metaobjects" :key="obj.id" class="p-4 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ obj.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ obj.entries }} entradas</p>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
      </div>
    </section>
  </div>
</template>
