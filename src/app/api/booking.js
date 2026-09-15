import axios from 'axios'

// กำหนด Base URL และ Axios Instance
const api = axios.create({
  baseURL: 'http://10.0.200.103:8018/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor สำหรับแนบ Token ใน Header อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// 1. ดึงประเภทการจอง (GET /booking/types)
export const getBookingTypes = async () => {
  const response = await api.get('/booking/types')
  return response.data
}

// 2. ดึงรายการจองทั้งหมด หรือกรองตาม type_id (GET /bookings?type_id=1)
export const getBookings = async (typeId = null) => {
  const params = typeId ? { type_id: typeId } : {}
  const response = await api.get('/bookings', { params })
  return response.data
}

// 3. ดึง Event ของการจองตาม booking_id (GET /booking/events?booking_id=2)
export const getBookingEvents = async (bookingId) => {
  const response = await api.get('/booking/events', {
    params: { booking_id: bookingId }
  })
  return response.data
}

// 4. ดูรายละเอียดการจองแบบระบุ Body (GET /booking/detail)
// หมายเหตุ: โดยทั่วไป GET Method ไม่นิยมใส่ Body แต่อ้างอิงตาม API Spec ของคุณจะใช้ data ใน config
export const getBookingDetail = async (bookingId) => {
  const response = await api.get('/booking/detail', {
    data: { booking_id: bookingId }
  })
  return response.data
}

// 5. สร้างการจองใหม่ (POST /booking/create/)
export const createBooking = async (bookingData) => {
  // bookingData ควรมี: { item_id, start_date, stop_date, start_time, stop_time, priority, description }
  const response = await api.post('/booking/create/', bookingData)
  return response.data
}

// 6. แก้ไขข้อมูลการจอง (POST /booking/update)
export const updateBooking = async (bookingData) => {
  // bookingData ควรมี: { booking_id, start_date, stop_date, start_time, stop_time, priority, description }
  const response = await api.post('/booking/update', bookingData)
  return response.data
}

// 7. ลบรายการจอง (POST /booking/delete)
export const deleteBooking = async (bookingId) => {
  const response = await api.post('/booking/delete', {
    booking_id: bookingId
  })
  return response.data
}

// 8. ดึงรายการจองของฉัน (GET /my/bookings)
export const getMyBookings = async () => {
  const response = await api.get('/my/bookings')
  return response.data
}