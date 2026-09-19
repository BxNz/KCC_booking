import axios from 'axios'

// กำหนด Base URL และ Axios Instance
const api = axios.create({
  baseURL: import.meta.env.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 🛡️ แนบ Token อัตโนมัติทุกครั้งที่มีการ Request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user-token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

/**
 * 1. ดึงประเภทการจอง / ประเภทห้อง
 * Endpoint: GET /api/booking/types
 */
export const getBookingTypes = async () => {
  const response = await api.get('/api/booking/types')
  return response.data
}

/**
 * 2. ดึงรายการจองทั้งหมด
 * Endpoint: GET /api/bookings
 */
export const getMeetingBookings = async () => {
  const response = await api.get('/api/bookings')
  return response.data
}

/**
 * 3. ดึงรายการจองแบบกรองตาม Type ID (เช่น ?type_id=1)
 * Endpoint: GET /api/bookings?type_id=1
 */
export const getBookingsByType = async (typeId) => {
  const response = await api.get(`/api/bookings?type_id=${typeId}`)
  return response.data
}

/**
 * 4. ดึงข้อมูลเหตุการณ์/รายละเอียดการจองตาม Booking ID (เช่น ?booking_id=2)
 * Endpoint: GET /api/booking/events?booking_id=2
 */
export const getBookingEvents = async (bookingId) => {
  const response = await api.get(`/api/booking/events?booking_id=${bookingId}`)
  return response.data
}

export default api