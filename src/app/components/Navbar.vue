<template>
  <header class="bg-[#1B2A38] text-white flex-none">
    <!-- Top Header Bar -->
    <div class="flex justify-between items-center px-6 py-2.5 text-xs border-b border-slate-700/60">
      <div class="font-bold text-sm tracking-wide text-slate-200">
        Booking Rooms Dashboard
      </div>

      <div class="flex items-center space-x-5">
        <!-- Notification Button -->
        <button class="relative text-slate-300 hover:text-white transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">2</span>
        </button>

        <!-- User Info -->
        <div class="flex items-center space-x-2 pl-3 border-l border-slate-700">
          <span class="text-slate-300 font-medium">KHOUANCHAY TRADING</span>
          <div class="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm">
            U
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

        <!-- Pagination Controls -->
        <!-- <div class="text-xs text-slate-500 flex items-center space-x-2 border-l border-slate-200 pl-4">
          <span class="font-medium">1-4 / 4</span>
          <div class="inline-flex rounded-md shadow-2xs">
            <button class="px-2 py-1 border border-slate-300 rounded-l-md bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition">&lt;</button>
            <button class="px-2 py-1 border-t border-b border-r border-slate-300 rounded-r-md bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition">&gt;</button>
          </div>
        </div> -->
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])
const searchInput = ref('')

const emitSearch = () => {
  emit('search', searchInput.value)
}
</script>