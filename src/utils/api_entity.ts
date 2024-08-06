// api_entity.ts

export interface LoginRequest {
    email: string
    password: string
  }
  
  export interface RegisterRequest {
    email: string
    password: string
    name: string
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
  }
  
  export interface LoginResponse {
    token: string
    user: User
  }
  
  export interface RegisterResponse {
    token: string
    user: User
  }
  
  export interface User {
    id: string
    email: string
    name: string
    profilePicture?: string
  }
  
  export interface UpdateProfileRequest {
    name?: string
    email?: string
    profilePicture?: string
  }
  
  export interface Prompt {
    id: string
    title: string
    description: string
  }
  
  export interface PromptDetail {
    id: string
    title: string
    content: string
    parameters: PromptParameter[]
  }
  
  export interface PromptParameter {
    name: string
    type: 'string' | 'number' | 'boolean' | 'select'
    required: boolean
    default?: any
    options?: string[] // For 'select' type
  }
  
  export interface RunPromptRequest {
    promptId: string
    parameters: Record<string, any>
    engine: string
    model: string
  }
  
  export interface RunPromptResponse {
    result: string
  }

  // SSO
  export interface SSOLoginRequest {
    provider: 'github' | 'google'
    code: string
  }
  
  export interface SSOLoginResponse {
    token: string
    user: User
    isNewUser: boolean
  }
  
  export interface SSOLinkRequest {
    provider: 'github' | 'google'
    code: string
  }
  
  export interface SSOLinkResponse {
    linked: boolean
    provider: 'github' | 'google'
  }
  
  export interface LinkedAccounts {
    github: boolean
    google: boolean
  }
  