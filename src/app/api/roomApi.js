import axios from 'axios'

// กำหนด Base URL และ Axios Instance
const api = axios.create({
  baseURL: 'http://115.84.105.127:9999',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 🛡️ แนบ Token อัตโนมัติทุกครั้งที่มีการ Request (ถ้ามีเก็บไว้ใน localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('user-token')
  if (token) {
    config.headers.Authorization = `token ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export const getMeetingRooms = async () => {
  try {
    const response = await api.get('/api/bookings')
    const data = response.data
    console.log("response.data",response.data)
    return data.map(item => ({
      id: item.id || item.room_id,
      name: item.name || item.room_name,
      capacity: item.capacity ? `ຮອງຮັບໄດ້ ${item.capacity} ຄົນ` : 'ບໍ່ລະບຸຈຳນວນ',
      bookings: item.bookings || item.reservations || []
    }))
  } catch (error) {
    console.error('API Fetch Error (getMeetingRooms):', error)
    throw error
  }
}

export default api