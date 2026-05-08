import { useState } from 'react'
import MapView from './MapView'
import axios from 'axios'

function BookingForm() {
  const [form, setForm] = useState({
    cname: '', phone: '', snumber: '', stname: '',
    pickup_date: '', pickup_time: ''
  })
  const [address, setAddress] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [error, setError] = useState('')

  const generateRef = () => 'CB' + Math.floor(Math.random() * 100000)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const ref = generateRef()
    const fullAddress = `${form.snumber} ${form.stname}`
    setAddress(fullAddress)
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        ...form, booking_ref: ref
      })
      setBookingRef(ref)
      setSubmitted(true)
    } catch {
      setError('Error submitting booking. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.confirmCard}>
          <div style={styles.checkIcon}></div>
          <h2 style={styles.confirmTitle}>Booking Confirmed!</h2>
          <div style={styles.refBox}>
            <p style={styles.refLabel}>Booking Reference Number</p>
            <p style={styles.refNumber}>{bookingRef}</p>
          </div>
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Pickup Date</span>
              <span style={styles.detailValue}>{form.pickup_date}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Pickup Time</span>
              <span style={styles.detailValue}>{form.pickup_time}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Customer</span>
              <span style={styles.detailValue}>{form.cname}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Address</span>
              <span style={styles.detailValue}>{address}</span>
            </div>
          </div>
          <p style={styles.saveNote}>💡 Save your reference number to track your booking</p>
          <MapView address={address} />
          <button style={styles.btnSecondary} onClick={() => setSubmitted(false)}>
            Make Another Booking
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚕 Book a Cab</h2>
      <p style={styles.subtitle}>Fill in your details to book a cab in Auckland and surrounding areas</p>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name *</label>
              <input style={styles.input} name="cname" placeholder="e.g. John Smith" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone Number *</label>
              <input style={styles.input} name="phone" placeholder="e.g. 0211234567" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Street Number *</label>
              <input style={styles.input} name="snumber" placeholder="e.g. 76" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Street Name *</label>
              <input style={styles.input} name="stname" placeholder="e.g. Queen Street" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Pickup Date *</label>
              <input style={styles.input} name="pickup_date" type="date" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Pickup Time *</label>
              <input style={styles.input} name="pickup_time" type="time" onChange={handleChange} required />
            </div>
          </div>
          <button style={styles.btn} type="submit">Book Now 🚕</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '2rem auto', padding: '1rem' },
  title: { textAlign: 'center', color: '#f7c948', marginBottom: '0.5rem' },
  subtitle: { textAlign: 'center', color: '#9090b0', marginBottom: '1.5rem' },
  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: '1rem' },
  formCard: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '16px', padding: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#9090b0', fontSize: '0.85rem' },
  input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #2a2a4e', background: '#0d0d1a', color: '#fff', fontSize: '0.95rem' },
  btn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #f7c948, #f4a011)', color: '#0d0d1a', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  confirmCard: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '16px', padding: '2rem', textAlign: 'center' },
  checkIcon: { fontSize: '3rem', marginBottom: '1rem' },
  confirmTitle: { color: '#51cf66', fontSize: '1.8rem', marginBottom: '1.5rem' },
  refBox: { background: '#0d0d1a', border: '1px solid #f7c948', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' },
  refLabel: { color: '#9090b0', fontSize: '0.85rem', marginBottom: '0.5rem' },
  refNumber: { color: '#f7c948', fontSize: '1.8rem', fontWeight: 'bold' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', textAlign: 'left' },
  detailItem: { background: '#0d0d1a', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  detailLabel: { color: '#9090b0', fontSize: '0.8rem' },
  detailValue: { color: '#fff', fontWeight: '500' },
  saveNote: { color: '#9090b0', fontSize: '0.85rem', marginBottom: '1.5rem' },
  btnSecondary: { padding: '0.75rem 2rem', background: 'transparent', color: '#f7c948', border: '1px solid #f7c948', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' }
}

export default BookingForm