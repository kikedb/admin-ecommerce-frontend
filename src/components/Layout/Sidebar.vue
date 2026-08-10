<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { LayoutDashboard, Users, ShoppingCart, Settings, Package } from 'lucide-vue-next';

const route = useRoute();

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Catálogo', href: '/admin/products', icon: Package },
  { name: 'Órdenes', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Configuración', href: '/admin/settings', icon: Settings },
];

const isActive = (path) => route.path === path || route.path.startsWith(path + '/');
</script>

<template>
  <aside class="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium mt-4">
        <li v-for="item in navigation" :key="item.name">
          <router-link
            :to="item.href"
            :class="[
              isActive(item.href) 
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
              'flex items-center p-2 rounded-lg group transition-colors'
            ]"
          >
            <component 
              :is="item.icon" 
              :class="[
                isActive(item.href) ? 'text-gray-900 dark:text-white' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white',
                'w-5 h-5 transition-colors'
              ]" 
            />
            <span class="ml-3">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
