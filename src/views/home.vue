<template>
  <div class="flex h-screen bg-slate-100 font-sans text-sm overflow-hidden antialiased">
    <!-- Sidebar Component -->
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0 font-sans">
      <!-- Navbar Component -->
      <Navbar @search="handleSearch" />

      <!-- Main Section -->
      <main class="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
        <div>
          <!-- State 1: ກຳລັງໂຫຼດຂໍ້ມູນ (Loading) -->
          <div v-if="loading" class="flex flex-col items-center justify-center h-64 text-slate-500">
            <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p class="text-sm font-medium text-slate-600">ກຳລັງເຊື່ອມຕໍ່ຖານຂໍ້ມູນ...</p>
          </div>

          <!-- State 2: ເກີດຂໍ້ຜິດພາດ (Error) -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl text-center max-w-lg mx-auto my-8 shadow-sm">
            <p class="font-bold text-base">ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້</p>
            <p class="text-xs text-red-500 mt-1">{{ error }}</p>
            <button @click="fetchRooms" class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition shadow-xs cursor-pointer">
              ລອງເຊື່ອມຕໍ່ອີກຄັ້ງ
            </button>
          </div>

          <!-- State 3: ສະແດງຂໍ້ມູນຫ້ອງປະຊຸມ (Room Grid) -->
          <div v-else-if="paginatedRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div 
              v-for="room in paginatedRooms" 
              :key="room.id" 
              class="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <!-- Card Header -->
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <h2 class="font-bold text-slate-800 text-sm leading-snug">
                      {{ room.name }}
                    </h2>
                    <span class="inline-block mt-1 px-2 py-0.5 bg-slate-200/70 text-slate-600 rounded text-[10px] font-semibold">
                      ຊັ້ນ {{ room.floor }}
                    </span>
                  </div>
                  <span class="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-2xs">
                    👥 ຮອງຮັບໄດ້ {{ room.capacity }} ຄົນ
                  </span>
                </div>

                <!-- Action Buttons -->
                <div class="p-3 grid grid-cols-2 gap-2 border-b border-slate-100">
                  <button 
                    @click="openBookingModal(room)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-2.5 rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    ຈອງຫ້ອງ
                  </button>
                  <button 
                    @click="viewBookings(room)"
                    class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs py-2 px-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                    ລາຍການຈອງ
                  </button>
                </div>

                <!-- Booking List -->
                <div class="p-3 space-y-2 max-h-64 overflow-y-auto">
                  <div v-if="!room.bookings || room.bookings.length === 0" class="text-center py-6 text-xs text-slate-400">
                    ບໍ່ມີລາຍການຈອງໃນຂະນະນີ້
                  </div>
                  
                  <div 
                    v-for="booking in room.bookings" 
                    :key="booking.id"
                    class="p-2.5 rounded-lg border text-[11px] transition"
                    :class="booking.isCurrent 
                      ? 'bg-rose-50/70 border-rose-200 text-rose-800' 
                      : 'bg-slate-50 border-slate-200/80 text-slate-700'"
                  >
                    <div class="flex items-center justify-between font-medium">
                      <span class="truncate max-w-[120px]" :title="booking.user">
                        {{ booking.code }} - {{ booking.user }}
                      </span>
                      <span 
                        v-if="booking.isCurrent" 
                        class="px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded text-[9px] font-bold uppercase tracking-wider"
                      >
                        ກຳລັງນຳໃຊ້
                      </span>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {{ booking.time }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ກໍລະນີຄົ້ນຫາແລ້ວບໍ່ພົບຂໍ້ມູນ -->
          <div v-else class="text-center py-12 text-slate-400 text-xs">
            ບໍ່ພົບຂໍ້ມູນຫ້ອງປະຊຸມ
          </div>
        </div>

        <!-- Pagination Bar ດ້ານລຸ່ມສຸດ -->
        <div v-if="filteredRooms.length > 0" class="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div>
            ສະແດງ <span class="font-semibold text-slate-700">{{ startIndex }}-{{ endIndex }}</span> ຈາກ <span class="font-semibold text-slate-700">{{ filteredRooms.length }}</span> ລາຍການ
          </div>

          <div class="flex items-center gap-3">
            <span class="text-slate-400 font-medium">
              ໜ້າ <span class="text-slate-700 font-bold">{{ currentPage }}</span> / {{ totalPages }}
            </span>

            <div class="inline-flex rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="px-3 py-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-white border-r border-slate-200 transition flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                title="ໜ້າກ່ອນໜ້າ"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>

              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                title="ໜ້າຖັດໄປ"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

// State Management
const rooms = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(4)

// ຟັງຊັນດຶງຂໍ້ມູນຈາກ API ຜ່ານ Vite Proxy (/api/my/bookings)
const fetchRooms = async () => {
  loading.value = true
  error.value = null
  try {
    const token = localStorage.getItem('user-token') || '' // ດຶງ Token
    
    // ໃຊ້ Relative Path ຜ່ານ Vite Proxy ເພື່ອປ້ອງກັນ CORS Network Error
    const response = await axios.get('/api/my/bookings', {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })

    const rawData = response.data.data || response.data
    
    if (Array.isArray(rawData)) {
      rooms.value = mapApiDataToRooms(rawData)
    } else {
      rooms.value = []
    }
  } catch (err) {
    console.error('API Fetch Error:', err)
    error.value = err.response?.data?.message || err.message || 'ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້'
  } finally {
    loading.value = false
  }
}

// ຟັງຊັນແປງຂໍ້ມູນ ແລະ ຈັດກຸ່ມລາຍການຈອງ ແຍກຕາມຫ້ອງປະຊຸມ (Room)
const mapApiDataToRooms = (bookingsList) => {
  const roomGroup = {}

  bookingsList.forEach((item) => {
    const roomId = item.room_id || item.room?.id || 1
    const roomName = item.room_name || item.room?.name || `ຫ້ອງປະຊຸມ ${roomId}`
    const roomFloor = item.floor || item.room?.floor || '1'
    const roomCapacity = item.capacity || item.room?.capacity || '-'

    if (!roomGroup[roomId]) {
      roomGroup[roomId] = {
        id: roomId,
        name: roomName,
        floor: roomFloor,
        capacity: roomCapacity,
        bookings: []
      }
    }

    const startDate = item.start_date || ''
    const startTime = item.start_time ? item.start_time.substring(0, 5) : ''
    const stopDate = item.stop_date || ''
    const stopTime = item.stop_time ? item.stop_time.substring(0, 5) : ''

    const timeFormatted = startDate === stopDate 
      ? `${startDate} ${startTime} - ${stopTime}`
      : `${startDate} ${startTime} - ${stopDate} ${stopTime}`

    const isCurrentBooking = item.status === 'active' || item.priority === 'urgent'

    roomGroup[roomId].bookings.push({
      id: item.booking_id || item.id,
      code: `BK${String(item.booking_id || item.id).padStart(5, '0')}`,
      user: item.description || item.user_name || item.created_by || 'ຜູ້ໃຊ້',
      time: timeFormatted,
      isCurrent: isCurrentBooking
    })
  })

  return Object.values(roomGroup)
}

// Filter ຄົ້ນຫາ
const filteredRooms = computed(() => {
  if (!searchQuery.value) return rooms.value
  const query = searchQuery.value.toLowerCase()
  return rooms.value.filter(room => 
    room.name.toLowerCase().includes(query) || 
    room.bookings.some(b => b.user.toLowerCase().includes(query) || b.code.toLowerCase().includes(query))
  )
})

// Pagination Computeds
const totalPages = computed(() => {
  return Math.ceil(filteredRooms.value.length / itemsPerPage.value) || 1
})

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRooms.value.slice(start, end)
})

const startIndex = computed(() => {
  if (filteredRooms.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredRooms.value.length ? filteredRooms.value.length : end
})

// Pagination Actions
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}

const openBookingModal = (room) => {
  alert(`ກົດຈອງຫ້ອງ: ${room.name}`)
}

const viewBookings = (room) => {
  alert(`ເປີດເບິ່ງປະວັດການຈອງຫ້ອງ: ${room.name}`)
}

onMounted(() => {
  fetchRooms()
})
</script>