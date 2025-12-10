<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const notificationDropdownOpen = ref(false)
const searchQuery = ref('')

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const notifications = [
  {
    id: 1,
    name: 'Bonnie Green',
    message: 'Nuevo pedido recibido',
    avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png',
    time: 'Hace unos momentos'
  },
  {
    id: 2,
    name: 'Jese Leos',
    message: 'Stock bajo en productos',
    avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png',
    time: 'Hace 10 minutos'
  },
  {
    id: 3,
    name: 'Joseph McFall',
    message: 'Nuevo cliente registrado',
    avatar: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png',
    time: 'Hace 44 minutos'
  }
]
</script>

<template>
  <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <!-- Logo and Brand -->
      <div class="flex items-center justify-center">
        <a href="#" class="flex mr-6">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path>
              </svg>
            </div>
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white ml-2">Admin Eco</span>
          </div>
        </a>
      </div>

      <!-- Right Section -->
      <div class="flex items-center justify-center gap-4">
        <!-- Notifications -->
        <div class="relative">
          <button
            @click="notificationDropdownOpen = !notificationDropdownOpen"
            class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
          </button>

          <!-- Notification Dropdown -->
          <div
            v-if="notificationDropdownOpen"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg dark:bg-gray-700 z-50"
          >
            <div class="py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-300 rounded-t-lg">
              Notificaciones
            </div>
            <div class="max-h-96 overflow-y-auto">
              <a
                v-for="notif in notifications"
                :key="notif.id"
                href="#"
                class="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 last:border-b-0"
              >
                <img :src="notif.avatar" class="w-10 h-10 rounded-full" :alt="`${notif.name} avatar`" />
                <div class="pl-3 w-full">
                  <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                    <span class="font-semibold text-gray-900 dark:text-white">{{ notif.name }}</span>: {{ notif.message }}
                  </div>
                  <div class="text-xs font-medium text-blue-600 dark:text-blue-500">
                    {{ notif.time }}
                  </div>
                </div>
              </a>
            </div>
            <a href="#" class="block py-2 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:underline rounded-b-lg">
              Ver todas
            </a>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative group">
          <button class="flex items-center text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 py-2.5 dark:focus:ring-gray-800">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png" class="w-8 h-8 rounded-full" alt="User avatar" />
            <svg class="hidden md:inline ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>

          <!-- User Dropdown -->
          <div class="hidden absolute right-0 z-50 my-4 w-48 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 group-hover:block">
            <div class="py-3 px-4">
              <span class="block text-sm font-semibold text-gray-900 dark:text-white">{{ authStore.user?.name }}</span>
              <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ authStore.user?.email }}</span>
            </div>
            <ul class="py-1" role="none">
              <li>
                <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Mi perfil</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Configuración</a>
              </li>
            </ul>
            <div class="py-1" role="none">
              <button
                @click="handleLogout"
                class="w-full text-left block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <button
          type="button"
          data-drawer-target="sidebar"
          data-drawer-toggle="sidebar"
          class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>
