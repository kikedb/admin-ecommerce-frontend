<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h2>
        <p class="text-sm text-gray-500 mt-1">Gestiona tu información personal y opciones de seguridad.</p>
      </div>
      <button @click="saveProfile" class="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-medium transition">
        Guardar cambios
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="col-span-1 space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Foto de perfil</h3>
          <div class="flex flex-col items-center">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png" class="w-32 h-32 rounded-full mb-4 object-cover border-4 border-gray-100" alt="Avatar">
            <button class="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded text-sm font-medium shadow-sm transition">Cambiar imagen</button>
          </div>
        </div>
      </div>

      <div class="col-span-1 lg:col-span-2 space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input type="text" v-model="form.name" class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input type="email" v-model="form.email" class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="text" v-model="form.phone" class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Idioma preferido</label>
              <select v-model="form.language" class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white">
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Seguridad y Contraseña</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input type="password" v-model="form.currentPassword" class="block w-full md:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input type="password" v-model="form.newPassword" class="block w-full md:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input type="password" v-model="form.confirmPassword" class="block w-full md:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="notification" class="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 z-50 animate-fade-in-up">
      <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span class="text-sm font-medium">{{ notification }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: 'Admin',
  email: 'admin@admin.com',
  phone: '+56 9 1234 5678',
  language: 'es',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notification = ref(null)

const showNotification = (msg) => {
  notification.value = msg
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const saveProfile = () => {
  if (form.value.newPassword && form.value.newPassword !== form.value.confirmPassword) {
    showNotification('Las contraseñas no coinciden.')
    return
  }
  showNotification('Perfil actualizado exitosamente.')
  form.value.currentPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
