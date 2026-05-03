import { useState, useEffect } from 'react'
import axios from 'axios'

function DriverDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings')
      setBookings(res.data.filter(b => b.status === 'unassigned'))
      setLoading(false)
    } catch {
      alert('Error fetching bookings!')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const acceptBooking = async (ref) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${ref}/status`, {
        status: 'assigned'
      })
      fetchBookings()
    } catch {
      alert('Error accepting booking!')
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚗 Driver Dashboard</h2>
      <p style={styles.subtitle}>Available Bookings</p>

      {loading && <p>Loading bookings...</p>}

      {!loading && bookings.length === 0 && (
        <p style={styles.empty}>No unassigned bookings available!</p>
      )}

      {bookings.map(booking => (
        <div key={booking.id} style={styles.card}>
          <p><strong>Ref:</strong> {booking.booking_ref}</p>
          <p><strong>Customer:</strong> {booking.cname}</p>
          <p><strong>Pickup:</strong> {booking.snumber} {booking.stname}</p>
          <p><strong>Date:</strong> {booking.pickup_date}</p>
          <p><strong>Time:</strong> {booking.pickup_time}</p>
          <button style={styles.btn} onClick={() => acceptBooking(booking.booking_ref)}>
            Accept Booking 
          </button>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '2rem auto', padding: '2rem' },
  title: { textAlign: 'center', color: '#1a1a2e' },
  subtitle: { textAlign: 'center', color: '#666' },
  card: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #dee2e6' },
  btn: { padding: '0.6rem 1.5rem', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  empty: { textAlign: 'center', color: '#999', fontSize: '1.2rem' }
}

export default DriverDashboard