import { createRouter, createWebHistory } from 'vue-router'

// 1. เพิ่มบรรทัดนี้เพื่อ Import App.vue (เช็ก Path ให้ตรงกับที่เก็บไฟล์จริงของคุณ)
import App from '../app/App.vue' 
import LoginView from '../views/LoginView.vue' // หรือ '../viewe/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App, // 👈 เรียกใช้งาน App ตรงนี้
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresGuest && token) {
    next('/')
  } else {
    next()
  }
})

export default router