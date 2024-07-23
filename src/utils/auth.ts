const TOKEN_KEY = 'auth_token'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}