<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router' //  นำเข้า useRoute สำหรับรับค่า Query จาก URL
import Navbar from '@/app/components/Navbar.vue'
import Sidebar from '@/app/components/Sidebar.vue'
import { getMeetingBookings } from '@/app/api/bookingApi.js'

const route = useRoute() //  เรียกใช้งาน route

// ตัวแปรเก็บข้อมูลการจองห้องประชุม
const bookings = ref([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')

// ตัวแปรเก็บข้อมูลห้องที่ถูกเลือกส่งมาจากหน้าอื่น
const selectedRoomId = ref(null)
const selectedRoomName = ref('')

// ฟังก์ชันดึงข้อมูลจาก API
const fetchBookingsData = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    // 🌐 เรียกใช้งานผ่านไฟล์ API แยก
    const data = await getMeetingBookings()
    bookings.value = data

  } catch (error) {
    errorMessage.value = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ API ໄດ້, ກຳລັງສະແດງຂໍ້ມູນຕົວຢ່າງ'
    
    // 🛡️ ข้อมูลสำรอง (Mock Data) กรณีเชื่อมต่อ API ไม่ผ่าน
    bookings.value = [
      { id: 1, code: 'BK00001', title: 'ປະຊຸມວຽກປະຈຳອາທິດ', start_time: '10/08/2026 14:00:00', end_time: '10/08/2026 15:00:00', duration: '1.00', requester: 'ນ.ທິບພະດອນ ປາດາກະສາດ', department: 'ການຄ້າ', room: 'ຫ້ອງປະຊຸມໃຫຍ່ (Grand)', status: 'ອນຸມັດແລ້ว' },
      { id: 2, code: 'BK00002', title: 'ວາງແຜນການຕະຫຼາດ Q3', start_time: '10/08/2026 15:00:18', end_time: '10/08/2026 17:00:18', duration: '2.00', requester: 'ນ.ສວອນສະຫວັນ ພະນະວົງ', department: 'ການຕະຫຼາດ', room: 'ຫ້ອງປະຊຸມໃຫຍ່ (Grand)', status: 'ລໍຖ້າອນຸມັດ' },
      { id: 3, code: 'BK00018', title: 'ຕິດຕາມໂຄງການໄອທີ', start_time: '11/08/2026 10:00:00', end_time: '11/08/2026 12:00:00', duration: '2.00', requester: 'ນ.ພັດທະນະອນ ຊຸມພົນປາເຍາ', department: 'ຝ່າຍດຳເນີນງານ', room: 'ຫ້ອງປະຊຸມໃຫຍ່ (Grand)', status: 'ອນຸມັດແລ້ว' },
      { id: 4, code: 'BK00024', title: 'ອບຮົມລະບົບໃໝ່ KCC', start_time: '11/08/2026 14:00:00', end_time: '11/08/2026 15:00:00', duration: '1.00', requester: 'ນ.ວັນສິນ ມິສະສີ', department: 'ການຄ້າ', room: 'ຫ້ອງປະຊຸມໃຫຍ່ (Grand)', status: 'ອນຸມັດແລ້ວ' },
      { id: 5, code: 'BK00016', title: 'ປະຊຸມຄະນະບໍລິຫານ', start_time: '12/08/2026 10:00:00', end_time: '12/08/2026 12:00:00', duration: '2.00', requester: 'ນ.ດາວາວອນ ທຳມະວົງ', department: 'ບໍລິຫານ', room: 'ຫ້ອງປະຊຸມກາງ (Medium)', status: 'ກຳລັງພິຈາລະນາ' }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 📥 ตรวจสอบค่าที่ส่งผ่านมาทาง URL Query ตอนเปิดหน้า
  if (route.query.roomId) {
    selectedRoomId.value = route.query.roomId
  }
  if (route.query.roomName) {
    selectedRoomName.value = route.query.roomName
  }

  fetchBookingsData()
})

// ค้นหาข้อมูลจาก Navbar หรือช่องค้นหาในหน้า
const handleSearch = (keyword) => {
  searchQuery.value = keyword
}

// กรองข้อมูลทั้งจากช่องค้นหา (Search) และห้องที่ถูกเลือกส่งมาจากหน้าอื่น (Room Filter)
const filteredBookings = computed(() => {
  let result = bookings.value

  // 1. กรองตามชื่อห้องที่ถูกส่งข้ามมา (ถ้ามี)
  if (selectedRoomName.value) {
    result = result.filter(item => 
      item.room && item.room.toLowerCase().includes(selectedRoomName.value.toLowerCase())
    )
  }

  // 2. กรองตามคำค้นหา (Search Keyword)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.code.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.requester.toLowerCase().includes(q) ||
      item.department.toLowerCase().includes(q) ||
      (item.room && item.room.toLowerCase().includes(q))
    )
  }

  return result
})

const handleNewBooking = () => {
  alert('ເປີດຟອມສ້າງການຈອງຫ້ອງປະຊຸມໃໝ່')
}

// ฟังก์ชันล้างตัวกรองห้อง กรณีผู้ใช้ต้องการดูห้องทั้งหมดกลับคืนมา
const clearRoomFilter = () => {
  selectedRoomId.value = null
  selectedRoomName.value = ''
  // ล้าง Query ใน URL ออกด้วยเพื่อความสะอาด (ไม่บังคับ)
  window.history.replaceState({}, '', window.location.pathname)
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex font-sans text-slate-800 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Layout -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Navbar -->
      <Navbar @search="handleSearch" />

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto bg-slate-50/70 p-6">
        
        <!-- Top Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-base font-bold text-slate-800">Meeting Room Bookings</h1>
              <p class="text-xs text-slate-500">
                <span v-if="selectedRoomName">ກຳລັງສະແດງປະຫວັດຂອງ: <strong class="text-blue-600">{{ selectedRoomName }}</strong></span>
                <span v-else>ຈັດການ ແລະ ตรวจสอบรายการจองห้องประชุมทั้งหมดภายในระบบ</span>
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
        

            <button 
              @click="handleNewBooking"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-600/20 flex items-center space-x-2 transition cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span>New Booking</span>
            </button>
          </div>
        </div>

        <!-- Notification Banner ถ้าเชื่อม API ไม่ผ่าน -->
        <div v-if="errorMessage" class="mb-4 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <span>⚠️ {{ errorMessage }}</span>
          <button @click="fetchBookingsData" class="underline font-bold cursor-pointer">ລອງໃໝ່</button>
        </div>

        <!-- Table Container -->
        <div class="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col">
          
          <!-- Table Header Stats -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div class="text-xs font-medium text-slate-500">
              รายการทั้งหมด: <strong class="text-slate-800">{{ filteredBookings.length }}</strong> รายการ
            </div>
            <div class="flex items-center space-x-2 text-xs text-slate-400">
              <span>ສະແດງຜົນໜ້າຈໍແບບ Real-time</span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="flex flex-col items-center space-y-3">
              <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-xs text-slate-500 font-medium">กำลังโหลดข้อมูลการจอง...</p>
            </div>
          </div>

          <!-- Data Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <th class="py-3 px-4">ລະຫັດການຈອງ (Code)</th>
                  <th class="py-3 px-4">ຫົວຂໍ້ / ລາຍລະອຽດ</th>
                  <th class="py-3 px-4">ຫ້ອງປະຊຸມ</th>
                  <th class="py-3 px-4">ເລີ່ມຕົ້ນ (Start)</th>
                  <th class="py-3 px-4">ສິ້ນສຸດ (End)</th>
                  <th class="py-3 px-4 text-center">ຊົ່ວໂມງ</th>
                  <th class="py-3 px-4">ຜູ້ຈອງ</th>
                  <th class="py-3 px-4">ພາກສ່ວນ / ຝ່າຍ</th>
                  <th class="py-3 px-4">ສະຖານະ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="item in filteredBookings" 
                  :key="item.id" 
                  class="hover:bg-blue-50/40 transition-colors"
                >
                  <td class="py-3.5 px-4 font-bold text-blue-600 whitespace-nowrap">{{ item.code }}</td>
                  <td class="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate" :title="item.title">
                    {{ item.title }}
                  </td>
                  <td class="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">{{ item.room }}</td>
                  <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">{{ item.start_time }}</td>
                  <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">{{ item.end_time }}</td>
                  <td class="py-3.5 px-4 text-center font-semibold text-slate-700">{{ item.duration }}</td>
                  <td class="py-3.5 px-4 text-slate-700 whitespace-nowrap">{{ item.requester }}</td>
                  <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {{ item.department }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span 
                      class="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      :class="{
                        'bg-emerald-50 text-emerald-700 border border-emerald-200': item.status === 'ອນຸມັດແລ້ວ',
                        'bg-amber-50 text-amber-700 border border-amber-200': item.status === 'ລໍຖ້າອນຸມັດ' || item.status === 'ກຳລັງພິຈາລະນາ',
                        'bg-rose-50 text-rose-700 border border-rose-200': item.status === 'ຍົກເລີກ'
                      }"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-if="filteredBookings.length === 0">
                  <td colspan="9" class="text-center py-12 text-slate-400">
                    ບໍ່ພົບຂໍ້ມູນການຈອງຫ້ອງປະຊຸມໃນຂະນະນີ້
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Table Footer Pagination Info -->
          <div class="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>ສະແດງຜົນ 1 - {{ filteredBookings.length }} ຈາກທັງໝົດ {{ filteredBookings.length }} รายการ</span>
            <div class="flex items-center space-x-1">
              <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 cursor-pointer" disabled>ກ່ອນໜ້າ</button>
              <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer">ຖัดไป</button>
            </div>
          </div>

        </div>

      </main>
    </div>
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