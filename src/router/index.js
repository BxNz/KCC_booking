import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import Logout from '../views/Logout.vue'
import ProfileView from '../views/ProfileView.vue'
import MeetingRooms from '../views/MeetingRoomsView.vue'
 import AddBooking from '../views/AddBookingModal.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView, 
    meta: { requiresAuth: true } // ຕ້ອງ Login ແລ້ວຈຶ່ງເຂົ້າໄດ້[cite: 1]
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true } // Login ແລ້ວຫ້າມເຂົ້ານີ້[cite: 1]
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/meeting-rooms/:id?', 
    name: 'MeetingRooms',
    component: MeetingRooms 
  },
  {
    path: '/booking/:id?', 
    name: 'book',
    component: AddBooking 
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

// Navigation Guard ตรวจสอบสิทธิ์ก่อนเปลี่ยนหน้า
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('user-token')

  if (to.meta.requiresAuth && !token) {
    next('/login') // ບໍ່ມີ Token -> ດີດໄປໜ້າ Login[cite: 1]
  } else if (to.meta.requiresGuest && token) {
    next('/') // ມີ Token ແລ້ວແຕ່ຢາກເຂົ້າ Login -> ດີດກັບໜ້າ Home[cite: 1]
  } else {
    next() // ຜ່ານໄດ້ປົກກະຕິ[cite: 1]
  }
})

export default router