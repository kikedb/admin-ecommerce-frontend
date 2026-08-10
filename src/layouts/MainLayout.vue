<script setup>
import { ref } from 'vue';
import Navbar from '@/components/Layout/Navbar.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <Navbar @toggle-sidebar="toggleSidebar" />
    
    <Sidebar :class="[sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'sm:translate-x-0']" />
    
    <!-- Backdrop for mobile sidebar -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 z-30 bg-gray-900/50 sm:hidden"
    ></div>

    <div class="p-4 sm:ml-64 pt-20">
      <main class="max-w-7xl mx-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
