<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(true)
const expandedMenus = ref({
  orders: false,
  products: false,
  settings: false
})

const toggleMenu = (menu) => {
  expandedMenus.value[menu] = !expandedMenus.value[menu]
}

const isActive = (routeName) => {
  return route.name === routeName
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const menuItems = [
  {
    id: 'overview',
    label: 'Inicio',
    icon: 'M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z',
    route: 'AdminDashboard'
  },
  {
    id: 'products',
    label: 'Productos',
    icon: 'M9 19V6l-5 5m0 0h14m-14 0l5-5',
    hasSubmenu: true,
    submenu: [
      { label: 'Lista de Productos', route: 'ProductsList' },
      { label: 'Categorías', route: 'Categories' },
      { label: 'Marcas', route: 'Brands' },
      { label: 'Colores', route: 'Colors' }
    ]
  },
  {
    id: 'orders',
    label: 'Órdenes',
    icon: 'M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z',
    hasSubmenu: true,
    submenu: [
      { label: 'Lista de Órdenes', route: 'OrdersList' },
      { label: 'Órdenes Completadas', route: 'CompletedOrders' },
      { label: 'Órdenes Pendientes', route: 'PendingOrders' }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventario',
    icon: 'M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8-4m0 0l-8-4m8 4v10l-8 4',
    route: 'Inventory'
  },
  {
    id: 'customers',
    label: 'Clientes',
    icon: 'M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646zM3 20.228A6 6 0 0112 4c3.331 0 6.182 1.897 7.703 4.642',
    route: 'Customers'
  }
]
</script>

<template>
  <aside id="sidebar" class="fixed top-20 left-0 z-40 w-64 h-screen pt-4 transition-transform -translate-x-full bg-white border-r border-gray-200 lg:translate-x-0 dark:bg-gray-800 dark:border-gray-700 lg:block lg:relative lg:top-0">
    <div class="overflow-y-auto px-3 pb-4 h-full bg-white dark:bg-gray-800">
      <!-- User Profile Section -->
      <div class="mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
        <button class="flex justify-between items-center p-2 w-full rounded-lg dark:hover:bg-gray-700 hover:bg-gray-50 focus:outline-none">
          <div class="flex items-center">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png" class="mr-3 w-8 h-8 rounded-full" alt="User avatar" />
            <div class="text-left">
              <div class="font-semibold text-sm text-gray-900 dark:text-white">{{ authStore.user?.name || 'Usuario' }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</div>
            </div>
          </div>
        </button>
      </div>

      <!-- Quick Actions -->
      <div class="mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-3 gap-2">
          <a href="#" class="rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 p-2.5 flex flex-col items-center justify-center group">
            <span class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-1 group-hover:bg-blue-200 dark:group-hover:bg-blue-700">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
            </span>
            <span class="text-xs text-blue-600 dark:text-blue-300 font-medium text-center">Perfil</span>
          </a>
          <a href="#" class="rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900 dark:hover:bg-purple-800 p-2.5 flex flex-col items-center justify-center group">
            <span class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mb-1 group-hover:bg-purple-200 dark:group-hover:bg-purple-700">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                <path clip-rule="evenodd" fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"></path>
              </svg>
            </span>
            <span class="text-xs text-purple-600 dark:text-purple-300 font-medium text-center">Pagos</span>
          </a>
          <a href="#" class="rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-900 dark:hover:bg-teal-800 p-2.5 flex flex-col items-center justify-center group">
            <span class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mb-1 group-hover:bg-teal-200 dark:group-hover:bg-teal-700">
              <svg class="w-5 h-5 text-teal-600 dark:text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </span>
            <span class="text-xs text-teal-600 dark:text-teal-300 font-medium text-center">Soporte</span>
          </a>
        </div>
      </div>

      <!-- Main Menu -->
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.id">
          <template v-if="!item.hasSubmenu">
            <RouterLink
              :to="{ name: item.route }"
              class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition"
              :class="{ 'bg-blue-100 dark:bg-blue-900': isActive(item.route) }"
            >
              <svg class="w-6 h-6 text-gray-400 transition group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path :d="item.icon"></path>
              </svg>
              <span class="ml-3">{{ item.label }}</span>
            </RouterLink>
          </template>
          <template v-else>
            <button
              @click="toggleMenu(item.id)"
              class="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg class="w-6 h-6 text-gray-400 transition group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path :d="item.icon"></path>
              </svg>
              <span class="flex-1 ml-3 text-left">{{ item.label }}</span>
              <svg aria-hidden="true" class="w-6 h-6 transition" :class="{ 'rotate-180': expandedMenus[item.id] }" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
            <ul v-show="expandedMenus[item.id]" class="py-2 space-y-1">
              <li v-for="subitem in item.submenu" :key="subitem.route">
                <RouterLink
                  :to="{ name: subitem.route }"
                  class="flex items-center p-2 pl-11 text-base font-medium text-gray-900 rounded-lg transition dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  :class="{ 'bg-blue-50 dark:bg-blue-900': isActive(subitem.route) }"
                >
                  {{ subitem.label }}
                </RouterLink>
              </li>
            </ul>
          </template>
        </li>
      </ul>

      <!-- Settings Section -->
      <ul class="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <li>
          <a href="#" class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-6 h-6 text-gray-400 transition group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"></path>
            </svg>
            <span class="ml-3">Configuración</span>
          </a>
        </li>
        <li>
          <button
            @click="handleLogout"
            class="flex items-center p-2 w-full text-base font-medium text-red-600 rounded-lg dark:text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 group transition"
          >
            <svg class="w-6 h-6 text-red-600 transition dark:text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"></path>
            </svg>
            <span class="ml-3">Cerrar Sesión</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>
