import { useState } from 'react'
import axios from 'axios'

function BookingTracker() {
  const [ref, setRef] = useState('')
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!ref.trim()) {
      setError('Please enter a booking reference number.')
      return
    }
    setLoading(true)
    setError('')
    setBooking(null)
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/${ref}`)
      setBooking(res.data)
    } catch {
      setError('No booking found with that reference number.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📍 Track Your Booking</h2>
      <p style={styles.subtitle}>Enter your booking reference to check your status</p>

      <div style={styles.searchCard}>
        <div style={styles.searchRow}>
          <input
            style={styles.input}
            placeholder="e.g. CB12345"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button style={styles.btn} onClick={handleSearch}>
            {loading ? 'Searching...' : 'Search 🔍'}
          </button>
        </div>
      </div>

      {error && <p style={styles.error}> {error}</p>}

      {booking && (
        <div style={styles.resultCard}>
          <div style={styles.cardHeader}>
            <span style={styles.ref}>{booking.booking_ref}</span>
            <span style={{
              ...styles.badge,
              backgroundColor: booking.status === 'unassigned' ? '#ff6b6b22' : '#51cf6622',
              color: booking.status === 'unassigned' ? '#ff6b6b' : '#51cf66',
              border: `1px solid ${booking.status === 'unassigned' ? '#ff6b6b44' : '#51cf6644'}`
            }}>
              {booking.status === 'unassigned' ? '⏳ Unassigned' : '✅ Assigned'}
            </span>
          </div>

          <div style={styles.grid}>
            <div style={styles.item}>
              <span style={styles.label}>Customer Name</span>
              <span style={styles.value}>{booking.cname}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Phone</span>
              <span style={styles.value}>{booking.phone}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Pickup Address</span>
              <span style={styles.value}>{booking.snumber} {booking.stname}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Pickup Suburb</span>
              <span style={styles.value}>{booking.sbname || 'Not specified'}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Destination Suburb</span>
              <span style={styles.value}>{booking.dsbname || 'Not specified'}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Pickup Date</span>
              <span style={styles.value}>{booking.pickup_date}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Pickup Time</span>
              <span style={styles.value}>{booking.pickup_time}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Booking Date</span>
              <span style={styles.value}>{new Date(booking.booking_datetime).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '2rem auto', padding: '1rem' },
  title: { textAlign: 'center', color: '#f7c948', marginBottom: '0.5rem' },
  subtitle: { textAlign: 'center', color: '#9090b0', marginBottom: '1.5rem' },
  searchCard: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' },
  searchRow: { display: 'flex', gap: '1rem' },
  input: { flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #2a2a4e', background: '#0d0d1a', color: '#fff', fontSize: '0.95rem' },
  btn: { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #f7c948, #f4a011)', color: '#0d0d1a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: '1rem' },
  resultCard: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '12px', padding: '1.5rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  ref: { color: '#f7c948', fontWeight: 'bold', fontSize: '1.3rem' },
  badge: { padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  item: { background: '#0d0d1a', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { color: '#9090b0', fontSize: '0.8rem' },
  value: { color: '#fff', fontWeight: '500' }
}

export default BookingTracker