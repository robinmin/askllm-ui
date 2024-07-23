<template>
    <div class="home-page">
      <h1 class="text-3xl font-bold">ASKLLM</h1>
      <!-- p class="mt-4">This is a simple home page for your Vue SPA project.</p -->
      <Button @click="incrementCount" class="mt-4">
        Clicked {{ count }} times
      </Button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Button } from '@/components/ui/button'
  
  const count = ref(0)
  
  const incrementCount = () => {
    count.value++
  }
  </script>