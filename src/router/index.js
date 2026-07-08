import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Páginas
import LoginPage from '@/pages/auth/LoginPage.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import ProductsPage from '@/pages/products/ProductsPage.vue'
import OrdersList from '@/pages/orders/OrdersList.vue'
import OrderCreate from '@/pages/orders/OrderCreate.vue'
import OrderDetail from '@/pages/orders/OrderDetail.vue'
import OrderReturn from '@/pages/orders/OrderReturn.vue'
import InventoryPage from '@/pages/inventory/InventoryPage.vue'
import PurchaseOrdersList from '@/pages/inventory/PurchaseOrdersList.vue'
import PurchaseOrderCreate from '@/pages/inventory/PurchaseOrderCreate.vue'
import PurchaseOrderDetail from '@/pages/inventory/PurchaseOrderDetail.vue'
import TransfersList from '@/pages/inventory/TransfersList.vue'
import TransferCreate from '@/pages/inventory/TransferCreate.vue'
import TransferDetail from '@/pages/inventory/TransferDetail.vue'
import CustomersList from '@/views/Customers/CustomersList.vue'
import CustomerCreate from '@/views/Customers/CustomerCreate.vue'
import CustomerEdit from '@/views/Customers/CustomerEdit.vue'
import CustomerDetail from '@/views/Customers/CustomerDetail.vue'
import ShippingPage from '@/pages/shipping/ShippingPage.vue'

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
    component: OrdersList,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders/new',
    name: 'OrderCreate',
    component: OrderCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders/:id/return',
    name: 'OrderReturn',
    component: OrderReturn,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inventory',
    name: 'Inventory',
    component: InventoryPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inventory/purchase-orders',
    name: 'PurchaseOrdersList',
    component: PurchaseOrdersList,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inventory/purchase-orders/new',
    name: 'PurchaseOrderCreate',
    component: PurchaseOrderCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inventory/purchase-orders/:id',
    name: 'PurchaseOrderDetail',
    component: PurchaseOrderDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inventory/transfers',
    name: 'TransfersList',
    component: TransfersList,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inventory/transfers/new',
    name: 'TransferCreate',
    component: TransferCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inventory/transfers/:id',
    name: 'TransferDetail',
    component: TransferDetail,
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
    path: '/customers/:id',
    name: 'CustomerDetail',
    component: CustomerDetail,
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
    path: '/admin/shipping',
    name: 'ShippingPage',
    component: ShippingPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders/completed',
    name: 'CompletedOrders',
    component: OrdersList,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders/pending',
    name: 'PendingOrders',
    component: OrdersList,
    meta: { requiresAuth: true }
  },
  {
    path: '/estado-pedido/:id',
    name: 'PublicOrderStatus',
    component: () => import('@/pages/orders/PublicOrderStatus.vue'),
    meta: { requiresAuth: false }
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
