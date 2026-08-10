<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Mail, MessageSquare, Play, MousePointerClick, Send, X } from 'lucide-vue-next'

import PageHeader from '@/components/Layout/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'

const router = useRouter()
const showPreview = ref(false)
const selectedAutomation = ref(null)

const openPreview = (automation) => {
  selectedAutomation.value = automation
  showPreview.value = true
}

const goToEditor = () => {
  showPreview.value = false
  router.push('/admin/marketing/automations/edit')
}

const automationCategories = [
  {
    title: 'Recuperar visitantes del sitio',
    automations: [
      {
        id: 1,
        title: 'Recupera el carrito abandonado',
        description: 'Envía un correo de marketing cuando un cliente añade al menos un producto al carrito pero no avanza al pago.',
        channels: ['email', 'sms'],
        smsCompatible: true
      },
      {
        id: 2,
        title: 'Recupera el pedido abandonado',
        description: 'Envía un mensaje a los clientes 10 horas después de que inicien el pago pero no realicen un pedido, para animarlos a completar la compra.',
        channels: ['email', 'sms'],
        smsCompatible: true
      },
      {
        id: 3,
        title: 'Convierte la navegación de producto abandonada',
        description: 'Envía un correo de marketing a quienes vieron un producto pero no lo añadieron al carrito.',
        channels: ['email', 'sms'],
        smsCompatible: true
      }
    ]
  },
  {
    title: 'Dar la bienvenida a nuevos suscriptores',
    automations: [
      {
        id: 4,
        title: 'Da la bienvenida a nuevos suscriptores con un correo con descuento',
        description: 'Envía a quienes se suscriben a través de un formulario en tu tienda online un correo de bienvenida con un descuento.',
        channels: ['email'],
        smsCompatible: false
      },
      {
        id: 5,
        title: 'Da la bienvenida a nuevos suscriptores con una serie de correos',
        description: 'Envía una serie de mensajes de bienvenida a los nuevos suscriptores cuando se suscriban al marketing a través de tu tienda online.',
        channels: ['email'],
        smsCompatible: false
      }
    ]
  },
  {
    title: 'Poscompra',
    automations: [
      {
        id: 6,
        title: 'Recupera clientes',
        description: 'Ofrece un descuento a quienes no hayan realizado un pedido en tu tienda en los últimos 60 días.',
        channels: ['email'],
        smsCompatible: false
      },
      {
        id: 7,
        title: 'Haz una venta adicional después de la primera compra',
        description: 'Envía un correo de marketing destacando productos destacados después de que un cliente haga su primera compra.',
        channels: ['email'],
        smsCompatible: false
      },
      {
        id: 8,
        title: 'Agradece a los clientes después de su compra',
        description: 'Envía un correo de agradecimiento distinto a los clientes después de su primera y segunda compra.',
        channels: ['email'],
        smsCompatible: false
      }
    ]
  }
]
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <PageHeader title="Plantillas de automatización">
      <template #description>Crea flujos de trabajo automatizados para tus clientes.</template>
      <template #back>
        <RouterLink to="/admin/marketing/campaigns" class="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition mr-2">
          <ArrowLeft class="w-5 h-5" />
        </RouterLink>
      </template>
      <template #actions>
        <Button variant="outline" @click="goToEditor">
          Crear automatización personalizada
        </Button>
      </template>
    </PageHeader>

    <!-- Automation Categories -->
    <div class="space-y-8 mt-8">
      <div v-for="category in automationCategories" :key="category.title" class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white px-1">{{ category.title }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            v-for="automation in category.automations" 
            :key="automation.id"
            @click="openPreview(automation)"
            class="p-6 hover:shadow-md transition cursor-pointer group flex flex-col h-full relative overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ automation.title }}
              </h3>
              
              <!-- Channels & Badges -->
              <div class="flex items-center gap-3 mb-4 text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1.5">
                  <Mail v-if="automation.channels.includes('email')" class="w-4 h-4" />
                  <MessageSquare v-if="automation.channels.includes('sms')" class="w-4 h-4" />
                </div>
                
                <span v-if="automation.smsCompatible" class="text-[11px] font-medium px-2 py-0.5 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                  Compatible con SMS
                </span>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {{ automation.description }}
              </p>
            </div>
            
            <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
              <span class="text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Usar plantilla <Play class="w-3 h-3"/></span>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Modal :is-open="showPreview" title="Previsualización de plantilla" @close="showPreview = false">
      <div class="max-w-2xl">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ selectedAutomation?.title }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ selectedAutomation?.description }}</p>
        
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Flujo de trabajo propuesto</h4>
          
          <div class="space-y-4 relative before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-gray-300 dark:before:bg-gray-600">
            
            <!-- Trigger -->
            <div class="relative flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 z-10 ring-4 ring-gray-50 dark:ring-gray-900">
                <MousePointerClick class="w-5 h-5" />
              </div>
              <div class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 shadow-sm mt-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">Disparador</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Cuando el cliente cumple las condiciones</p>
              </div>
            </div>

            <!-- Action -->
            <div class="relative flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 z-10 ring-4 ring-gray-50 dark:ring-gray-900">
                <Send class="w-5 h-5" />
              </div>
              <div class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 shadow-sm mt-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">Enviar mensaje</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Contenido pre-diseñado para esta automatización</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <template #footer>
        <Button variant="outline" @click="showPreview = false">Cancelar</Button>
        <Button variant="primary" @click="goToEditor" class="gap-2">
          <Play class="w-4 h-4" /> Editar automatización
        </Button>
      </template>
    </Modal>
  </div>
</template>
