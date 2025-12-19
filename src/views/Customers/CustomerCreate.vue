<template>
  <div class="p-6">
    <div class="mb-6">
      <router-link to="/customers" class="text-blue-600 hover:text-blue-800 mb-2 inline-block">
        ← Volver a Clientes
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Cliente</h1>
    </div>

    <CustomerForm
      :loading="loading"
      @submit="handleCreate"
      @cancel="$router.push('/customers')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import customersService from '@/services/customers.service'
import CustomerForm from '@/components/Customers/CustomerForm.vue'

const router = useRouter()
const store = useCustomerStore()
const loading = ref(false)

onMounted(() => {
  store.clearForm()
})

async function handleCreate(data) {
  loading.value = true
  try {
    await customersService.createCustomer(data)
    alert('Cliente creado exitosamente')
    router.push('/customers')
  } catch (error) {
    console.error('Error creating customer:', error)
    alert('Error al crear el cliente: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}
</script>
