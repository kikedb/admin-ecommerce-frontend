<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Bienvenido al dashboard de administración</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Productos Activos</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">-</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Conectar a API</p>
          </div>
          <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Órdenes Pendientes</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">-</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Conectar a API</p>
          </div>
          <div class="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Ventas Hoy</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">$0</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Conectar a API</p>
          </div>
          <div class="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V9.414l-4.293 4.293a1 1 0 11-1.414-1.414L13.586 8H12z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Stock Bajo</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">-</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Conectar a API</p>
          </div>
          <div class="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
            <svg class="w-6 h-6 text-red-600 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accesos Rápidos</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink
          to="/admin/products"
          class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition"
        >
          <div class="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Productos</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Gestionar inventario</p>
          </div>
        </RouterLink>

        <RouterLink
          to="/admin/orders"
          class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition"
        >
          <div class="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Órdenes</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Ver pedidos</p>
          </div>
        </RouterLink>

        <RouterLink
          to="/admin/customers"
          class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition"
        >
          <div class="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
            <svg class="w-5 h-5 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM16 11a2 2 0 11-4 0 2 2 0 014 0zM18 14v1h2v-1a3 3 0 00-3-3h-2v2h2a1 1 0 011 1z"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Clientes</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Gestionar clientes</p>
          </div>
        </RouterLink>

        <RouterLink
          to="/admin/inventory"
          class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition"
        >
          <div class="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
            <svg class="w-5 h-5 text-orange-600 dark:text-orange-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Inventario</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Stock y almacén</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
