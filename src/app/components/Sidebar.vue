<template>
  <aside class="w-56 bg-[#1B2A38] text-slate-300 flex flex-col justify-between shrink-0 h-screen shadow-xl select-none">
    <div>
      <!-- Logo App -->
      <div class="p-4 bg-[#131E28] text-white font-bold flex items-center gap-3 border-b border-slate-700/50">
        <div class="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 p-1 border border-slate-700">
          <img 
            src="http://115.84.105.127:9999/api/company/logo/image" 
            alt="Company Logo" 
            class="w-full h-full object-contain"
          />
        </div>
        <span class="text-sm tracking-wide truncate">Booking System</span>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-4 px-2 space-y-1 text-xs">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-150"
          :class="[
            isCurrentRoute(item.path) ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
          ]"
        >
          <span class="mr-3 text-base">{{ item.icon }}</span>
          <span class="truncate">{{ item.name }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Company Badge -->
    <div class="p-3 bg-slate-800/60 m-3 rounded-xl border border-slate-700/50 text-center">
      <div class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Powered By</div>
      <div class="text-xs text-teal-400 font-extrabold mt-0.5">KCC KHOUANCHAY</div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ປ່ຽນຈາກ href ເປັນ path ໃຫ້ກົງກັບ router/index.js
const menuItems = ref([
  { name: 'Booking Rooms', icon: '🏢', path: '/' },
  { name: 'Booking Cars', icon: '🚘', path: '/booking-cars' }, // ປັບຕາມ router ທີ່ມີ
  { name: 'IT Tickets', icon: '🎫', path: '/it-tickets' },     // ປັບຕາມ router ທີ່ມີ
  { name: 'Room History', icon: '📋', path: '/meeting-rooms' },
  // { name: 'My Profile', icon: '👤', path: '/profile' },
  { name: 'Log out', icon: '↪', path: '/logout' }
])

// ตรวจสอบว่าเมນູໃດກຳລັງactive ຢູ່
const isCurrentRoute = (path) => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}
</script>