<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.params.id || 'N/A'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="w-full max-w-lg mb-8 text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-1">Bilbola</h2>
      <p class="text-gray-500 text-sm">Seguimiento de tu pedido</p>
    </div>

    <div class="max-w-lg w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div class="px-6 py-8 text-center border-b border-gray-100">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">¡Gracias por tu compra!</h1>
        <p class="text-gray-600">Tu pedido <span class="font-bold text-gray-900">#{{ orderId }}</span> está confirmado.</p>
      </div>

      <div class="px-6 py-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Estado del pedido</h3>
          <div class="bg-gray-50 p-4 rounded-md border border-gray-100">
            <p class="text-sm text-gray-800 font-medium flex items-center">
              <span class="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></span>
              Preparado para envío/retiro
            </p>
            <p class="text-xs text-gray-500 mt-1 ml-4">Te notificaremos cuando haya novedades con la entrega.</p>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-3">Resumen de la orden</h3>
          <div class="flex items-center space-x-4 border-b border-gray-100 pb-4">
            <div class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
               <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900">Sujetador de chupete conejo rayas azul</h4>
              <p class="text-xs text-gray-500">Cant: 1</p>
            </div>
            <span class="text-sm font-medium text-gray-900">$12.990</span>
          </div>
          
          <div class="space-y-2 mt-4 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>$12.990</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Envío</span>
              <span>Calculado en el checkout</span>
            </div>
            <div class="flex justify-between font-medium text-gray-900 text-base pt-2 border-t border-gray-100 mt-2">
              <span>Total</span>
              <span>$12.990</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="px-6 py-4 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-200">
        Si tienes preguntas sobre tu pedido, contáctanos a soporte@bilbola.cl
      </div>
    </div>
  </div>
</template>
