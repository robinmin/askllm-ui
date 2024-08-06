import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import config from '@/config'

import { getToken } from '../utils/auth'

import { toast } from '@/composables/useToast'

import {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  LoginResponse,
  RegisterResponse,
  User,
  UpdateProfileRequest,
  Prompt,
  PromptDetail,
  RunPromptRequest,
  RunPromptResponse,
  SSOLoginRequest,
  SSOLoginResponse,
  SSOLinkRequest,
  SSOLinkResponse,
  LinkedAccounts,
} from './api_entity'

class Api {
  private axiosInstance: AxiosInstance
  private showToasts: boolean

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.showToasts = true // Default to showing toasts

    this.axiosInstance.interceptors.request.use((config) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (this.showToasts) {
          this.handleErrorWithToast(error)
        }
        return Promise.reject(error)
      }
    )
  }

  private handleErrorWithToast(error: AxiosError) {
    const statusCode = error.response?.status
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred'

    let title = 'Error'
    let description = errorMessage
    description += "\n\n on URL : " + (error.config?.url ?? 'Unknown URL')

    switch (statusCode) {
      case 400:
        title = 'Bad Request - 400'
        break
      case 401:
        title = 'Unauthorized - 401'
        break
      case 403:
        title = 'Forbidden - 403'
        break
      case 404:
        title = 'Not Found - 404'
        break
      case 500:
        title = 'Server Error - 500'
        break
      default:
        title = 'Error - ' + (statusCode?.toString() ?? 'Unknown')
    }

    toast.addToast({
      title,
      description,
      variant: 'destructive'
    })
  }

  setShowToasts(show: boolean) {
    this.showToasts = show
  }

  // Add a method to make requests with toast notifications turned off
  async silentRequest<T>(method: string, url: string, data?: any): Promise<T> {
    const originalShowToasts = this.showToasts
    this.showToasts = false
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url,
        data
      })
      return response.data
    } finally {
      this.showToasts = originalShowToasts
    }
  }
  
  // async loginWithGoogle(): Promise<void> {
  //   const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(config.BASE_URL + '/auth/google/callback')}&response_type=code&scope=email profile`
    
  //   window.location.href = googleAuthUrl
  //   // The response will be handled in the callback route
  // }

  // async loginWithGithub(): Promise<void> {
  //   const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(config.BASE_URL + '/auth/github/callback')}`
    
  //   window.location.href = githubAuthUrl
  //   // The response will be handled in the callback route
  // }

  // async handleGoogleCallback(code: string): Promise<AxiosResponse> {
  //   return this.axiosInstance.post('/auth/google/callback', { code })
  // }

  // async handleGithubCallback(code: string): Promise<AxiosResponse> {
  //   return this.axiosInstance.post('/auth/github/callback', { code })
  // }

  // ... other methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.axiosInstance.post<LoginResponse>('/api/auth/login', credentials)
    localStorage.setItem('token', response.data.token)
    return response.data
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.axiosInstance.post<RegisterResponse>('/api/auth/register', userData)
    localStorage.setItem('token', response.data.token)
    return response.data
  }

  async logout(): Promise<void> {
    await this.axiosInstance.post('/api/auth/logout')
    localStorage.removeItem('token')
  }

  // SSO Auth APIs
  async ssoLogin(ssoData: SSOLoginRequest): Promise<SSOLoginResponse> {
    const response = await this.axiosInstance.post<SSOLoginResponse>('/api/auth/sso/login', ssoData)
    localStorage.setItem('token', response.data.token)
    return response.data
  }

  async ssoLink(ssoData: SSOLinkRequest): Promise<SSOLinkResponse> {
    const response = await this.axiosInstance.post<SSOLinkResponse>('/api/auth/sso/link', ssoData)
    return response.data
  }

  async ssoUnlink(provider: 'github' | 'google'): Promise<void> {
    await this.axiosInstance.post(`/api/auth/sso/unlink/${provider}`)
  }

  async getLinkedAccounts(): Promise<LinkedAccounts> {
    const response = await this.axiosInstance.get<LinkedAccounts>('/api/auth/linked-accounts')
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.axiosInstance.get<User>('/api/auth/user')
    return response.data
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    const response = await this.axiosInstance.put<User>('/api/auth/profile', profileData)
    return response.data
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    await this.axiosInstance.put('/api/auth/change-password', passwordData)
  }

  // Prompt APIs
  async getPrompts(): Promise<Prompt[]> {
    const response = await this.axiosInstance.get<Prompt[]>('/api/prompts')
    return response.data
  }

  async getPromptDetail(promptId: string): Promise<PromptDetail> {
    const response = await this.axiosInstance.get<PromptDetail>(`/api/prompts/${promptId}`)
    return response.data
  }

  async runPrompt(runPromptData: RunPromptRequest): Promise<RunPromptResponse> {
    const response = await this.axiosInstance.post<RunPromptResponse>('/api/run-prompt', runPromptData)
    return response.data
  }

  // Additional potential APIs
  async getSavedPrompts(): Promise<Prompt[]> {
    const response = await this.axiosInstance.get<Prompt[]>('/api/saved-prompts')
    return response.data
  }

  async savePrompt(promptId: string): Promise<void> {
    await this.axiosInstance.post(`/api/saved-prompts/${promptId}`)
  }

  async unsavePrompt(promptId: string): Promise<void> {
    await this.axiosInstance.delete(`/api/saved-prompts/${promptId}`)
  }

  async getUsageHistory(): Promise<any[]> { // Define a proper type for usage history
    const response = await this.axiosInstance.get<any[]>('/api/usage-history')
    return response.data
  }

  async getFAQs(): Promise<any[]> { // Define a proper type for FAQs
    const response = await this.axiosInstance.get<any[]>('/api/faqs')
    return response.data
  }
}

// Create and export a single instance of Api
export const api = new Api()
