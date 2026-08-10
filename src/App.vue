<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'
import { Toaster } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoginPage = computed(() => router.currentRoute.value.name === 'Login')
const isSettingsRoute = computed(() => router.currentRoute.value.path.startsWith('/admin/settings'))
const requiresLayout = computed(() => {
  return isAuthenticated.value && !isLoginPage.value && !isSettingsRoute.value
})
</script>

<template>
  <div id="app">
    <!-- Notification Toast System -->
    <Toaster richColors position="top-right" />
    
    <!-- Main Content -->
    <MainLayout v-if="requiresLayout">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </router-view>
    </MainLayout>
    <router-view v-else />
  </div>
</template>

<style scoped>
</style>
