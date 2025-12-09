<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoginPage = computed(() => router.currentRoute.value.name === 'Login')
const requiresLayout = computed(() => {
  return isAuthenticated.value && !isLoginPage.value
})
</script>

<template>
  <div id="app">
    <MainLayout v-if="requiresLayout">
      <RouterView />
    </MainLayout>
    <RouterView v-else-if="isLoginPage || isAuthenticated" />
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-gray-500">Redirigiendo...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
