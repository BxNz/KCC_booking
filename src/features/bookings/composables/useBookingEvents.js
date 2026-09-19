import { computed, ref } from 'vue'
import { fetchBookings } from '../services/bookingService'

export const useBookingEvents = (selectedRoomId, selectedRoomName) => {
  const bookings = ref([])
  const loading = ref(true)
  const errorMessage = ref('')
  const searchQuery = ref('')

  const loadBookings = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
      bookings.value = selectedRoomId.value
        ? await fetchBookings(selectedRoomId.value)
        : []
      console.groupCollapsed('[BookingEvents] Loaded data')
      console.log('Rows:', bookings.value)
      console.log('First row keys:', Object.keys(bookings.value[0] || {}))
      console.log('Selected room ID:', selectedRoomId.value || '(none)')
      console.log('Selected room:', selectedRoomName.value || '(none)')
      console.groupEnd()
    } catch (error) {
      errorMessage.value = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ API ໄດ້, ກຳລັງສະແດງຂໍ້ມູນຕົວຢ່າງ'
      throw error
    } finally {
      loading.value = false
    }
  }

  const filteredBookings = computed(() => {
    let result = bookings.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(item => [
        item.code,
        item.title,
        item.requester,
        item.department,
        item.room
      ].some(value => value?.toLowerCase().includes(query)))
    }

    console.log('[BookingEvents] Filtered rows:', result.length)
    return result
  })

  return {
    bookings,
    loading,
    errorMessage,
    searchQuery,
    filteredBookings,
    loadBookings
  }
}
