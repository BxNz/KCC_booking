<template>
  <!-- ถ้าอยู่ที่หน้า /login ให้แสดง Component ของ LoginView ผ่าน router-view -->
  <router-view v-if="$route.path === '/login'" />

  <!-- ถ้าไม่ได้อยู่หน้า /login ให้แสดงหน้า Dashboard หลักตามปกติ -->
  <div v-else class="flex h-screen bg-slate-100 font-sans text-sm overflow-hidden antialiased">
    <!-- Sidebar Component -->
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0 font-sans">
      <!-- Navbar Component -->
      <Navbar @search="handleSearch" />

      <!-- Main Section ( Dashboard Content ) -->
      <main class="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
        <div>
          <!-- State 1: Loading -->
          <div v-if="loading" class="flex flex-col items-center justify-center h-64 text-slate-500">
            <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p class="text-sm font-medium text-slate-600">ກຳລັງເຊື່ອມຕໍ່ຖານຂໍ້ມູນ...</p>
          </div>

          <!-- State 2: Error -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl text-center max-w-lg mx-auto my-8 shadow-sm">
            <p class="font-bold text-base">ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້</p>
            <p class="text-xs text-red-500 mt-1">{{ error }}</p>
            <button @click="fetchRooms" class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition shadow-xs cursor-pointer">
              ລອງເຊື່ອມຕໍ່ອີກຄັ້ງ
            </button>
          </div>

          <!-- State 3: Room Grid -->
          <div v-else-if="paginatedRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div 
              v-for="room in paginatedRooms" 
              :key="room.id" 
              class="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <h2 class="font-bold text-slate-800 text-sm leading-snug">{{ room.name }}</h2>
                    <span class="inline-block mt-1 px-2 py-0.5 bg-slate-200/70 text-slate-600 rounded text-[10px] font-semibold">
                      ຊັ້ນ {{ room.floor }}
                    </span>
                  </div>
                  <span class="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-2xs">
                    👥 ຮອງຮັບໄດ້ {{ room.capacity }} ຄົນ
                  </span>
                </div>

                <div class="p-3 grid grid-cols-2 gap-2 border-b border-slate-100">
                  <button @click="openBookingModal(room)" class="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-2.5 rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                    จองห้อง
                  </button>
                  <button @click="viewBookings(room)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs py-2 px-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer">
                    รายการจอง
                  </button>
                </div>

                <div class="p-3 space-y-2 max-h-64 overflow-y-auto">
                  <div v-if="!room.bookings || room.bookings.length === 0" class="text-center py-6 text-xs text-slate-400">
                    ไม่มีรายการจองในขณะนี้
                  </div>
                  <div 
                    v-for="booking in room.bookings" 
                    :key="booking.id"
                    class="p-2.5 rounded-lg border text-[11px] transition"
                    :class="booking.isCurrent ? 'bg-rose-50/70 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200/80 text-slate-700'"
                  >
                    <div class="flex items-center justify-between font-medium">
                      <span class="truncate max-w-[120px]" :title="booking.user">{{ booking.code }} - {{ booking.user }}</span>
                      <span v-if="booking.isCurrent" class="px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded text-[9px] font-bold uppercase tracking-wider">กำลังใช้งาน</span>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                      {{ booking.time }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12 text-slate-400 text-xs">ບໍ່ພົບຂໍ້ມູນຫ້ອງປະຊຸມ</div>
        </div>

        <!-- Pagination Bar -->
        <div v-if="filteredRooms.length > 0" class="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div>ສະແດງ <span class="font-semibold text-slate-700">{{ startIndex }}-{{ endIndex }}</span> ຈາກ <span class="font-semibold text-slate-700">{{ filteredRooms.length }}</span> ລາຍການ</div>
          <div class="flex items-center gap-3">
            <span class="text-slate-400 font-medium">ໜ້າ <span class="text-slate-700 font-bold">{{ currentPage }}</span> / {{ totalPages }}</span>
            <div class="inline-flex rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
              <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40 border-r border-slate-200 transition cursor-pointer disabled:cursor-not-allowed">❮</button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed">❯</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

const $route = useRoute()

// State Management
const rooms = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(4)

const fetchRooms = async () => {
  loading.value = true
  error.value = null
  try {
    const token = localStorage.getItem('token') || ''
    const response = await axios.get('/api/my/bookings', {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    const rawData = response.data.data || response.data
    rooms.value = Array.isArray(rawData) ? mapApiDataToRooms(rawData) : []
  } catch (err) {
    console.error('API Fetch Error:', err)
    error.value = err.response?.data?.message || err.message || 'ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້'
  } finally {
    loading.value = false
  }
}

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

    roomGroup[roomId].bookings.push({
      id: item.booking_id || item.id,
      code: `BK${String(item.booking_id || item.id).padStart(5, '0')}`,
      user: item.description || item.user_name || item.created_by || 'ຜູ້ໃຊ້',
      time: timeFormatted,
      isCurrent: item.status === 'active' || item.priority === 'urgent'
    })
  })
  return Object.values(roomGroup)
}

const filteredRooms = computed(() => {
  if (!searchQuery.value) return rooms.value
  const query = searchQuery.value.toLowerCase()
  return rooms.value.filter(room => 
    room.name.toLowerCase().includes(query) || 
    room.bookings.some(b => b.user.toLowerCase().includes(query) || b.code.toLowerCase().includes(query))
  )
})

const totalPages = computed(() => Math.ceil(filteredRooms.value.length / itemsPerPage.value) || 1)
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredRooms.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => filteredRooms.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredRooms.value.length ? filteredRooms.value.length : end
})

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const handleSearch = (query) => { searchQuery.value = query; currentPage.value = 1 }
const openBookingModal = (room) => { alert(`ກົດຈອງຫ້ອງ: ${room.name}`) }
const viewBookings = (room) => { alert(`ເປີດເບິ່ງປະວັດການຈອງຫ້ອງ: ${room.name}`) }

onMounted(() => {
  if ($route.path !== '/login') {
    fetchRooms()
  }
})
</script>