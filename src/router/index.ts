import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import api from '../utils/api'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/auth/google/callback',
      name: 'googleCallback',
      component: {
        template: '<div>Processing login...</div>',
        async beforeRouteEnter(to, _from, next) {
          const code = to.query.code as string | undefined
          if (code) {
            try {
              const response = await api.handleGoogleCallback(code)
              const authStore = useAuthStore()
              authStore.user = response.data.user
              authStore.token = response.data.token
              localStorage.setItem('token', authStore.token || "")
              next('/')
            } catch (error) {
              console.error('Google login error:', error)
              next('/login')
            }
          } else {
            next('/login')
          }
        }
      }
    },
    {
      path: '/auth/github/callback',
      name: 'githubCallback',
      component: {
        template: '<div>Processing login...</div>',
        async beforeRouteEnter(to, _from, next) {
          const code = to.query.code as string | undefined
          if (code) {
            try {
              const response = await api.handleGithubCallback(code)
              const authStore = useAuthStore()
              authStore.user = response.data.user
              authStore.token = response.data.token
              localStorage.setItem('token', authStore.token || "")
              next('/')
            } catch (error) {
              console.error('GitHub login error:', error)
              next('/login')
            }
          } else {
            next('/login')
          }
        }
      }
    }
  ]
})

export default router
