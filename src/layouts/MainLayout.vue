<template>
    <div class="min-h-screen flex flex-col">
      <header class="bg-white shadow">
        <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
          <RouterLink to="/" class="text-xl font-bold">Vue SPA</RouterLink>
          <div>
            <RouterLink v-if="!authStore.user" to="/login" class="text-blue-600 hover:text-blue-800 mr-4">Login</RouterLink>
            <Button v-else @click="authStore.logout">Logout</Button>
          </div>
        </nav>
      </header>
  
      <main class="flex-grow container mx-auto px-4 py-8">
        <slot></slot>
      </main>
  
      <footer class="bg-gray-100">
        <div class="container mx-auto px-4 py-3 text-center text-gray-600">
          &copy; 2024 Vue SPA Project
        </div>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { Button } from '@/components/ui/button'
  
  const authStore = useAuthStore()
  </script>