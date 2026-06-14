import { Suspense } from 'react'
import EventBookingPage from '../components/EventBookingPage'

export const metadata = {
  title: 'Event Booking — Club Anva',
}

export default function EventBooking() {
  return (
    <Suspense fallback={<div style={{color:'white',padding:'2rem'}}>Loading...</div>}>
      <EventBookingPage />
    </Suspense>
  )
}
