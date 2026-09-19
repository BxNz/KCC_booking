import { getBookingEvents } from '@/app/api/bookingApi.js'
import { createBooking as createBookingRequest } from '@/app/api/addbook.js'

export const fetchBookings = (bookingId) => getBookingEvents(bookingId)

export const saveBooking = (payload) => createBookingRequest(payload)
