import axios from 'axios'

const API_URL = `${import.meta.env.API_URL}/api`

export const createBooking = async (bookingData) => {
  try {
    // ດຶງ Token ຈາກ localStorage (ປັບປຸງ Key ຕາມທີ່ ລະບົບ Login ຂອງທ່ານໃຊ້ ຕົວຢ່າງ 'token' ຫຼື 'access_token')
    const token = localStorage.getItem('user-token') || localStorage.getItem('token') || ''

    const response = await axios.post(
      `${API_URL}/booking/create/`, 
      bookingData, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('API Error (createBooking):', error)
    throw error
  }
}