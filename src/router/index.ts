import { createRouter, createWebHistory } from 'vue-router'

// import api from '../utils/api'
// import { setToken } from '../utils/auth'
// import { useAuthStore } from '../stores/auth'

import config from '@/config'

import { auth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(config.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue')
    },
    {
      path: '/sys/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue')
    },
    {
      path: '/sys/register',
      name: 'register',
      component: () => import('../pages/RegisterPage.vue')
    },
    {
      path: '/sys/profile',
      name: 'profile',
      component: () => import('../pages/ProfilePage.vue')
    },

    // {
    //   path: '/auth/google/callback',
    //   name: 'googleCallback',
    //   component: {
    //     template: '<div>Processing login...</div>',
    //     async beforeRouteEnter(to, _from, next) {
    //       const code = to.query.code as string | undefined
    //       if (code) {
    //         try {
    //           const response = await api.handleGoogleCallback(code)
    //           const authStore = useAuthStore()
    //           authStore.user = response.data.user
    //           authStore.token = response.data.token
    //           setToken(authStore.token || "")
    //           next('/')
    //         } catch (error) {
    //           console.error('Google login error:', error)
    //           next('/sys/login')
    //         }
    //       } else {
    //         next('/sys/login')
    //       }
    //     }
    //   }
    // },
    // {
    //   path: '/auth/github/callback',
    //   name: 'githubCallback',
    //   component: {
    //     template: '<div>Processing login...</div>',
    //     async beforeRouteEnter(to, _from, next) {
    //       const code = to.query.code as string | undefined
    //       if (code) {
    //         try {
    //           const response = await api.handleGithubCallback(code)
    //           const authStore = useAuthStore()
    //           authStore.user = response.data.user
    //           authStore.token = response.data.token
    //           setToken(authStore.token || "")
    //           next('/')
    //         } catch (error) {
    //           console.error('GitHub login error:', error)
    //           next('/sys/login')
    //         }
    //       } else {
    //         next('/sys/login')
    //       }
    //     }
    //   }
    // }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    next('/sys/login')
  } else {
    next()
  }
})

export default router
