import axios, { AxiosInstance, AxiosResponse } from 'axios'

class Api {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.example.com',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  async login(email: string, password: string): Promise<AxiosResponse> {
    return this.axiosInstance.post('/auth/login', { email, password })
  }

  async register(email: string, password: string): Promise<AxiosResponse> {
    return this.axiosInstance.post('/auth/register', { email, password })
  }

  async loginWithGoogle(): Promise<void> {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
      client_id=YOUR_GOOGLE_CLIENT_ID&
      redirect_uri=${encodeURIComponent('http://localhost:3000/auth/google/callback')}&
      response_type=code&
      scope=email profile`
    
    window.location.href = googleAuthUrl
    // The response will be handled in the callback route
  }

  async loginWithGithub(): Promise<void> {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?
      client_id=YOUR_GITHUB_CLIENT_ID&
      redirect_uri=${encodeURIComponent('http://localhost:3000/auth/github/callback')}`
    
    window.location.href = githubAuthUrl
    // The response will be handled in the callback route
  }

  async handleGoogleCallback(code: string): Promise<AxiosResponse> {
    return this.axiosInstance.post('/auth/google/callback', { code })
  }

  async handleGithubCallback(code: string): Promise<AxiosResponse> {
    return this.axiosInstance.post('/auth/github/callback', { code })
  }

  // ... other methods
}

export default new Api()