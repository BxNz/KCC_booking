import axios from 'axios'

const API_URL = 'http://115.84.105.127:9999/api'

export const createBooking = async (bookingData) => {
  try {
    // ດຶງ Token ຈາກ localStorage (ປັບປຸງ Key ຕາມທີ່ ລະບົບ Login ຂອງທ່ານໃຊ້ ຕົວຢ່າງ 'token' ຫຼື 'access_token')
    const token = localStorage.getItem('token') || ''

    const response = await axios.post(
      `${API_URL}/booking/create/`, 
      bookingData, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${token}` // 👈 ສົ່ງ Header Authorization ຕາມທີ່ API ຕ້ອງການ
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('API Error (createBooking):', error)
    throw error
  }
}