<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <!-- Mobile overlay -->
    <div 
      v-if="layoutStore.isSidebarOpen" 
      @click="layoutStore.closeSidebar"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    ></div>

    <div class="flex w-full min-h-screen pt-[60px]"> <!-- pt to account for Navbar height -->
      <Sidebar />

      <main class="flex-1 p-6 lg:ml-64 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1023px) {
  main {
    margin-left: 0;
  }
}
</style>
