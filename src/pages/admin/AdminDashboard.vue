<script setup>
import { Package, ShoppingCart, DollarSign, AlertCircle, Users } from 'lucide-vue-next';
import PageHeader from '@/components/Layout/PageHeader.vue';
import Card from '@/components/ui/Card.vue';

// Mock data
const stats = [
  { 
    name: 'Productos Activos', 
    value: '-', 
    description: 'Conectar a API', 
    icon: Package, 
    colorClass: 'text-blue-600 dark:text-blue-300',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30'
  },
  { 
    name: 'Pedidos Pendientes', 
    value: '-', 
    description: 'Conectar a API', 
    icon: ShoppingCart, 
    colorClass: 'text-purple-600 dark:text-purple-300',
    bgClass: 'bg-purple-100 dark:bg-purple-900/30'
  },
  { 
    name: 'Ventas Hoy', 
    value: '$0', 
    description: 'Conectar a API', 
    icon: DollarSign, 
    colorClass: 'text-green-600 dark:text-green-300',
    bgClass: 'bg-green-100 dark:bg-green-900/30'
  },
  { 
    name: 'Stock Bajo', 
    value: '-', 
    description: 'Conectar a API', 
    icon: AlertCircle, 
    colorClass: 'text-red-600 dark:text-red-300',
    bgClass: 'bg-red-100 dark:bg-red-900/30'
  }
];

const quickLinks = [
  {
    name: 'Productos',
    description: 'Gestionar inventario',
    to: '/admin/products',
    icon: Package,
    colorClass: 'text-blue-600 dark:text-blue-300',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    name: 'Pedidos',
    description: 'Ver pedidos',
    to: '/admin/orders',
    icon: ShoppingCart,
    colorClass: 'text-purple-600 dark:text-purple-300',
    bgClass: 'bg-purple-100 dark:bg-purple-900/30'
  },
  {
    name: 'Clientes',
    description: 'Gestionar clientes',
    to: '/customers',
    icon: Users,
    colorClass: 'text-green-600 dark:text-green-300',
    bgClass: 'bg-green-100 dark:bg-green-900/30'
  },
  {
    name: 'Inventario',
    description: 'Stock y almacén',
    to: '/admin/inventory',
    icon: Package, // using Package as fallback
    colorClass: 'text-orange-600 dark:text-orange-300',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30'
  }
];
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Panel de Control">
      <template #description>
        Bienvenido al dashboard de administración
      </template>
    </PageHeader>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card v-for="stat in stats" :key="stat.name" class="p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.name }}</p>
            <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ stat.description }}</p>
          </div>
          <div :class="['p-3 rounded-lg', stat.bgClass]">
            <component :is="stat.icon" :class="['w-6 h-6', stat.colorClass]" />
          </div>
        </div>
      </Card>
    </div>

    <!-- Quick Links -->
    <Card class="p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Accesos Rápidos</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.name"
          :to="link.to"
          class="flex items-center gap-3 p-4 transition bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700"
        >
          <div :class="['p-2 rounded-lg', link.bgClass]">
            <component :is="link.icon" :class="['w-5 h-5', link.colorClass]" />
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ link.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ link.description }}</p>
          </div>
        </RouterLink>
      </div>
    </Card>
  </div>
</template>
