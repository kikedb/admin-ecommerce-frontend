<script setup>
import { ref } from 'vue'

const showAddModal = ref(false)
const showExportModal = ref(false)
const showImportModal = ref(false)

const newLanguage = ref('fr')
const languagesList = [
  { code: 'fr', name: 'Francés' },
  { code: 'pt', name: 'Portugués' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Alemán' },
  { code: 'zh', name: 'Chino' },
]

const languages = ref([
  { id: 1, name: 'Español', isDefault: true, status: 'Publicado', domains: '2 dominios', url: '/es' },
  { id: 2, name: 'Inglés', isDefault: false, status: 'Publicado', domains: '2 dominios', url: '/en' }
])

const addLanguage = () => {
  const lang = languagesList.find(l => l.code === newLanguage.value)
  if (lang) {
    languages.value.push({
      id: Date.now(),
      name: lang.name,
      isDefault: false,
      status: 'No publicado',
      domains: '0 dominios',
      url: `/${lang.code}`
    })
  }
  showAddModal.value = false
}

</script>

<template>
  <div class="max-w-4xl space-y-6 pb-12 relative">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Idiomas</h1>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showExportModal = true" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Exportar
        </button>
        <button @click="showImportModal = true" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Importar
        </button>
        <button @click="showAddModal = true" class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Agregar idioma
        </button>
      </div>
    </div>

    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Administra los idiomas en los que los clientes pueden ver tu tienda.</p>

    <!-- Lista de Idiomas -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Idiomas traducidos</h2>
          <p class="text-sm text-gray-500 mt-1">Has usado {{ languages.length }} de 5 idiomas disponibles en tu plan.</p>
        </div>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="lang in languages" :key="lang.id" class="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition group cursor-default">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-900 dark:text-white text-base">{{ lang.name }}</span>
              <span v-if="lang.isDefault" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Predeterminado
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2 text-sm" :class="lang.status === 'Publicado' ? 'text-green-600' : 'text-gray-500'">
              <svg v-if="lang.status === 'Publicado'" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              {{ lang.status }}
            </div>
            
            <div class="text-sm text-gray-500 hidden sm:block">
              {{ lang.domains }}
            </div>
            
            <button class="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" title="Más acciones">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Shopify Translate & Adapt App -->
      <div class="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">Shopify Translate & Adapt</h3>
            <p class="text-sm text-gray-500 mt-1">Traduce tu tienda con la app nativa gratuita y ajusta el contenido para cada mercado.</p>
          </div>
          <button class="whitespace-nowrap text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 shadow-sm transition">
            Abrir aplicación
          </button>
        </div>
      </div>
    </section>

    <!-- Modals -->
    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Agregar idioma</h2>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecciona un idioma</label>
          <select v-model="newLanguage" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option v-for="lang in languagesList" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
          </select>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showAddModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
          <button @click="addLanguage" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">Agregar</button>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Exportar idiomas</h2>
          <button @click="showExportModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Exporta tus traducciones a un archivo CSV para editarlas externamente.</p>
          <div class="space-y-3">
            <label class="flex items-center gap-2">
              <input type="radio" name="exportOption" checked class="text-blue-600" />
              <span class="text-sm text-gray-800 dark:text-gray-200">Exportar todos los idiomas</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="exportOption" class="text-blue-600" />
              <span class="text-sm text-gray-800 dark:text-gray-200">Exportar idioma seleccionado</span>
            </label>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showExportModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
          <button @click="showExportModal = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">Exportar CSV</button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Importar idiomas</h2>
          <button @click="showImportModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Sube un archivo CSV con las traducciones para actualizar tu tienda.</p>
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-750 transition cursor-pointer">
            <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <span class="text-sm font-medium text-blue-600">Haz clic para buscar un archivo</span>
            <span class="text-xs text-gray-500 mt-1">Soporta formato .CSV</span>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
          <button @click="showImportModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
          <button @click="showImportModal = false" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition">Importar archivo</button>
        </div>
      </div>
    </div>
  </div>
</template>
