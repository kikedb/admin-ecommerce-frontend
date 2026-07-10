<script setup>
import { ref } from 'vue'

const showAddEmployeeModal = ref(false)
const showTransferModal = ref(false)
const transferStep = ref(1)
const transferPassword = ref('')
const transferSuccess = ref(false)
const inviteSent = ref(false)

const storeOwner = ref({
  initials: 'MP',
  name: 'Macarena Pizarro',
  email: 'info@bilbola.cl',
  pendingTransfer: false
})

const employees = ref([])

const newEmployee = ref({
  firstName: '',
  lastName: '',
  email: '',
  selectAllPermissions: false,
  permissions: {
    home: false,
    orders: false,
    products: false,
    customers: false,
    analytics: false,
    marketing: false,
    discounts: false,
    settings: false
  }
})

const sendInvite = () => {
  inviteSent.value = true
  setTimeout(() => {
    employees.value.push({
      id: Date.now(),
      initials: (newEmployee.value.firstName.charAt(0) + newEmployee.value.lastName.charAt(0)).toUpperCase() || 'E',
      name: `${newEmployee.value.firstName} ${newEmployee.value.lastName}`,
      email: newEmployee.value.email,
      status: 'Pendiente'
    })
    inviteSent.value = false
    showAddEmployeeModal.value = false
    newEmployee.value = {
      firstName: '',
      lastName: '',
      email: '',
      selectAllPermissions: false,
      permissions: {
        home: false,
        orders: false,
        products: false,
        customers: false,
        analytics: false,
        marketing: false,
        discounts: false,
        settings: false
      }
    }
  }, 1500)
}

const performTransfer = () => {
  if (transferPassword.value) {
    transferSuccess.value = true
    setTimeout(() => {
      storeOwner.value.pendingTransfer = true
      showTransferModal.value = false
      transferStep.value = 1
      transferPassword.value = ''
      transferSuccess.value = false
    }, 2000)
  }
}

const acceptCollaborators = ref(true)
</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12 relative">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Usuarios y permisos</h1>
    </div>

    <!-- Propietario de la tienda -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Propietario de la tienda</h2>
        <span v-if="storeOwner.pendingTransfer" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          Transferencia pendiente
        </span>
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {{ storeOwner.initials }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ storeOwner.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ storeOwner.email }}</p>
            </div>
          </div>
          <button v-if="!storeOwner.pendingTransfer" @click="showTransferModal = true" class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition">
            Transferir propiedad
          </button>
          <button v-else @click="storeOwner.pendingTransfer = false" class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
            Cancelar transferencia
          </button>
        </div>
      </div>
    </section>

    <!-- Empleados -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Empleados</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Configura permisos para tu equipo.</p>
        </div>
        <button @click="showAddEmployeeModal = true" class="px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition">
          Agregar empleado
        </button>
      </div>
      
      <div v-if="employees.length === 0" class="p-6">
        <p class="text-sm text-gray-600 dark:text-gray-300">Aún no hay empleados registrados en esta tienda.</p>
      </div>
      
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="employee in employees" :key="employee.id" class="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
              {{ employee.initials }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ employee.name }}</p>
                <span v-if="employee.status === 'Pendiente'" class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  Invitación enviada
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ employee.email }}</p>
            </div>
          </div>
          <button class="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-md transition">
            Administrar
          </button>
        </div>
      </div>
    </section>

    <!-- Colaboradores -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Colaboradores</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Agencias, diseñadores o desarrolladores independientes que colaboran en tu tienda. No cuentan en tu límite de empleados.</p>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-3">
          <input type="checkbox" v-model="acceptCollaborators" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700">
          <span class="text-sm text-gray-900 dark:text-white">Aceptar solicitudes de acceso de colaboradores libremente.</span>
        </div>
        <p class="text-xs text-gray-500 mt-4">Los colaboradores enviarán una solicitud y debes aprobarla para que puedan acceder.</p>
      </div>
    </section>

    <!-- Modals -->
    <!-- Transfer Ownership Modal -->
    <div v-if="showTransferModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Transferir propiedad</h2>
          <button @click="showTransferModal = false; transferStep = 1" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6" v-if="!transferSuccess">
          <div v-if="transferStep === 1">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Transferir la propiedad de la tienda te revocará los privilegios exclusivos del propietario. ¿Estás seguro de que deseas continuar?</p>
            <div class="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-lg">
              <div class="flex gap-3">
                <svg class="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <p class="text-sm text-orange-800 dark:text-orange-400">Esta acción no se puede deshacer de forma remota una vez completada.</p>
              </div>
            </div>
          </div>
          <div v-else-if="transferStep === 2">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Para confirmar tu identidad, por favor ingresa tu contraseña.</p>
            <input type="password" v-model="transferPassword" placeholder="Contraseña" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="p-6 text-center" v-if="transferSuccess">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Proceso iniciado</h3>
          <p class="text-sm text-gray-500 mt-2">El destinatario recibirá un correo electrónico con instrucciones para aceptar la propiedad.</p>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3" v-if="!transferSuccess">
          <button @click="showTransferModal = false; transferStep = 1" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Cancelar
          </button>
          <button v-if="transferStep === 1" @click="transferStep = 2" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">
            Continuar
          </button>
          <button v-if="transferStep === 2" @click="performTransfer" :disabled="!transferPassword" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition disabled:opacity-50">
            Confirmar transferencia
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Agregar Empleado -->
    <div v-if="showAddEmployeeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between relative">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Agregar empleado</h2>
          <button @click="showAddEmployeeModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <!-- Success overlay inside modal -->
          <div v-if="inviteSent" class="absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10 flex items-center justify-center">
            <div class="flex items-center gap-3 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <span class="font-medium text-lg">Invitación enviada exitosamente</span>
            </div>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 space-y-8">
          
          <!-- Datos básicos -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input type="text" v-model="newEmployee.firstName" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
              <input type="text" v-model="newEmployee.lastName" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm sm:text-sm">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo electrónico</label>
              <input type="email" v-model="newEmployee.email" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm sm:text-sm">
            </div>
          </div>

          <!-- Permisos -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Permisos</h3>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div class="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" v-model="newEmployee.selectAllPermissions" @change="Object.keys(newEmployee.permissions).forEach(k => newEmployee.permissions[k] = newEmployee.selectAllPermissions)" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">Seleccionar todo</span>
                </label>
              </div>
              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" v-model="newEmployee.permissions.home" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Inicio</span>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" v-model="newEmployee.permissions.orders" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Pedidos</span>
                    <span class="text-xs text-gray-500">Crear, editar, eliminar</span>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" v-model="newEmployee.permissions.products" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Productos</span>
                    <span class="text-xs text-gray-500">Gestionar inventario y precios</span>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" v-model="newEmployee.permissions.customers" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Clientes</span>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" v-model="newEmployee.permissions.analytics" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Estadísticas e informes</span>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" v-model="newEmployee.permissions.marketing" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Marketing</span>
                  </div>
                </label>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" v-model="newEmployee.permissions.settings" class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white block">Configuración general</span>
                    <span class="text-xs text-gray-500">No incluye gestión de otros usuarios</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showAddEmployeeModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition">
            Cancelar
          </button>
          <button @click="sendInvite" :disabled="!newEmployee.email || !newEmployee.firstName" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition disabled:opacity-50">
            Enviar invitación
          </button>
        </div>
        
      </div>
    </div>
    
  </div>
</template>
