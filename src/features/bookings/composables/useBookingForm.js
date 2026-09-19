import { onMounted, ref } from 'vue'
import { saveBooking } from '../services/bookingService'

export const useBookingForm = (room, emit) => {
  const loading = ref(false)
  const errorMessage = ref('')
  const form = ref({
    startDate: '25/09/2026 17:00:00',
    endDate: '25/09/2026 18:00:00',
    meetingTitle: '',
    departmentCreator: '',
    departmentUser: '',
    participantsCount: 0,
    tel: '',
    username: '',
    additionalUser: '',
    objective: '',
    priority: 'normal'
  })

  onMounted(() => {
    const storedUser = localStorage.getItem('username') || 'ບ.ພັດທະໄຊ ລົງຖາວັດ'
    form.value.username = storedUser
    form.value.additionalUser = storedUser
  })

  const setPriority = (level) => {
    form.value.priority = level
  }

  const parseDateTime = (dateTime) => {
    if (!dateTime || !dateTime.includes(' ')) {
      return { date: '', time: '00:00:00' }
    }

    const [datePart, timePart] = dateTime.split(' ')
    if (datePart.includes('/')) {
      const [day, month, year] = datePart.split('/')
      return { date: `${year}-${month}-${day}`, time: timePart || '00:00:00' }
    }

    return { date: datePart, time: timePart || '00:00:00' }
  }

  const handleSave = async () => {
    loading.value = true
    errorMessage.value = ''

    const start = parseDateTime(form.value.startDate)
    const end = parseDateTime(form.value.endDate)
    const payload = {
      item_id: room.value.id,
      start_date: start.date,
      stop_date: end.date,
      start_time: start.time,
      stop_time: end.time,
      priority: form.value.priority,
      description: form.value.objective,
      roomName: room.value.name,
      meetingTitle: form.value.meetingTitle,
      departmentCreator: form.value.departmentCreator,
      departmentUser: form.value.departmentUser,
      participantsCount: form.value.participantsCount,
      tel: form.value.tel,
      username: form.value.username
    }

    try {
      const result = await saveBooking(payload)
      emit('save', result)
    } catch (error) {
      errorMessage.value = 'ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້, ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ ຫຼື Token!'
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return { form, loading, errorMessage, setPriority, handleSave }
}
