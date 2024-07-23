<template>
  <div class="login-page">
    <h1>{{ isLogin ? 'Login' : 'Register' }}</h1>
    <form @submit.prevent="handleSubmit">
      <Input v-model="email" type="email" placeholder="Email" required />
      <Input v-model="password" type="password" placeholder="Password" required />
      <Button type="submit">{{ isLogin ? 'Login' : 'Register' }}</Button>
    </form>
    <Button variant="link" @click="toggleMode">
      {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
    </Button>
    <div class="sso-options">
      <Button @click="handleSSOLogin('google')">Login with Google</Button>
      <Button @click="handleSSOLogin('github')">Login with GitHub</Button>
    </div>
    <Alert v-if="authStore.error" variant="destructive">
      {{ authStore.error.message }}
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')

// Toggle between login and register modes
const toggleMode = () => {
  isLogin.value = !isLogin.value
  authStore.error = null // Clear any existing errors
}

// Handle form submission for both login and register
const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value)
    }
    router.push('/')
  } catch (error) {
    console.error('Authentication error:', error)
  }
}

// Handle SSO login (to be implemented)
const handleSSOLogin = (provider: 'google' | 'github') => {
  console.log(`SSO login with ${provider}`)
  // Implement SSO login logic here
}
</script>