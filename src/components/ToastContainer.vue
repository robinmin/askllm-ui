<!-- components/ToastContainer.vue -->
<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="bg-white shadow-lg rounded-lg p-4 mb-2 max-w-md"
      :class="{
        'bg-green-100': toast.variant === 'success',
        'bg-yellow-100': toast.variant === 'warning',
        'bg-red-100': toast.variant === 'destructive'
      }"
    >
      <h3 class="font-bold" :class="{
        'text-green-500': toast.variant === 'success',
        'text-yellow-500': toast.variant === 'warning',
        'text-red-500': toast.variant === 'destructive'
      }"
      >{{ toast.title }}</h3>
      <p class="text-gray-500" v-if="toast.description">{{ toast.description }}</p>
      <button
        v-if="toast.action"
        @click="toast.action.onClick"
        class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        {{ toast.action.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from '@/composables/useToast'

const { toasts } = toast
</script>