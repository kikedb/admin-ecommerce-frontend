<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <!-- Main content area con sidebar -->
    <div class="flex w-full">
      <!-- Sidebar fixed a la izquierda -->
      <Sidebar />

      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto" style="margin: 1vw;">
        <slot />
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
