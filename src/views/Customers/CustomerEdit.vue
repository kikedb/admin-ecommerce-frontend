<template>
  <div class="p-6">
    <div class="mb-6">
      <router-link to="/customers" class="text-blue-600 hover:text-blue-800 mb-2 inline-block">
        ← Volver a Clientes
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Cliente</h1>
    </div>

    <div v-if="loadingData" class="text-center py-8">
      <p class="text-gray-500">Cargando datos del cliente...</p>
    </div>

    <CustomerForm
      v-else
      :loading="loading"
      @submit="handleUpdate"
      @cancel="$router.push('/customers')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import customersService from '@/services/customers.service'
import CustomerForm from '@/components/Customers/CustomerForm.vue'

const route = useRoute()
const router = useRouter()
const store = useCustomerStore()
const loading = ref(false)
const loadingData = ref(true)

onMounted(async () => {
  const customerId = route.params.id
  
  try {
    const response = await customersService.getCustomerById(customerId)
    store.loadCustomer(response.data.data)
  } catch (error) {
    console.error('Error loading customer:', error)
    alert('Error al cargar el cliente')
    router.push('/customers')
  } finally {
    loadingData.value = false
  }
})

async function handleUpdate(data) {
  loading.value = true
  try {
    const customerId = route.params.id
    await customersService.updateCustomer(customerId, data)
    alert('Cliente actualizado exitosamente')
    router.push('/customers')
  } catch (error) {
    console.error('Error updating customer:', error)
    alert('Error al actualizar el cliente: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}
</script>
