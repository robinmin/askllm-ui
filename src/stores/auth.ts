import { defineStore } from 'pinia'
import api from '../utils/api'

interface User {
  id: string
  email: string
}

interface AuthError {
  message: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token'),
    error: null as AuthError | null,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.login(email, password)
        this.user = response.data.user
        this.token = response.data.token
        localStorage.setItem('token', this.token || "")
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },
    async register(email: string, password: string) {
      try {
        const response = await api.register(email, password)
        this.user = response.data.user
        this.token = response.data.token
        localStorage.setItem('token', this.token || "")
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      this.error = null
    },
    handleError(error: unknown) {
      console.error('Authentication error:', error)
      if (error instanceof Error) {
        this.error = { message: error.message }
      } else {
        this.error = { message: 'An unknown error occurred' }
      }
    },
    async loginWithGoogle() {
      try {
        const response = await api.loginWithGoogle()
        console.log(response)
        // this.user = response.user
        // this.token = response.token
        // localStorage.setItem('token', this.token || "")
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },
    async loginWithGithub() {
      try {
        const response = await api.loginWithGithub()
        console.log(response)
        // this.user = response.user
        // this.token = response.token
        // localStorage.setItem('token', this.token || "")
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    }
  }
})