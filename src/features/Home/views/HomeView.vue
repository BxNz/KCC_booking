<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/app/components/Navbar.vue'
import Sidebar from '@/app/components/Sidebar.vue'
import AddBookingModal from '@/features/bookings/AddBookingModal.vue'
import { getMeetingRooms } from '@/app/api/roomApi.js' 

// ตัวแปรเก็บข้อมูลห้องประชุม
const rooms = ref([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const userName = ref(localStorage.getItem('username') || '')

// 🌟 State สำหรับควบคุมการเปิด-ปิด และเก็บข้อมูลห้องที่ถูกเลือกกดจอง
const isModalOpen = ref(false)
const currentRoom = ref(null)

// ฟังก์ชันดึงข้อมูลห้องประชุม
const fetchRoomsData = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    rooms.value = await getMeetingRooms()
  } catch (error) {
    console.error('API Fetch Error:', error)
    errorMessage.value = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ API ໄດ້, ກະລຸນາກວດສອບການເຊື່ອມຕໍ່'
    
    // ข้อมูลสำรอง (Fallback Data)
    rooms.value = [
      {
        id: 1,
        name: 'ຫ້ອງປະຊຸມໃຫຍ່ (Grand) ຊັ້ນ 1',
        capacity: 'ຮອງຮັບໄດ້ 24 ຄົນ',
        bookings: [
          { code: 'BK00214-ນ.ວັນສິນ ມິສະສີ', time: '14-09-2026 08:00 - 15-09-2026 12:00' },
          { code: 'BK00128-ນ.ຕາວອນ ປານະວົງ', time: '15-09-2025 14:00 - 17:00' }
        ]
      },
      {
        id: 2,
        name: 'ຫ້ອງປະຊຸມກາງ (Center) ຊັ້ນ 1',
        capacity: 'ຮອງຮັບໄດ້ 11 ຄົນ',
        bookings: [
          { code: 'BK00210-ນ.ວັນສິນ ມິສະສີ', time: '14-09-2026 08:00 - 15-09-2026 18:00' }
        ]
      },
      {
        id: 3,
        name: 'ຫ້ອງປະຊຸມຮອງ (Green) ຊັ້ນ 3',
        capacity: 'ຮອງຮັບໄດ້ 6 ຄົນ',
        bookings: [
          { code: 'BK00217-ນ.ສັນທະວອນ ປາດາກະສາດ', time: '14-09-2026 10:00 - 11:30' }
        ]
      },
      {
        id: 4,
        name: 'ຫ້ອງປະຊຸມສັ້ນ (Orange) ຊັ້ນ 3',
        capacity: 'ຮອງຮັບໄດ້ 6 ຄົນ',
        bookings: [
          { code: 'BK00212-ນ.ວິໄລກອນ ສີທະລາດ', time: '14-09-2026 08:00 - 12:00' }
        ]
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRoomsData()
})

// รับค่าคำค้นหาจาก Navbar
const handleSearch = (keyword) => {
  searchQuery.value = keyword
}

// กรองข้อมูลห้องประชุมตามคำค้นหา
const filteredRooms = computed(() => {
  if (!searchQuery.value) return rooms.value
  const query = searchQuery.value.toLowerCase()
  return rooms.value.filter(room => {
    const matchRoom = room.name?.toLowerCase().includes(query)
    const matchBooking = room.bookings?.some(b => b.code?.toLowerCase().includes(query))
    return matchRoom || matchBooking
  })
})

const totalBookings = computed(() => rooms.value.reduce((total, room) => total + (room.bookings?.length || 0), 0))
const availableRooms = computed(() => rooms.value.filter(room => room.state === 'available').length)

// 🌟 ฟังก์ชันเปิด Modal จองห้อง (แทนที่การใช้ router-link แบบเดิม)
const openBookingModal = (room) => {
  currentRoom.value = room
  isModalOpen.value = true
}

// 🌟 ฟังก์ชันปิด Modal
const closeBookingModal = () => {
  isModalOpen.value = false
  currentRoom.value = null
}

// 🌟 ฟังก์ชันกดบันทึกข้อมูลจาก Modal
const handleSaveBooking = (bookingData) => {
  console.log('Successfully saved booking data:', bookingData)
  // TODO: เขียนโค้ดส่งข้อมูล API บันทึกการจองที่นี่
  closeBookingModal()
}

const handleViewBookings = (room) => {
  alert(`ເບິ່ງປະຫວັດການຈອງທັງໝົດຂອງ: ${room.name}`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex font-sans text-slate-800 overflow-hidden relative">
    <!-- Sidebar Component -->
    <Sidebar />

    <!-- Main Content Layout -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Navbar Component -->
      <Navbar @search="handleSearch" />

      <!-- Scrollable Content Area -->
      <main class="flex-1 overflow-y-auto bg-slate-50 p-8">
        <!-- Breadcrumb & Header info -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            ສະແດງທັງໝົດ: <strong class="text-slate-700">{{ filteredRooms.length }}</strong> ຫ້ອງ
          </div>
        </div>

        <!-- Notification Banner ถ้าเชื่อม API ไม่ผ่าน -->
        <div v-if="errorMessage" class="mb-6 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <span>⚠️ {{ errorMessage }} (ກຳລັງສະແດງຂໍ້ມູນຕົວຢ່າງ)</span>
          <button @click="fetchRoomsData" class="underline font-bold cursor-pointer">ລອງໃໝ່</button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-24">
          <div class="flex flex-col items-center space-y-3">
            <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs text-slate-500 font-medium">กำลังโหลดข้อมูลห้องประชุม...</p>
          </div>
        </div>

       <!-- Room Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-12">
          <div 
            v-for="room in filteredRooms" 
            :key="room.id"
            class="bg-white rounded-2xl shadow-xs hover:shadow-xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 group"
          >
            <!-- Card Header -->
            <div class="bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 border-b border-slate-100 flex flex-col">
              <h3 class="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors line-clamp-1" :title="room.name">
                {{ room.name }}
              </h3>
              <div class="flex items-center gap-2 mt-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  ຮອງຮັບໄດ້ {{ room.capacity || '-' }} ຄົນ
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="room.state === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'">
                  {{ room.state === 'available' ? 'ວ່າງ' : room.state }}
                </span>
              </div>
              <p v-if="room.typeName" class="mt-2 text-[11px] text-slate-400">{{ room.typeName }}</p>

              <!-- Action Buttons -->
              <div class="grid grid-cols-2 gap-2 mt-4">
                <!-- 🌟 เปลี่ยนจาก router-link เป็นปุ่มกดเรียกใช้ Modal แทน -->
                <button 
                  @click="openBookingModal(room)" 
                  class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition shadow-sm shadow-blue-600/20 cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span>ຈອງຫ້ອງ</span>
                </button>

                <!-- ปุ่มประวัติ -->
                <router-link 
                  :to="{ path: '/meeting-rooms', query: { roomId: room.id, roomName: room.name } }"
                  class="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer no-underline"
                >
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <span>ປະຫວັດ</span>
                </router-link>
              </div>
            </div>

            <!-- Bookings List Inside Room -->
            <div class="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-2.5 bg-white">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">ລາຍການຈອງລ່ວງໜ້າ</p>
              
              <div 
                v-for="(booking, index) in room.bookings" 
                :key="index"
                class="p-2.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-100 transition text-xs flex flex-col space-y-1"
              >
                <div class="font-bold text-rose-600 flex items-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 shrink-0"></span>
                  <span class="truncate" :title="booking.code">{{ booking.code }}</span>
                </div>
                <div class="text-slate-500 pl-3.5 text-[11px]">
                  <span>{{ booking.time }}</span>
                </div>
              </div>

              <!-- Empty Bookings State -->
              <div v-if="!room.bookings || room.bookings.length === 0" class="text-center py-8 text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p>ຍັງບໍ່ມີການຈອງໃນຂະນະນີ້</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 🌟 2. แสดง AddBookingModal แบบ Dialog ทับหน้า Dashboard เมื่อมีการคลิกปุ่มจອງຫ້ອງ -->
    <AddBookingModal 
      v-if="isModalOpen" 
      :room="currentRoom"
      @close="closeBookingModal"
      @save="handleSaveBooking"
    />
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>