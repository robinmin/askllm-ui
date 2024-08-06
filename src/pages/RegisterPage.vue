<template>
    <div class="flex items-center justify-center min-h-screen bg-background">
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register for ASKLLM</CardTitle>
          <CardDescription>Create a new account or sign up with a provider</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleEmailRegister">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input id="email" v-model="email" type="email" placeholder="your@email.com" required />
              </div>
              <div class="space-y-2">
                <Label for="password">Password</Label>
                <Input id="password" v-model="password" type="password" required />
              </div>
              <div class="space-y-2">
                <Label for="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" v-model="confirmPassword" type="password" required />
              </div>
              <Button type="submit" class="w-full" :disabled="isLoading">
                <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                {{ isLoading ? 'Registering...' : 'Register with Email' }}
              </Button>
            </div>
          </form>
  
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-background px-2 text-muted-foreground">Or sign up with</span>
            </div>
          </div>
  
          <div class="space-y-4">
            <Button @click="handleGoogleRegister" variant="outline" class="w-full" :disabled="isLoading">
              <Chrome class="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button @click="handleGithubRegister" variant="outline" class="w-full" :disabled="isLoading">
              <Github class="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter class="flex justify-center">
          <RouterLink to="/sys/login" class="text-sm text-primary hover:underline">
            Already have an account? Login here
          </RouterLink>
        </CardFooter>
      </Card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label } from '@/components/ui/'

  import { Chrome, Github, Loader2 } from 'lucide-vue-next'
  import { useAuth } from '@/composables/useAuth'
  import { toast } from '@/composables/useToast'
  
  const router = useRouter()
  const { register } = useAuth()
  
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const isLoading = ref(false)
  
  const handleEmailRegister = async () => {
    if (password.value !== confirmPassword.value) {
      toast({
        title: 'Registration Failed',
        description: 'Passwords do not match.',
        variant: 'destructive'
      })
      return
    }
  
    isLoading.value = true
    try {
      await register({ email: email.value, password: password.value })
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created. You can now log in.',
        variant: 'success'
      })
      router.push('/sys/login')
    } catch (error) {
      console.error('Registration failed:', error)
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration. Please try again.',
        variant: 'destructive'
      })
    } finally {
      isLoading.value = false
    }
  }
  
  const handleGoogleRegister = async () => {
    isLoading.value = true
    try {
      await register({ provider: 'google' })
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created with Google.',
        variant: 'success'
      })
      router.push('/')
    } catch (error) {
      console.error('Google registration failed:', error)
      toast({
        title: 'Google Registration Failed',
        description: error.message || 'An error occurred during Google registration. Please try again.',
        variant: 'destructive'
      })
    } finally {
      isLoading.value = false
    }
  }
  
  const handleGithubRegister = async () => {
    isLoading.value = true
    try {
      await register({ provider: 'github' })
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created with GitHub.',
        variant: 'success'
      })
      router.push('/')
    } catch (error) {
      console.error('GitHub registration failed:', error)
      toast({
        title: 'GitHub Registration Failed',
        description: error.message || 'An error occurred during GitHub registration. Please try again.',
        variant: 'destructive'
      })
    } finally {
      isLoading.value = false
    }
  }
  </script>