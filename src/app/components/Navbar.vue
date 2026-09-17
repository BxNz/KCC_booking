<template>
  <header class="bg-[#1B2A38] text-white flex-none">
    <!-- Top Header Bar -->
    <div class="flex justify-between items-center px-6 py-2.5 text-xs border-b border-slate-700/60">
      <div class="font-bold text-sm tracking-wide text-slate-200">
        Booking Rooms Dashboard
      </div>

      <div class="flex items-center space-x-5">
        <!-- Notification Button -->
        

        <!-- User Info -->
       <!-- User Info with Dropdown -->
<div class="relative">
  <!-- ປຸ່ມກົດທີ່ຊື່ user (ເພີ່ມ @click ແລະ cursor-pointer) -->
  <div 
    @click="toggleDropdown" 
    class="flex items-center space-x-2 pl-3 border-l border-slate-700 cursor-pointer select-none group"
  >
    <span class="text-slate-300 font-medium group-hover:text-white transition">KHOUANCHAY TRADING</span>
    <div class="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm">
     
    </div>
  </div>

  <!-- Dropdown Menu (ສະແດງເມື່ອ isOpen ເປັນ true) -->
  <div 
    v-if="isOpen" 
    class="absolute right-0 mt-2 w-48 bg-white text-slate-700 rounded-lg shadow-lg py-1 border border-slate-200 z-50 text-xs"
  >
    <a href="#" @click.prevent="handleProfile" class="block px-4 py-2 hover:bg-slate-100 transition">
      My Profile
    </a>
    <div class="border-t border-slate-100 my-1"></div>
    <a href="#" @click.prevent="handleLogout" class="block px-4 py-2 text-rose-600 hover:bg-rose-50 transition font-medium">
      Log out
    </a>
  </div>
</div>
      </div>
    </div>

    <!-- Sub Header / Filter Bar -->
    <div class="bg-white text-slate-800 px-6 py-3 flex justify-between items-center border-b border-slate-200 shadow-2xs">
      <h1 class="text-base font-bold text-slate-800">
        Meeting Rooms
      </h1>

      <div class="flex items-center space-x-4">
        <!-- Search Field -->
        <div class="relative">
          <input 
            v-model="searchInput"
            @input="emitSearch"
            type="text" 
            placeholder="ຄົ້ນຫາຫ້ອງ ຫຼື ຜູ້ທີ່ຈອງ..." 
            class="border border-slate-300 bg-slate-50/50 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-52 transition"
          />
          <svg class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

       
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router' // 1. นำเข้า useRouter
import Swal from 'sweetalert2' // (ถ้าต้องการใช้ป๊อปอัปแจ้งเตือน)

const router = useRouter() // 2. สร้าง Router Instance
const emit = defineEmits(['search', 'logout', 'profile'])
const searchInput = ref('')
const isOpen = ref(false) // เก็บสถานະເປີດ-ປິດ

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 3. เพิ่มฟังก์ชัน handleLogout ตรงนี้
const handleLogout = async () => {
  // เคลียร์ข้อมูลการเข้าสู่ระบบออกจาก LocalStorage
  localStorage.removeItem('user-token')
  localStorage.removeItem('username')
  localStorage.removeItem('odoo_uid')

  // ปิด Dropdown เมนูก่อน
  isOpen.value = false

  // (ทางเลือก) แสดงป๊อปอัปแจ้งเตือนความสำเร็จ
  await Swal.fire({
    icon: 'success',
    title: 'ออกจากระบบสำเร็จ',
    timer: 1000,
    showConfirmButton: false,
    timerProgressBar: true
  })

  // สั่งเปลี่ยนเส้นทางไปยังหน้า Login ทันที
  router.push('/login')
}
</script>