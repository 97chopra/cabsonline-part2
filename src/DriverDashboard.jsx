import { useState, useEffect } from 'react'
import axios from 'axios'

function DriverDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings')
      setBookings(res.data.filter(b => b.status === 'unassigned'))
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const acceptBooking = async (ref) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${ref}/status`, { status: 'assigned' })
      setMessage(` Booking ${ref} accepted!`)
      fetchBookings()
    } catch {
      setMessage('Error accepting booking.')
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚗 Driver Dashboard</h2>
      <p style={styles.subtitle}>Available unassigned bookings</p>
      {message && <p style={styles.message}>{message}</p>}
      {loading && <p style={styles.loading}>Loading bookings...</p>}
      {!loading && bookings.length === 0 && (
        <p style={styles.empty}>No unassigned bookings right now.</p>
      )}
      {bookings.map(b => (
        <div key={b.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.ref}>{b.booking_ref}</span>
            <span style={styles.badge}>Unassigned</span>
          </div>
          <div style={styles.cardBody}>
            <p><span style={styles.label}>Customer:</span> {b.cname}</p>
            <p><span style={styles.label}>Phone:</span> {b.phone}</p>
            <p><span style={styles.label}>Pickup:</span> {b.snumber} {b.stname}</p>
            <p><span style={styles.label}>Date:</span> {b.pickup_date}</p>
            <p><span style={styles.label}>Time:</span> {b.pickup_time}</p>
          </div>
          <button style={styles.btn} onClick={() => acceptBooking(b.booking_ref)}>
            Accept Booking 
          </button>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '2rem auto', padding: '1rem' },
  title: { textAlign: 'center', color: '#f7c948', marginBottom: '0.5rem' },
  subtitle: { textAlign: 'center', color: '#9090b0', marginBottom: '1.5rem' },
  message: { textAlign: 'center', color: '#51cf66', marginBottom: '1rem' },
  loading: { textAlign: 'center', color: '#9090b0' },
  empty: { textAlign: 'center', color: '#9090b0', fontSize: '1.1rem', marginTop: '2rem' },
  card: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  ref: { color: '#f7c948', fontWeight: 'bold', fontSize: '1.1rem' },
  badge: { background: '#ff6b6b22', color: '#ff6b6b', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid #ff6b6b44' },
  cardBody: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' },
  label: { color: '#9090b0', fontSize: '0.85rem' },
  btn: { background: 'linear-gradient(135deg, #51cf66, #2ecc71)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }
}

export default DriverDashboard