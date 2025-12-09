import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
      // meta: { requiresAuth: true } // Home is now public
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/Register.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/Auth/ResetPassword.vue')
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/Editor.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: () => import('../views/PostDetail.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
