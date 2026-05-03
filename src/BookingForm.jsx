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

  const generateRef = () => 'CB' + Math.floor(Math.random() * 100000)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ref = generateRef()
    const fullAddress = `${form.snumber} ${form.stname}`
    setAddress(fullAddress)
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        ...form, booking_ref: ref
      })
      setBookingRef(ref)
      setSubmitted(true)
    } catch (err) {
      alert('Error submitting booking!')
    }
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.success}>
          <h2>Booking Confirmed!</h2>
          <p>Your booking reference is: <strong>{bookingRef}</strong></p>
          <p>Save this reference to track your booking!</p>
          <MapView address={address} />
          <button style={styles.btn} onClick={() => setSubmitted(false)}>
            Make Another Booking
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Book a Cab</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} name="cname" placeholder="Full Name" onChange={handleChange} required />
        <input style={styles.input} name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input style={styles.input} name="snumber" placeholder="Street Number" onChange={handleChange} required />
        <input style={styles.input} name="stname" placeholder="Street Name" onChange={handleChange} required />
        <input style={styles.input} name="pickup_date" type="date" onChange={handleChange} required />
        <input style={styles.input} name="pickup_time" type="time" onChange={handleChange} required />
        <button style={styles.btn} type="submit">Book Now 🚕</button>
      </form>
    </div>
  )
}

const styles = {
  container: { maxWidth: '600px', margin: '2rem auto', padding: '2rem' },
  title: { textAlign: 'center', color: '#1a1a2e' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' },
  btn: { padding: '0.8rem', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  success: { textAlign: 'center', padding: '2rem', backgroundColor: '#f0fff0', borderRadius: '12px' }
}

export default BookingForm