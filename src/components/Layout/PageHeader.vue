<script setup>
import { ChevronRight } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    required: true,
  },
  breadcrumbs: {
    type: Array,
    default: () => [], // [{ name: 'Home', href: '/' }, { name: 'Products' }]
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div>
      <nav v-if="breadcrumbs.length > 0" class="flex mb-2" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2">
          <li v-for="(item, idx) in breadcrumbs" :key="idx" class="inline-flex items-center">
            <template v-if="idx > 0">
              <ChevronRight class="w-4 h-4 text-gray-400 mx-1" />
            </template>
            <router-link 
              v-if="item.href" 
              :to="item.href" 
              class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {{ item.name }}
            </router-link>
            <span v-else class="text-sm font-medium text-gray-500 dark:text-gray-500">
              {{ item.name }}
            </span>
          </li>
        </ol>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl tracking-tight">
        {{ title }}
      </h1>
      <p v-if="$slots.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        <slot name="description" />
      </p>
    </div>
    
    <div v-if="$slots.actions" class="flex items-center space-x-3">
      <slot name="actions" />
    </div>
  </div>
</template>
