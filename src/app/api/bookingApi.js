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
  const bookings = normalizeCollection(response.data)
  return bookings.map(normalizeBooking)
}

/**
 * 3. ดึงรายการจองแบบกรองตาม Type ID (เช่น ?type_id=1)
 * Endpoint: GET /api/bookings?type_id=1
 */
export const getBookingsByType = async (typeId) => {
  const response = await api.get(`/api/bookings?type_id=${typeId}`)
  return normalizeCollection(response.data)
}

/**
 * 4. ดึงข้อมูลเหตุการณ์/รายละเอียดการจองตาม Booking ID (เช่น ?booking_id=2)
 * Endpoint: GET /api/booking/events?booking_id=2
 */
export const getBookingEvents = async (bookingId) => {
  const response = await api.get(`/api/booking/events?booking_id=${bookingId}`)
  return normalizeCollection(response.data).map(normalizeBooking)
}

const normalizeCollection = (response) => {
  if (Array.isArray(response)) return response

  const collection = response?.results || response?.data || response?.bookings || response?.events
  return Array.isArray(collection) ? collection : []
}

const normalizeBooking = (item) => ({
  ...item,
  id: item.id || item.booking_id || item.event_id,
  code: item.code || item.booking_code || item.reference || item.booking_id || '-',
  title: item.title || item.meeting_title || item.name || '-',
  room: item.room || item.room_name || item.item_name || item.item?.name || item.booking_name || '-',
  start_time: item.start_time || item.start_date || item.date_start || item.start || '-',
  end_time: item.end_time || item.stop_date || item.date_end || item.stop || '-',
  duration: item.duration || item.hours || calculateDuration(item.start, item.stop),
  requester: item.requester || item.username || item.user_name || item.created_by || item.driver_name || '-',
  department: item.department || item.department_name || item.rider_name || '-',
  status: item.status || item.state || item.priority || '-',
  description_text: htmlToText(item.description)
})

const htmlToText = (value) => {
  if (!value) return '-'
  if (typeof document === 'undefined') return String(value).replace(/<[^>]*>/g, '').trim() || '-'

  const container = document.createElement('div')
  container.innerHTML = String(value)
  return container.textContent?.trim() || '-'
}

const calculateDuration = (start, stop) => {
  if (!start || !stop) return '-'

  const duration = (new Date(stop) - new Date(start)) / (1000 * 60 * 60)
  return Number.isFinite(duration) ? `${duration} hr` : '-'
}

export default api