<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <!-- ຫນ້າຈໍວ່າງໆ ເພາະຈະເນັ້ນສະແດງ SweetAlert2 ຂຶ້ນມາທັນທີ -->
    <div class="text-center text-slate-400 text-xs">
      ກຳລັງดำเนินการອອກຈາກລະບົບ...
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

onMounted(async () => {
  // ເດັ້ງ SweetAlert2 ທันທີທີ່ເຂົ້າມานี้
  const result = await Swal.fire({
    title: 'ຢືນຢັນການອອກຈາກລະບົບ?',
    text: 'ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ໆແມ່ນບໍ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48', // ສີແດງ
    cancelButtonColor: '#64748b',  // ສີເທົາ
    confirmButtonText: 'ຕົກລົງ, ອອກຈາກລະບົບ',
    cancelButtonText: 'ຍົກເລີກ',
    allowOutsideClick: false,      // ຫ้ามກົດ ຫຼุดຄລິກຂ້າງນອກ
    allowEscapeKey: false          // ຫ้ามກົດປຸ່ມ Esc
  })

  // ຖ້າຜູ້ໃຊ້ກົດ "ຕົກລົງ, ອອກຈາກລະບົບ"
  if (result.isConfirmed) {
    localStorage.removeItem('user-token')
    localStorage.removeItem('username')
    localStorage.removeItem('odoo_uid')

  
    
    window.location.href = '/login'
  } else {
    // ຖ້າຜູ້ໃຊ້ກົດ "ຍົກເລີກ" ໃຫ້ດີດກັບໄປໜ້າເດີມ (Home)
    router.back()
  }
})
</script>