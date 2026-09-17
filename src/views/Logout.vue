<template>
  <div
    class="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-700 antialiased relative overflow-hidden selection:bg-[#243746] selection:text-white">
    <!-- Background Gradient Orbs (เอฟเฟกต์แสงฟุ้งด้านหลัง) -->
    <div
      class="absolute -top-32 -left-32 w-96 h-96 bg-[#243746] rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse">
    </div>
    <div
      class="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-900 rounded-full blur-3xl opacity-40 pointer-events-none">
    </div>

    <!-- Logout Card Container -->
    <div
      class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-sm p-8 text-center relative z-10">

      <!-- Icon / Logo Section -->
      <div class="flex flex-col items-center mb-6">
        <div class="p-4 bg-rose-50 rounded-2xl border border-rose-100 shadow-inner mb-4 text-rose-600">
          <!-- ไอคอน Logout -->
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </div>
        <h1 class="text-lg font-bold text-slate-800 tracking-tight">ออกจากระบบ</h1>
        <p class="text-xs text-slate-400 mt-1">KCC KHOUANCHAY GROUP</p>
      </div>

      <div class="border-b border-slate-100 mb-6"></div>

      <!-- ข้อความยืนยัน -->
      <p class="text-xs text-slate-600 mb-6">
        คุณต้องการออกจากระบบใช่หรือไม่? ข้อมูลการเข้าสู่จะถูกล้างออกจากเครื่องนี้
      </p>

      <!-- ปุ่มกด (Actions) -->
      <div class="space-y-3">
        <!-- ปุ่มยืนยันออกจากระบบ -->
        <button @click="handleLogout"
          class="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
          <span>ยืนยันออกจากระบบ (Log out)</span>
        </button>

        <!-- ปุ่มยกเลิก (กลับไปหน้าก่อนหน้า) -->
        <button @click="cancelLogout"
          class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer">
          ยกเลิก (Cancel)
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const handleLogout = async () => {
  // 1. ลบ Token ออกจาก LocalStorage
  localStorage.removeItem('user-token')
  localStorage.removeItem('username')
  localStorage.removeItem('odoo_uid')

  // 2. แสดงแจ้งเตือน
  await Swal.fire({
    icon: 'success',
    title: 'ออกจากระบบสำเร็จ',
    timer: 1000,
    showConfirmButton: false
  })

  // 3. บังคับเปลี่ยนหน้าและเคลียร์แคชโดยตรง (รับรองว่าเด้งไปแน่นอน 100%)
  window.location.href = '/login'
}

// ฟังก์ชันสำหรับปุ่มยกเลิก
const cancelLogout = () => {
  router.back() // กลับไปหน้าก่อนหน้าที่ผู้ใช้กดเข้ามา
}
</script>