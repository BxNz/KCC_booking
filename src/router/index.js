import { createRouter, createWebHistory } from 'vue-router'

import App from '../app/App.vue' 
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: App, 
    meta: { requiresAuth: true } // 1. กำหนดว่าหน้านี้ต้องเข้าสู่ระบบถึงจะดูได้
   },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true } // 2. กำหนดว่าถ้าล็อกอินแล้ว ห้ามเข้าหน้านี้
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../views/Logout.vue')
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

// Navigation Guard สำหรับตรวจสอบสิทธิ์
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('user-token')

  // ถ้าหน้าที่จะไปต้องล็อกอิน แต่ไม่มี Token -> ดีดไปหน้า Login ทันที
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } 
  // ถ้าเป็นหน้าสำหรับแขก (เช่น Login) แต่มี Token อยู่แล้ว -> ดีดกลับหน้าแรก
  else if (to.meta.requiresGuest && token) {
    next('/')
  } 
  // กรณีอื่นๆ ปล่อยผ่านให้ทำงานปกติ (รวมถึงหน้า /logout ด้วย)
  else {
    next()
  }
})

export default router