<script setup>
import { ref } from 'vue'

const editMode = ref({
  commercialInfo: false,
  storeContact: false,
  storeAddress: false
})

const storeData = ref({
  entityName: 'Macarena Pizarro',
  country: 'Chile',
  storeName: 'Bilbola',
  email: 'info@bilbola.cl',
  phone: '+5633942006',
  addressName: 'Dirección de la tienda',
  addressFull: 'Comercial Bilbola Store Limitada, Avenida Vitacura 6195, Loc 19, 7650775 Vitacura, Santiago, Chile',
  currency: 'Peso chileno (CLP $)',
  backupRegion: 'Chile',
  unitSystem: 'Sistema métrico',
  defaultWeight: 'Kilogramo (kg)',
  timezone: '(GMT-04:00) Santiago'
})
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-6">
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      <h1 class="text-2xl font-semibold text-gray-900">General</h1>
    </div>

    <!-- Información comercial -->
    <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Información comercial</h2>
        <p class="text-sm text-gray-500 mt-1">Entidad comercial que se usa para productos financieros, mercados, apps e impuestos en esta tienda</p>
      </div>
      <div class="p-6">
        <div v-if="!editMode.commercialInfo" class="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition" @click="editMode.commercialInfo = true">
          <div class="flex items-center gap-4">
            <div class="w-8 h-6 bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
              <!-- Chile Flag SVG placeholder -->
              <svg viewBox="0 0 900 600" class="w-full h-full">
                <rect width="900" height="600" fill="#d52b1e"/>
                <rect width="900" height="300" fill="#fff"/>
                <rect width="300" height="300" fill="#0039a6"/>
                <polygon points="150,55 179,145 274,145 197,201 226,291 150,235 74,291 103,201 26,145 121,145" fill="#fff"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ storeData.entityName }}</p>
              <p class="text-sm text-gray-500">{{ storeData.country }}</p>
            </div>
          </div>
          <button class="text-gray-400 hover:bg-gray-100 p-1.5 rounded-md transition">
            <svg class="w-5 h-5 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
        
        <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-5">
           <h3 class="text-sm font-semibold text-gray-900 mb-4">Editar información comercial</h3>
           <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Entidad comercial</label>
               <input type="text" v-model="storeData.entityName" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
               <input type="text" v-model="storeData.country" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             </div>
           </div>
           <div class="mt-5 flex justify-end gap-3">
             <button @click="editMode.commercialInfo = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
             <button @click="editMode.commercialInfo = false" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition">Guardar</button>
           </div>
        </div>
      </div>
    </section>

    <!-- Detalles de contacto de la tienda -->
    <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Detalles de contacto de la tienda</h2>
      </div>
      <div class="divide-y divide-gray-100">
        <!-- Bloque Tienda -->
        <div v-if="!editMode.storeContact" class="p-6 flex items-start justify-between group cursor-pointer hover:bg-gray-50 transition" @click="editMode.storeContact = true">
          <div class="flex gap-4">
            <div class="mt-0.5 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ storeData.storeName }}</p>
              <p class="text-sm text-gray-500">{{ storeData.email }} &bull; {{ storeData.phone }}</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
        
        <div v-else class="p-6 bg-gray-50">
           <h3 class="text-sm font-semibold text-gray-900 mb-4">Editar contacto de la tienda</h3>
           <div class="grid grid-cols-1 gap-4 mb-4">
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
               <input type="text" v-model="storeData.storeName" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             </div>
           </div>
           <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
               <input type="email" v-model="storeData.email" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
               <input type="text" v-model="storeData.phone" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             </div>
           </div>
           <div class="mt-5 flex justify-end gap-3">
             <button @click="editMode.storeContact = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
             <button @click="editMode.storeContact = false" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition">Guardar</button>
           </div>
        </div>
        
        <!-- Bloque Dirección -->
        <div v-if="!editMode.storeAddress" class="p-6 flex items-start justify-between group cursor-pointer hover:bg-gray-50 transition border-t border-gray-100" @click="editMode.storeAddress = true">
          <div class="flex gap-4">
            <div class="mt-0.5 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ storeData.addressName }}</p>
              <p class="text-sm text-gray-500 max-w-lg">{{ storeData.addressFull }}</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </div>

        <div v-else class="p-6 bg-gray-50 border-t border-gray-100">
           <h3 class="text-sm font-semibold text-gray-900 mb-4">Editar dirección</h3>
           <div class="grid grid-cols-1 gap-4">
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la dirección</label>
               <input type="text" v-model="storeData.addressName" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Dirección completa</label>
               <textarea v-model="storeData.addressFull" rows="3" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
             </div>
           </div>
           <div class="mt-5 flex justify-end gap-3">
             <button @click="editMode.storeAddress = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
             <button @click="editMode.storeAddress = false" class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition">Guardar</button>
           </div>
        </div>
      </div>
    </section>

    <!-- Valores predeterminados de la tienda -->
    <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Valores predeterminados de la tienda</h2>
      </div>
      <div class="p-6 space-y-6">
        
        <!-- Moneda -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">Visualización de la moneda</label>
          <select v-model="storeData.currency" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
            <option>Peso chileno (CLP $)</option>
            <option>Dólar estadounidense (USD $)</option>
            <option>Euro (EUR €)</option>
            <option>Peso mexicano (MXN $)</option>
            <option>Peso argentino (ARS $)</option>
            <option>Peso colombiano (COP $)</option>
            <option>Sol peruano (PEN S/)</option>
            <option>Real brasileño (BRL R$)</option>
            <option>Libra esterlina (GBP £)</option>
            <option>Yen japonés (JPY ¥)</option>
            <option>Dólar canadiense (CAD $)</option>
            <option>Dólar australiano (AUD $)</option>
            <option>Franco suizo (CHF Fr)</option>
          </select>
          <p class="text-xs text-gray-500 mt-1.5">Para gestionar las monedas que ven los clientes, ve a <a href="#" class="text-blue-600 hover:underline">Markets</a></p>
        </div>

        <hr class="border-gray-100">

        <!-- Región de copia de seguridad -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">Región de copia de seguridad</label>
          <select v-model="storeData.backupRegion" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
            <option>Chile</option>
            <option>Argentina</option>
            <option>Bolivia</option>
            <option>Brasil</option>
            <option>Canadá</option>
            <option>Colombia</option>
            <option>Ecuador</option>
            <option>España</option>
            <option>Estados Unidos</option>
            <option>México</option>
            <option>Perú</option>
            <option>Unión Europea</option>
            <option>Uruguay</option>
            <option>Venezuela</option>
          </select>
          <p class="text-xs text-gray-500 mt-1.5">Determina la configuración para clientes fuera de tus mercados</p>
        </div>

        <hr class="border-gray-100">

        <!-- Unidades -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-1">Sistema de unidades</label>
            <select v-model="storeData.unitSystem" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
              <option>Sistema métrico</option>
              <option>Sistema imperial</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-1">Unidad de peso predeterminada</label>
            <select v-model="storeData.defaultWeight" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
              <option>Kilogramo (kg)</option>
              <option>Gramo (g)</option>
              <option>Libra (lb)</option>
              <option>Onza (oz)</option>
            </select>
          </div>
        </div>

        <hr class="border-gray-100">

        <!-- Zona horaria -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">Zona horaria</label>
          <select v-model="storeData.timezone" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white max-h-48 overflow-y-auto">
            <option>(GMT-12:00) International Date Line West</option>
            <option>(GMT-11:00) Midway Island, Samoa</option>
            <option>(GMT-10:00) Hawaii</option>
            <option>(GMT-09:00) Alaska</option>
            <option>(GMT-08:00) Pacific Time (US & Canada)</option>
            <option>(GMT-07:00) Mountain Time (US & Canada)</option>
            <option>(GMT-06:00) Central Time (US & Canada), Mexico City</option>
            <option>(GMT-05:00) Eastern Time (US & Canada), Bogota, Lima</option>
            <option>(GMT-04:00) Santiago, Caracas, La Paz</option>
            <option>(GMT-03:00) Buenos Aires, Brasilia, Montevideo</option>
            <option>(GMT-02:00) Mid-Atlantic</option>
            <option>(GMT-01:00) Azores, Cape Verde Is.</option>
            <option>(GMT+00:00) London, Lisbon, Casablanca</option>
            <option>(GMT+01:00) Madrid, Paris, Berlin, Rome</option>
            <option>(GMT+02:00) Cairo, Athens, Jerusalem</option>
            <option>(GMT+03:00) Moscow, Baghdad, Riyadh</option>
            <option>(GMT+04:00) Abu Dhabi, Muscat, Baku</option>
            <option>(GMT+05:00) Islamabad, Karachi, Tashkent</option>
            <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
            <option>(GMT+06:00) Almaty, Dhaka</option>
            <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
            <option>(GMT+08:00) Beijing, Perth, Singapore, Hong Kong</option>
            <option>(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo</option>
            <option>(GMT+10:00) Sydney, Melbourne, Brisbane</option>
            <option>(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
            <option>(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka</option>
          </select>
          <p class="text-xs text-gray-500 mt-1.5">Establece la hora en la que se registran los pedidos y los informes y estadísticas</p>
        </div>

      </div>
    </section>
  </div>
</template>
