<script setup>
import { computed } from 'vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    // [{ key: 'id', label: 'ID', align: 'left' }]
  },
  data: {
    type: Array,
    default: () => [],
  },
  emptyMessage: {
    type: String,
    default: 'No hay datos disponibles.',
  },
  loading: {
    type: Boolean,
    default: false,
  }
});

const hasData = computed(() => props.data && props.data.length > 0);
</script>

<template>
  <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            :class="['px-6 py-3', col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left']"
          >
            {{ col.label }}
          </th>
          <th v-if="$slots.actions" scope="col" class="px-6 py-3 text-right">
            Acciones
          </th>
        </tr>
      </thead>
      
      <tbody>
        <template v-if="loading">
          <tr>
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-8 text-center text-gray-500">
              Cargando...
            </td>
          </tr>
        </template>
        <template v-else-if="!hasData">
          <tr>
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              {{ emptyMessage }}
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="(row, idx) in data"
            :key="idx"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="['px-6 py-4', col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left']"
            >
              <slot :name="`cell-${col.key}`" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-6 py-4 text-right">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
