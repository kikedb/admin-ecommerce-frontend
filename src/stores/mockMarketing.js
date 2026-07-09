import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMarketingStore = defineStore('marketing', () => {
  const campaigns = ref([
    {
      id: 1,
      subject: 'Nueva colección de invierno',
      channel: 'Correo electrónico',
      channelIcon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      status: 'Enviado',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      date: '15 de Jul, 2026',
      openRate: '28.4%',
      clickRate: '4.1%',
      conversionRate: '1.2%',
      sales: '$3,400'
    },
    {
      id: 2,
      subject: '¡Oferta flash de fin de semana! ⚡️',
      channel: 'SMS',
      channelIcon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
      status: 'Programado',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      date: '20 de Jul, 2026',
      openRate: '-',
      clickRate: '-',
      conversionRate: '-',
      sales: '-'
    },
    {
      id: 3,
      subject: 'Tus favoritos están de vuelta',
      channel: 'Correo electrónico',
      channelIcon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      status: 'Borrador',
      statusColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      date: '-',
      openRate: '-',
      clickRate: '-',
      conversionRate: '-',
      sales: '-'
    }
  ])

  const addCampaign = (campaignData) => {
    campaigns.value.unshift({
      id: Date.now(),
      subject: campaignData.name,
      channel: 'Correo electrónico', // Default for mock
      channelIcon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      status: 'Programado',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      date: 'Hoy',
      openRate: '-',
      clickRate: '-',
      conversionRate: '-',
      sales: '-'
    })
  }

  return { campaigns, addCampaign }
})
