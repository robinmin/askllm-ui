<!-- Profile.vue -->
<template>
    <div class="container mx-auto px-4 py-8">
      <Card class="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>View and edit your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-8">
            <!-- Profile Picture Section -->
            <div class="flex items-center space-x-4">
              <Avatar class="w-20 h-20">
                <AvatarImage :src="profilePicture" alt="Profile picture" />
                <AvatarFallback>{{ userInitials }}</AvatarFallback>
              </Avatar>
              <Button @click="handleProfilePictureUpload">
                <Upload class="mr-2 h-4 w-4" />
                Change Picture
              </Button>
            </div>
  
            <!-- Personal Information Section -->
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="name">Name</Label>
                <Input id="name" v-model="name" placeholder="Your full name" />
              </div>
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input id="email" v-model="email" type="email" placeholder="Your email" :disabled="true" />
              </div>
            </div>
  
            <!-- Password Change Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Change Password</h3>
              <div class="space-y-2">
                <Label for="currentPassword">Current Password</Label>
                <Input id="currentPassword" v-model="currentPassword" type="password" />
              </div>
              <div class="space-y-2">
                <Label for="newPassword">New Password</Label>
                <Input id="newPassword" v-model="newPassword" type="password" />
              </div>
              <div class="space-y-2">
                <Label for="confirmNewPassword">Confirm New Password</Label>
                <Input id="confirmNewPassword" v-model="confirmNewPassword" type="password" />
              </div>
              <Button @click="changePassword" :disabled="isChangingPassword">
                <Loader2 v-if="isChangingPassword" class="mr-2 h-4 w-4 animate-spin" />
                {{ isChangingPassword ? 'Changing Password...' : 'Change Password' }}
              </Button>
            </div>
  
            <!-- Account Details Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Account Details</h3>
              <p><strong>Account Created:</strong> {{ accountCreatedDate }}</p>
              <p><strong>Last Login:</strong> {{ lastLoginDate }}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button @click="saveProfile" class="w-full" :disabled="isSavingProfile">
            <Loader2 v-if="isSavingProfile" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSavingProfile ? 'Saving...' : 'Save Changes' }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'

  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label } from '@/components/ui/'

  import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
  import { Loader2, Upload } from 'lucide-vue-next'
  import { useAuth } from '@/composables/useAuth'
  import { toast } from '@/composables/useToast'
  
  const { user, updateProfile, changePassword: authChangePassword } = useAuth()
  
  const name = ref(user.value?.name || '')
  const email = ref(user.value?.email || '')
  const profilePicture = ref(user.value?.profilePicture || '')
  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmNewPassword = ref('')
  
  const isChangingPassword = ref(false)
  const isSavingProfile = ref(false)
  
  const accountCreatedDate = computed(() => {
    return user.value?.createdAt ? new Date(user.value.createdAt).toLocaleDateString() : 'N/A'
  })
  
  const lastLoginDate = computed(() => {
    return user.value?.lastLogin ? new Date(user.value.lastLogin).toLocaleDateString() : 'N/A'
  })
  
  const userInitials = computed(() => {
    return name.value
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  })
  
  const handleProfilePictureUpload = () => {
    // Implement profile picture upload logic here
    // This could involve opening a file dialog and uploading the selected image
    console.log('Profile picture upload clicked')
  }
  
  const changePassword = async () => {
    if (newPassword.value !== confirmNewPassword.value) {
      toast({
        title: 'Password Change Failed',
        description: 'New passwords do not match.',
        variant: 'destructive'
      })
      return
    }
  
    isChangingPassword.value = true
    try {
      await authChangePassword(currentPassword.value, newPassword.value)
      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
        variant: 'success'
      })
      currentPassword.value = ''
      newPassword.value = ''
      confirmNewPassword.value = ''
    } catch (error) {
      console.error('Password change failed:', error)
      toast({
        title: 'Password Change Failed',
        description: error.message || 'An error occurred while changing your password. Please try again.',
        variant: 'destructive'
      })
    } finally {
      isChangingPassword.value = false
    }
  }
  
  const saveProfile = async () => {
    isSavingProfile.value = true
    try {
      await updateProfile({ name: name.value })
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success'
      })
    } catch (error) {
      console.error('Profile update failed:', error)
      toast({
        title: 'Profile Update Failed',
        description: error.message || 'An error occurred while updating your profile. Please try again.',
        variant: 'destructive'
      })
    } finally {
      isSavingProfile.value = false
    }
  }
  </script>