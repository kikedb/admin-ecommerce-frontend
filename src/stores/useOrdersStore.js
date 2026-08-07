import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ordersService } from '@/services/orders.service'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchOrders = async (params = {}) => {
    loading.value = true
    try {
      const response = await ordersService.getOrders(params)
      orders.value = response.data.data.data || response.data.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchOrder = async (id) => {
    loading.value = true
    try {
      const response = await ordersService.getOrder(id)
      currentOrder.value = response.data.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (data) => {
    const response = await ordersService.createOrder(data)
    orders.value.unshift(response.data.data)
    return response.data.data
  }

  const updateOrder = async (id, data) => {
    const response = await ordersService.updateOrder(id, data)
    const index = orders.value.findIndex(o => o.id === id)
    if (index !== -1) {
      orders.value[index] = response.data.data
    }
    if (currentOrder.value?.id === id) {
      currentOrder.value = response.data.data
    }
    return response.data.data
  }

  const deleteOrder = async (id) => {
    await ordersService.deleteOrder(id)
    orders.value = orders.value.filter(o => o.id !== id)
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    createOrder,
    updateOrder,
    deleteOrder
  }
})
