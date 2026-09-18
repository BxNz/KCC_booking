<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-700 antialiased relative overflow-hidden selection:bg-[#243746] selection:text-white">
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#243746] rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-900 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

    <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-sm p-8 transition-all relative z-10">
      <div class="flex flex-col items-center mb-6">
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner mb-3">
          <img src="http://115.84.105.127:9999/api/company/logo/image" alt="KC Logo" class="h-14 object-contain mx-auto" @error="handleImageError" />
        </div>
        <h1 class="text-lg font-bold text-slate-800 tracking-tight">ເຂົ້າໃຊ້ລະບົບ</h1>
        <p class="text-[11px] text-slate-400 font-medium tracking-wide">KCC KHOUANCHAY GROUP</p>
      </div>

      <div class="border-b border-slate-100 mb-6"></div>

      <transition name="fade">
        <div v-if="errorMessage" class="mb-5 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2 shadow-xs">
          <svg class="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>{{ errorMessage }}</span>
        </div>
      </transition>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label for="username" class="text-xs font-semibold text-slate-700">ຊື່ບັນຊີ (User)</label>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <input id="username" v-model="username" type="text" placeholder="User" required class="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#243746]/20 focus:border-[#243746] transition placeholder:text-slate-400 text-slate-800" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-xs font-semibold text-slate-700 mb-1.5">ລະຫັດຜ່ານ (Password)</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required class="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#243746]/20 focus:border-[#243746] transition placeholder:text-slate-400 text-slate-800" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
              <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.97 8.97 0 012.122-.163c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"></path></svg>
            </button>
          </div>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full bg-[#243746] hover:bg-[#1a2833] text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[#243746]/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
            <span v-if="loading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ loading ? 'Signing in...' : 'Log in' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginuser } from '@/app/api/loginapi'
import Swal from 'sweetalert2'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    loading.value = true
    const result = await loginuser(username.value, password.value)
    
    if (result) {
      localStorage.setItem('user-token', result.access_token)
      localStorage.setItem('username', result.result.name)
      localStorage.setItem('odoo_uid', result.result.uid)
      
      // await Swal.fire({
      //   icon: 'success',
      //   title: 'Login Successful!',
      //   text: 'ຍິນດີຕ້ອນຮັບເຂົ້າລະບົບ',
      //   confirmButtonColor: '#0d6efd',
      //   timer: 1500,
      //   timerProgressBar: true,
      // }) 
      
      router.push('/')
    } else {
      errorMessage.value = result?.message || 'ຊື່ຜູ້ໃໍ້ ຫຼື ລະຫັດບໍ່ຖືກຕ້ອງ'
      Swal.fire({ icon: 'error', title: 'Login Failed', text: errorMessage.value, confirmButtonColor: '#dc3545' })
    }
  } catch (error) {
    console.error('Login Connection Error:', error)
    errorMessage.value = 'ไม่สามารถเชื่อมต่อกับ Server หลังบ้านได้'
    Swal.fire({ icon: 'warning', title: 'Connection Error', text: 'ไม่สามารถเชื่อมต่อกับ Server', confirmButtonColor: '#ffc107' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>