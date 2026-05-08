import { useState } from 'react'

function PaymentForm({ fare, bookingRef, onClose }) {
  const [card, setCard] = useState({
    name: '', number: '', expiry: '', cvv: ''
  })
  const [error, setError] = useState('')
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    // Auto-format card number with spaces
    if (name === 'number') {
      const cleaned = value.replace(/\D/g, '').slice(0, 16)
      const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim()
      setCard(prev => ({ ...prev, number: formatted }))
      return
    }
    // Auto-format expiry MM/YY
    if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4)
      const formatted = cleaned.length > 2 ? cleaned.slice(0, 2) + '/' + cleaned.slice(2) : cleaned
      setCard(prev => ({ ...prev, expiry: formatted }))
      return
    }
    setCard(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!card.name.trim()) return 'Please enter the cardholder name.'
    const digits = card.number.replace(/\s/g, '')
    if (digits.length !== 16) return 'Card number must be 16 digits.'
    if (card.expiry.length !== 5) return 'Please enter expiry as MM/YY.'
    const [mm, yy] = card.expiry.split('/')
    const expDate = new Date(2000 + parseInt(yy), parseInt(mm) - 1, 1)
    if (expDate < new Date()) return 'Card has expired.'
    if (card.cvv.length !== 3) return 'CVV must be 3 digits.'
    return null
  }

  const handlePay = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    // Simulate payment processing delay
    setTimeout(() => {
      setLoading(false)
      setPaid(true)
    }, 2000)
  }

  if (paid) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.successIcon}>🎉</div>
          <h2 style={styles.successTitle}>Payment Successful!</h2>
          <div style={styles.receiptBox}>
            <p style={styles.receiptTitle}>Receipt</p>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Booking Ref</span>
              <span style={styles.receiptValue}>{bookingRef}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Amount Paid</span>
              <span style={styles.receiptValue}>${fare}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Card</span>
              <span style={styles.receiptValue}>**** **** **** {card.number.replace(/\s/g, '').slice(-4)}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Status</span>
              <span style={{ ...styles.receiptValue, color: '#51cf66' }}>✅ Confirmed</span>
            </div>
          </div>
          <p style={styles.receiptNote}>A confirmation has been sent to your account.</p>
          <button style={styles.closeBtn} onClick={onClose}>Back to Booking</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>💳 Payment</h2>
        <p style={styles.subtitle}>Total amount: <span style={styles.amount}>${fare}</span></p>
        <p style={styles.subtitle}>Booking: <span style={styles.ref}>{bookingRef}</span></p>

        {error && <p style={styles.error}> {error}</p>}

        <form onSubmit={handlePay}>
          <div style={styles.field}>
            <label style={styles.label}>Cardholder Name *</label>
            <input
              style={styles.input}
              name="name"
              placeholder="e.g. John Smith"
              value={card.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Card Number *</label>
            <input
              style={styles.input}
              name="number"
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Expiry Date *</label>
              <input
                style={styles.input}
                name="expiry"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>CVV *</label>
              <input
                style={styles.input}
                name="cvv"
                placeholder="123"
                maxLength={3}
                value={card.cvv}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button style={loading ? styles.btnLoading : styles.btn} type="submit" disabled={loading}>
            {loading ? '⏳ Processing...' : `Pay $${fare} Now`}
          </button>
        </form>
        <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '420px', textAlign: 'center' },
  title: { color: '#f7c948', marginBottom: '0.5rem' },
  subtitle: { color: '#9090b0', marginBottom: '0.3rem', fontSize: '0.95rem' },
  amount: { color: '#51cf66', fontWeight: 'bold', fontSize: '1.1rem' },
  ref: { color: '#f7c948', fontWeight: 'bold' },
  error: { color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', textAlign: 'left' },
  label: { color: '#9090b0', fontSize: '0.85rem' },
  input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #2a2a4e', background: '#0d0d1a', color: '#fff', fontSize: '0.95rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  btn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #51cf66, #2ecc71)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '0.75rem' },
  btnLoading: { width: '100%', padding: '0.9rem', background: '#2a2a4e', color: '#9090b0', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'not-allowed', marginBottom: '0.75rem' },
  cancelBtn: { background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b44', borderRadius: '8px', padding: '0.5rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem' },
  successIcon: { fontSize: '3rem', marginBottom: '1rem' },
  successTitle: { color: '#51cf66', fontSize: '1.8rem', marginBottom: '1.5rem' },
  receiptBox: { background: '#0d0d1a', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', textAlign: 'left' },
  receiptTitle: { color: '#f7c948', fontWeight: 'bold', marginBottom: '0.75rem', textAlign: 'center' },
  receiptRow: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #2a2a4e' },
  receiptLabel: { color: '#9090b0', fontSize: '0.85rem' },
  receiptValue: { color: '#fff', fontWeight: '500', fontSize: '0.85rem' },
  receiptNote: { color: '#9090b0', fontSize: '0.8rem', marginBottom: '1.5rem' },
  closeBtn: { padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #f7c948, #f4a011)', color: '#0d0d1a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
}

export default PaymentForm