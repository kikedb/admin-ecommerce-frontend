<script setup>
import { Menu, Search } from 'lucide-vue-next';
import Dropdown from '@/components/ui/Dropdown.vue';
import { User } from 'lucide-vue-next';

defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-sidebar']);

const userActions = [
  { label: 'Mi Perfil', action: () => console.log('Profile') },
  { label: 'Ajustes', action: () => console.log('Settings') },
  { label: 'Cerrar Sesión', action: () => console.log('Logout'), danger: true },
];
</script>

<template>
  <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <button 
            @click="emit('toggle-sidebar')"
            type="button" 
            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span class="sr-only">Abrir sidebar</span>
            <Menu class="w-6 h-6" />
          </button>
          <router-link to="/" class="flex ml-2 md:mr-24 items-center">
            <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Admin Bílbola</span>
          </router-link>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Global Search (Optional) -->
          <div class="hidden md:block relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input type="text" class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Buscar...">
          </div>

          <!-- User Menu -->
          <div class="flex items-center ml-3">
            <Dropdown :items="userActions">
              <template #button>
                <div class="w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 flex items-center justify-center cursor-pointer ring-2 ring-transparent hover:ring-gray-300 transition-all">
                  <User class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
              </template>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
