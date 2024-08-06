// composables/useAuth.ts

import { ref, computed } from 'vue'
import { api } from '@/utils/api'
import { User, LoginRequest, RegisterRequest, UpdateProfileRequest, SSOLoginRequest, LinkedAccounts } from '@/utils/api_entity'

export function useAuth() {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const linkedAccounts = ref<LinkedAccounts>({ github: false, google: false })

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.login(credentials)
      user.value = response.user
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await api.register(userData)
      user.value = response.user
      return response
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.logout()
      user.value = null
      linkedAccounts.value = { github: false, google: false }
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const checkAuth = async () => {
    try {
      const currentUser = await api.getCurrentUser()
      user.value = currentUser
      await fetchLinkedAccounts()
    } catch (error) {
      console.error('Auth check failed:', error)
      user.value = null
    }
  }

  const updateProfile = async (profileData: UpdateProfileRequest) => {
    try {
      const updatedUser = await api.updateProfile(profileData)
      user.value = updatedUser
      return updatedUser
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.changePassword({ currentPassword, newPassword })
    } catch (error) {
      console.error('Password change failed:', error)
      throw error
    }
  }

  const ssoLogin = async (ssoData: SSOLoginRequest) => {
    try {
      const response = await api.ssoLogin(ssoData)
      user.value = response.user
      await fetchLinkedAccounts()
      return response
    } catch (error) {
      console.error('SSO login failed:', error)
      throw error
    }
  }

  const linkSSOAccount = async (provider: 'github' | 'google', code: string) => {
    try {
      const response = await api.ssoLink({ provider, code })
      await fetchLinkedAccounts()
      return response
    } catch (error) {
      console.error('SSO account linking failed:', error)
      throw error
    }
  }

  const unlinkSSOAccount = async (provider: 'github' | 'google') => {
    try {
      await api.ssoUnlink(provider)
      await fetchLinkedAccounts()
    } catch (error) {
      console.error('SSO account unlinking failed:', error)
      throw error
    }
  }

  const fetchLinkedAccounts = async () => {
    try {
      linkedAccounts.value = await api.getLinkedAccounts()
    } catch (error) {
      console.error('Fetching linked accounts failed:', error)
      linkedAccounts.value = { github: false, google: false }
    }
  }

  return {
    user,
    isAuthenticated,
    linkedAccounts,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    ssoLogin,
    linkSSOAccount,
    unlinkSSOAccount,
    fetchLinkedAccounts
  }
}

// Create a global instance
const globalAuth = useAuth()

// Export a Vue plugin
export const AuthPlugin = {
  install(app: any) {
    app.config.globalProperties.$auth = globalAuth
    app.provide('auth', globalAuth)
  }
}

// Export the global instance for Composition API usage
export { globalAuth as auth }