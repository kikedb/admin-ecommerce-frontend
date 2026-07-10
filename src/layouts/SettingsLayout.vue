<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const showMobileMenu = ref(false)

const menuGroups = [
  {
    items: [
      { id: 'general', label: 'General', route: 'SettingsGeneral', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'facturacion', label: 'Facturación', route: 'SettingsBilling', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
      { id: 'usuarios', label: 'Usuarios', route: 'SettingsUsers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
      { id: 'pagos', label: 'Pasarelas de pago', route: 'SettingsPayments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
      { id: 'pago', label: 'Página de pago (Checkout)', route: 'SettingsCheckout', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
      { id: 'cuentas', label: 'Cuentas de cliente', route: 'SettingsCustomerAccounts', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      { id: 'envio', label: 'Envío y entrega', route: 'SettingsShipping', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
      { id: 'impuestos', label: 'Impuestos y aranceles', route: 'SettingsTaxes', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { id: 'sucursales', label: 'Sucursales', route: 'SettingsLocations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
      { id: 'integraciones', label: 'Integraciones y APIs', route: 'SettingsIntegrations', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
      { id: 'canales', label: 'Canales de ventas', route: 'SettingsSalesChannels', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
      { id: 'dominios', label: 'Dominios', route: 'SettingsDomains', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
      { id: 'eventos', label: 'Eventos del cliente', route: 'SettingsCustomerEvents', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
      { id: 'notificaciones', label: 'Notificaciones', route: 'SettingsNotifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
      { id: 'metacampos', label: 'Datos personalizados', route: 'SettingsCustomData', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
      { id: 'idiomas', label: 'Idiomas', route: 'SettingsLanguages', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' },
      { id: 'privacidad', label: 'Privacidad del cliente', route: 'SettingsPrivacy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
      { id: 'politicas', label: 'Políticas', route: 'SettingsPlaceholder', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ]
  }
]

const closeSettings = () => {
  router.push('/admin')
}

const isActive = (routeConfig) => {
  if (routeConfig === 'SettingsPlaceholder') return false
  return route.name === routeConfig
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-[#F1F2F4] flex flex-col h-screen overflow-hidden">
    <!-- Dark Header (Shopify Style) -->
    <header class="bg-[#1a1a1a] h-14 flex items-center justify-between px-4 text-white flex-shrink-0">
      <div class="flex items-center gap-4">
        <!-- Volver button -->
        <button @click="closeSettings" class="flex items-center text-gray-300 hover:text-white transition group mr-2">
          <svg class="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span class="text-sm font-medium hidden sm:block">Volver</span>
        </button>

        <!-- Menu toggle for mobile -->
        <button @click="showMobileMenu = !showMobileMenu" class="lg:hidden p-1 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div class="w-8 h-8 bg-green-500 rounded text-black font-bold flex items-center justify-center text-xs hidden sm:flex">
          BL
        </div>
        <span class="font-medium text-sm hidden md:block">Configuración de tienda</span>
      </div>
      <div class="flex-1 max-w-2xl mx-4 sm:mx-8">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input type="text" class="block w-full pl-10 pr-3 py-1.5 bg-[#2c2c2c] border-transparent rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-gray-500 focus:bg-gray-800 focus:ring-0" placeholder="Buscar en Configuración">
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="text-gray-300 hover:text-white transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
        <button @click="closeSettings" class="p-1 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar for Settings -->
      <aside 
        :class="['w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0 shadow-sm z-40 transition-transform absolute lg:relative lg:translate-x-0', showMobileMenu ? 'translate-x-0' : '-translate-x-full']"
      >
        <div class="p-4">
          <div class="flex items-center justify-between lg:hidden mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Configuración</h2>
            <button @click="showMobileMenu = false" class="text-gray-500 hover:text-gray-900 p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <h2 class="hidden lg:block text-xl font-semibold text-gray-900 mb-4">Configuración</h2>
          
          <div class="relative mb-4">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchQuery" type="text" class="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Buscar">
          </div>

          <div class="overflow-y-auto pb-20" style="height: calc(100vh - 180px);">
            <nav class="space-y-1">
              <div v-for="group in menuGroups" :key="group.items[0].id">
                <template v-for="item in group.items" :key="item.id">
                  <RouterLink 
                    v-if="item.route !== 'SettingsPlaceholder'"
                    :to="{ name: item.route }" 
                    @click="showMobileMenu = false"
                    class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition"
                    :class="isActive(item.route) ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
                  >
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="isActive(item.route) ? 'text-gray-900' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
                    </svg>
                    {{ item.label }}
                  </RouterLink>
                  <div 
                    v-else
                    class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 cursor-not-allowed opacity-60"
                  >
                    <svg class="w-5 h-5 mr-3 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
                    </svg>
                    {{ item.label }}
                  </div>
                </template>
              </div>
            </nav>
          </div>
        </div>
      </aside>

      <!-- Overlay for Mobile Sidebar -->
      <div 
        v-if="showMobileMenu" 
        @click="showMobileMenu = false"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      ></div>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-[#F1F2F4] p-4 lg:p-8 w-full">
        <div class="max-w-3xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
