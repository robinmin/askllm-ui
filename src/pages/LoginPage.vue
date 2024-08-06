<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login to ASKLLM</CardTitle>
        <CardDescription>Choose your preferred login method</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleEmailLogin">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="your@email.com" required />
            </div>
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input id="password" v-model="password" type="password" required />
            </div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? 'Logging in...' : 'Login with Email' }}
            </Button>
          </div>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div class="space-y-4">
          <Button @click="handleGoogleLogin" variant="outline" class="w-full" :disabled="isLoading">
            <Chrome class="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button @click="handleGithubLogin" variant="outline" class="w-full" :disabled="isLoading">
            <Github class="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter class="flex justify-center">
        <RouterLink to="/sys/register" class="text-sm text-primary hover:underline">
          Don't have an account? Register here
        </RouterLink>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label } from '@/components/ui/'

import { Chrome, Github, Loader2 } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { login } = useAuth()
const { toast } = useToast()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleEmailLogin = async () => {
  isLoading.value = true
  try {
    await login({ email: email.value, password: password.value })
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    toast({
      title: 'Login Failed',
      description: error.message || 'An error occurred during login. Please try again.',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  isLoading.value = true
  try {
    await login({ provider: 'google' })
    router.push('/')
  } catch (error) {
    console.error('Google login failed:', error)
    toast({
      title: 'Google Login Failed',
      description: error.message || 'An error occurred during Google login. Please try again.',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}

const handleGithubLogin = async () => {
  isLoading.value = true
  try {
    await login({ provider: 'github' })
    router.push('/')
  } catch (error) {
    console.error('GitHub login failed:', error)
    toast({
      title: 'GitHub Login Failed',
      description: error.message || 'An error occurred during GitHub login. Please try again.',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}
</script>