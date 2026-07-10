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
import SettingsLayout from '@/layouts/SettingsLayout.vue'
import GeneralSettings from '@/pages/settings/GeneralSettings.vue'
import SettingsPlaceholder from '@/pages/settings/SettingsPlaceholder.vue'
import ProfileEdit from '@/pages/settings/ProfileEdit.vue'
import SupportPage from '@/pages/settings/SupportPage.vue'
import SettingsBilling from '@/pages/settings/SettingsBilling.vue'
import SettingsCheckout from '@/pages/settings/SettingsCheckout.vue'
import SettingsPrivacy from '@/pages/settings/SettingsPrivacy.vue'
import SettingsCustomData from '@/pages/settings/SettingsCustomData.vue'

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
    component: () => import('@/pages/products/CategoriesList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/brands',
    name: 'Brands',
    component: () => import('@/pages/products/BrandsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/colors',
    name: 'Colors',
    component: () => import('@/pages/products/ColorsList.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/admin/settings',
    component: SettingsLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/settings/general'
      },
      {
        path: 'general',
        name: 'SettingsGeneral',
        component: GeneralSettings
      },
      {
        path: 'checkout',
        name: 'SettingsCheckout',
        component: SettingsCheckout
      },
      {
        path: 'privacy',
        name: 'SettingsPrivacy',
        component: SettingsPrivacy
      },
      {
        path: 'custom-data',
        name: 'SettingsCustomData',
        component: SettingsCustomData
      },
      {
        path: 'billing',
        name: 'SettingsBilling',
        component: SettingsBilling
      },
      {
        path: 'profile',
        name: 'SettingsProfile',
        component: ProfileEdit
      },
      {
        path: 'support',
        name: 'SettingsSupport',
        component: SupportPage
      },
      {
        path: 'taxes',
        name: 'SettingsTaxes',
        component: () => import('@/pages/settings/TaxesSettings.vue')
      },
      {
        path: 'notifications',
        name: 'SettingsNotifications',
        component: () => import('@/pages/settings/NotificationsSettings.vue')
      },
      {
        path: 'integrations',
        name: 'SettingsIntegrations',
        component: () => import('@/pages/settings/IntegrationsSettings.vue')
      },
      {
        path: 'shipping',
        name: 'SettingsShipping',
        component: () => import('@/pages/settings/ShippingSettings.vue')
      },
      {
        path: 'shipping/profiles/:id',
        name: 'ShippingProfileEdit',
        component: () => import('@/pages/settings/ShippingProfileEdit.vue')
      },
      {
        path: 'users',
        name: 'SettingsUsers',
        component: () => import('@/pages/settings/UsersSettings.vue')
      },
      {
        path: 'payments',
        name: 'SettingsPayments',
        component: () => import('@/pages/settings/PaymentsSettings.vue')
      },
      {
        path: 'customer-accounts',
        name: 'SettingsCustomerAccounts',
        component: () => import('@/pages/settings/CustomerAccountsSettings.vue')
      },
      {
        path: 'locations',
        name: 'SettingsLocations',
        component: () => import('@/pages/settings/LocationsSettings.vue')
      },
      {
        path: 'sales-channels',
        name: 'SettingsSalesChannels',
        component: () => import('@/pages/settings/SalesChannelsSettings.vue')
      },
      {
        path: 'domains',
        name: 'SettingsDomains',
        component: () => import('@/pages/settings/DomainsSettings.vue')
      },
      {
        path: 'customer-events',
        name: 'SettingsCustomerEvents',
        component: () => import('@/pages/settings/CustomerEventsSettings.vue')
      },
      {
        path: 'customer-events/:id',
        name: 'PixelEdit',
        component: () => import('@/pages/settings/PixelEdit.vue')
      },
      {
        path: 'languages',
        name: 'SettingsLanguages',
        component: () => import('@/pages/settings/LanguagesSettings.vue')
      },
      {
        path: 'markets',
        name: 'SettingsMarkets',
        component: () => import('@/pages/settings/MarketsSettings.vue')
      },
      {
        path: 'locations/:id',
        name: 'SettingsLocationsEdit',
        component: () => import('@/pages/settings/LocationsEdit.vue')
      }
    ]
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
    path: '/admin/marketing/campaigns',
    name: 'MarketingCampaigns',
    component: () => import('@/pages/marketing/MarketingCampaigns.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/marketing/campaigns/new',
    name: 'MarketingCampaignCreate',
    component: () => import('@/pages/marketing/MarketingCampaignCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/marketing/campaigns/:id',
    name: 'MarketingCampaignDashboard',
    component: () => import('@/pages/marketing/MarketingCampaignDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/marketing/automations',
    name: 'MarketingAutomations',
    component: () => import('@/pages/marketing/MarketingAutomations.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/marketing/automations/edit',
    name: 'MarketingAutomationEdit',
    component: () => import('@/pages/marketing/MarketingAutomationEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/marketing/templates',
    name: 'MarketingTemplates',
    component: () => import('@/pages/marketing/MarketingTemplates.vue'),
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
