<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'
import MainLayout from '@/layouts/MainLayout.vue'
import NotificationToast from '@/components/Toast/NotificationToast.vue'

const router = useRouter()
const authStore = useAuthStore()
const { notifications, removeNotification } = useNotification()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoginPage = computed(() => router.currentRoute.value.name === 'Login')
const requiresLayout = computed(() => {
  return isAuthenticated.value && !isLoginPage.value
})
</script>

<template>
  <div id="app">
    <!-- Notification Toast System -->
    <NotificationToast 
      :notifications="notifications" 
      @remove="removeNotification"
    />
    
    <!-- Main Content -->
    <MainLayout v-if="requiresLayout">
      <RouterView />
    </MainLayout>
    <RouterView v-else />
  </div>
</template>

<style scoped>
</style>
