import { useState } from 'react'
import axios from 'axios'

function BookingTracker() {
  const [ref, setRef] = useState('')
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/${ref}`)
      setBooking(res.data)
      setError('')
    } catch {
      setError('Booking not found!')
      setBooking(null)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Track Your Booking</h2>
      <div style={styles.searchBox}>
        <input
          style={styles.input}
          placeholder="Enter Booking Reference (e.g. CB12345)"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
        />
        <button style={styles.btn} onClick={handleSearch}>Search 🔍</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {booking && (
        <div style={styles.card}>
          <h3>Booking Details</h3>
          <p><strong>Reference:</strong> {booking.booking_ref}</p>
          <p><strong>Name:</strong> {booking.cname}</p>
          <p><strong>Phone:</strong> {booking.phone}</p>
          <p><strong>Pickup:</strong> {booking.snumber} {booking.stname}</p>
          <p><strong>Date:</strong> {booking.pickup_date}</p>
          <p><strong>Time:</strong> {booking.pickup_time}</p>
          <p><strong>Status:</strong>
            <span style={{
              ...styles.status,
              backgroundColor: booking.status === 'unassigned' ? '#ff6b6b' : '#51cf66'
            }}>
              {booking.status}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: '600px', margin: '2rem auto', padding: '2rem' },
  title: { textAlign: 'center', color: '#1a1a2e' },
  searchBox: { display: 'flex', gap: '1rem' },
  input: { flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' },
  btn: { padding: '0.8rem 1.5rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  card: { marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #dee2e6' },
  error: { color: 'red', textAlign: 'center' },
  status: { marginLeft: '0.5rem', padding: '0.2rem 0.8rem', borderRadius: '20px', color: 'white', fontWeight: 'bold' }
}

export default BookingTracker