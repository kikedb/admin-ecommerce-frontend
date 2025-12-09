<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <!-- Navbar fixed en top -->
    <Navbar />

    <!-- Main content area con sidebar -->
    <div class="flex w-full pt-20">
      <!-- Sidebar fixed a la izquierda -->
      <Sidebar />

      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto">
        <div class="px-4 py-6 lg:px-8 max-w-7xl mx-auto w-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Asegurar que el sidebar no afecta el layout en desktop */
@media (min-width: 1024px) {
  main {
    margin-left: 0;
  }
}
</style>
