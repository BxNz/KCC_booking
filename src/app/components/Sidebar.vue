<template>
  <aside class="w-56 bg-[#1B2A38] text-slate-300 flex flex-col justify-between shrink-0 h-screen shadow-xl select-none">
    <div>
      <!-- Logo App -->
      <div class="p-4 bg-[#131E28] text-white font-bold flex items-center gap-3 border-b border-slate-700/50">
        <div class="w-6 h-6 bg-teal-400 rounded-md flex items-center justify-center font-black text-[#131E28] text-xs">
          K
        </div>
        <span class="text-sm tracking-wide">Booking System</span>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-4 px-2 space-y-1 text-xs">
        <a 
          v-for="item in menuItems" 
          :key="item.name"
          :href="item.href"
          :class="[
            'flex items-center px-3 py-2.5 rounded-lg transition-all duration-150',
            item.active ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
          ]"
        >
          <span class="mr-3 text-base">{{ item.icon }}</span>
          <span class="truncate">{{ item.name }}</span>
        </a>
      </nav>
    </div>

    <!-- Company Badge -->
    <div class="p-3 bg-slate-800/60 m-3 rounded-xl border border-slate-700/50 text-center">
      <div class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Powered By</div>
      <div class="text-xs text-teal-400 font-extrabold mt-0.5">KC KHOUANCHAY</div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const menuItems = ref([
  { name: 'Booking Rooms', icon: '🏢', href: '#', active: true },
  { name: 'Booking Cars', icon: '🚘', href: '#', active: false },
  { name: 'IT Tickets', icon: '🎫', href: '#', active: false },
  { name: 'Designer Tickets', icon: '🎨', href: '#', active: false },
  { name: 'To-do List', icon: '📌', href: '#', active: false },
  { name: 'Project', icon: '📁', href: '#', active: false },
  { name: 'Inventory', icon: '📦', href: '#', active: false },
])
</script>