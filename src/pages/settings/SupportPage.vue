<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Centro de Soporte</h2>
        <p class="text-sm text-gray-500 mt-1">Encuentra respuestas rápidas o contacta a nuestro equipo.</p>
      </div>
      <a href="mailto:soporte@admin.com" class="px-4 py-2 bg-teal-600 text-white rounded shadow-sm hover:bg-teal-700 text-sm font-medium transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        Contactar Soporte
      </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="col-span-1 lg:col-span-2 space-y-4">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Preguntas Frecuentes</h3>
          
          <div class="space-y-4">
            <details class="group bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary class="font-medium text-gray-900 flex justify-between items-center">
                ¿Cómo creo un nuevo pedido manual?
                <span class="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p class="text-gray-500 mt-3 text-sm leading-relaxed">
                Ve a la sección de "Pedidos" en el menú lateral y haz clic en el botón "Crear pedido" en la esquina superior derecha. Podrás seleccionar clientes existentes, agregar productos y procesar pagos manualmente.
              </p>
            </details>

            <details class="group bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary class="font-medium text-gray-900 flex justify-between items-center">
                ¿Cómo configuro mis tarifas de envío?
                <span class="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p class="text-gray-500 mt-3 text-sm leading-relaxed">
                Ingresa a Configuración > Envío y Entrega. Desde allí puedes crear perfiles de envío, asignar zonas geográficas y definir tarifas basadas en peso o precio del carrito.
              </p>
            </details>
            
            <details class="group bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary class="font-medium text-gray-900 flex justify-between items-center">
                ¿Dónde conecto mi cuenta de MercadoPago?
                <span class="transition group-open:rotate-180">
                  <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p class="text-gray-500 mt-3 text-sm leading-relaxed">
                Dirígete a Configuración > Pagos. Allí encontrarás los módulos de proveedores disponibles. Selecciona MercadoPago e ingresa tu Public Key y Access Token para empezar a recibir pagos.
              </p>
            </details>
          </div>
        </div>
      </div>

      <div class="col-span-1 space-y-6">
        <div class="bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg shadow-sm p-6 text-white text-center">
          <svg class="w-12 h-12 mx-auto text-teal-100 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <h3 class="text-lg font-bold mb-2">¿Necesitas ayuda extra?</h3>
          <p class="text-teal-100 text-sm mb-4">Nuestro equipo de soporte técnico está disponible 24/7 para ayudarte a escalar tu tienda.</p>
          <a href="mailto:soporte@admin.com" class="inline-block px-4 py-2 bg-white text-teal-700 font-semibold text-sm rounded hover:bg-gray-50 transition w-full">
            Escríbenos un correo
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>
