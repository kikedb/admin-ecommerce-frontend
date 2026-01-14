<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main content area con sidebar -->
    <div class="flex w-full min-h-screen">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main content area -->
      <main class="flex-1 p-6 lg:ml-64 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 1023px) {
  main {
    margin-left: 0;
  }
}
</style>

