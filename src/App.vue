<template>
  <div class="min-h-screen bg-background flex flex-col">
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside :class="[
        'transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      ]">
        <div class="h-full bg-secondary text-secondary-foreground p-4">
          <div class="flex items-center justify-between mb-8">
            <!-- img src="/logo.svg" alt="Logo" class="h-8 w-8" :class="{ 'mr-2': !isSidebarCollapsed }" / -->
            <span v-if="!isSidebarCollapsed" class="text-lg font-semibold">ASKLLM</span>
            <Button variant="ghost" size="icon" @click="toggleSidebar" class="ml-auto">
              <ChevronLeft v-if="!isSidebarCollapsed" class="h-4 w-4" />
              <ChevronRight v-else class="h-4 w-4" />
            </Button>
          </div>
          
          <nav class="space-y-2">
            <RouterLink to="/" class="flex items-center p-2 rounded-lg hover:bg-primary/10" :class="{ 'justify-center': isSidebarCollapsed }">
              <Home class="h-5 w-5" />
              <span v-if="!isSidebarCollapsed" class="ml-3">Home</span>
            </RouterLink>
            <RouterLink to="/sys/profile" class="flex items-center p-2 rounded-lg hover:bg-primary/10" :class="{ 'justify-center': isSidebarCollapsed }">
              <User class="h-5 w-5" />
              <span v-if="!isSidebarCollapsed" class="ml-3">Profile</span>
            </RouterLink>
            <!-- RouterLink to="/setting" class="flex items-center p-2 rounded-lg hover:bg-primary/10" :class="{ 'justify-center': isSidebarCollapsed }">
              <Settings class="h-5 w-5" />
              <span v-if="!isSidebarCollapsed" class="ml-3">Setting</span>
            </RouterLink -->
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="bg-background border-b">
          <div class="container mx-auto px-4 py-2 flex justify-end items-center">
            <ToastContainer />

            <template v-if="isAuthenticated">
              <Button variant="ghost" @click="handleLogout" class="flex items-center">
                <LogOut class="h-4 w-4 mr-2" />
                Logout
              </Button>
            </template>
            <template v-else>
              <Button variant="ghost" @click="handleLogin" class="flex items-center">
                <LogIn class="h-4 w-4 mr-2" />
                Login
              </Button>
            </template>
          </div>
        </header>

        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div class="container mx-auto px-4 py-8">
            <RouterView v-slot="{ Component, route }">
              <template v-if="Component">
                <Transition mode="out-in">
                  <KeepAlive v-if="route.meta.keepAlive">
                    <component :is="Component" :key="route.path" />
                  </KeepAlive>
                  <component v-else :is="Component" :key="route.path" />
                </Transition>
              </template>
              <div v-else class="flex items-center justify-center h-full">
                <Loader2 class="h-8 w-8 animate-spin" />
                <span class="ml-2">Loading...</span>
              </div>
            </RouterView>
            
          </div>
        </main>

        <footer class="bg-background text-secondary-foreground py-4">
          <div class="container mx-auto px-4 text-center text-gray-300">
            <p>&copy; {{ currentYear }} ASKLLM. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, Home, User, Settings, LogIn, LogOut, Loader2 } from 'lucide-vue-next'

import { Button, Skeleton } from '@/components/ui/'

import { useAuth } from '@/composables/useAuth' // Assume we have this composable for auth state management

import { toast } from '@/composables/useToast'
import ToastContainer from '@/components/ToastContainer.vue'

const router = useRouter()
const isSidebarCollapsed = ref(true)
const { isAuthenticated, login, logout } = useAuth()

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/sys/login')
    toast.addToast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      variant: 'success'
    })
  } catch (error) {
    console.error('Logout failed:', error)
    toast.addToast({
      title: 'Logout Failed',
      description: 'An error occurred during logout. Please try again.',
      variant: 'destructive'
    })
  }
}

const handleLogin = async () => {
  router.push('/sys/login')
}
onMounted(async () => {
  // await checkAuth()
})

const currentYear = computed(() => new Date().getFullYear())
</script>