import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Páginas
import LoginPage from '@/pages/auth/LoginPage.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import ProductsPage from '@/pages/products/ProductsPage.vue'
import OrdersPage from '@/pages/orders/OrdersPage.vue'
import InventoryPage from '@/pages/inventory/InventoryPage.vue'
import CustomersList from '@/views/Customers/CustomersList.vue'
import CustomerCreate from '@/views/Customers/CustomerCreate.vue'
import CustomerEdit from '@/views/Customers/CustomerEdit.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/products',
    name: 'ProductsList',
    component: ProductsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders',
    name: 'OrdersList',
    component: OrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inventory',
    name: 'Inventory',
    component: InventoryPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers',
    name: 'CustomersList',
    component: CustomersList,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/create',
    name: 'CustomerCreate',
    component: CustomerCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/:id/edit',
    name: 'CustomerEdit',
    component: CustomerEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/categories',
    name: 'Categories',
    component: ProductsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/brands',
    name: 'Brands',
    component: ProductsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/colors',
    name: 'Colors',
    component: ProductsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders/completed',
    name: 'CompletedOrders',
    component: OrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders/pending',
    name: 'PendingOrders',
    component: OrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/admin'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/admin')
  } else {
    next()
  }
})

export default router
