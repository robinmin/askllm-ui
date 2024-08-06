import config from '@/config'

export const getToken = (): string | null => {
  return localStorage.getItem(config.TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(config.TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(config.TOKEN_KEY)
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

export default { getToken, setToken, removeToken, isAuthenticated, decodeToken }
