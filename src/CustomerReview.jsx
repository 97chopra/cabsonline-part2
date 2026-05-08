import { useState, useEffect } from 'react'
import axios from 'axios'

function StarRating({ rating, onRate }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1rem 0' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: '2.5rem',
            cursor: onRate ? 'pointer' : 'default',
            color: star <= (hovered || rating) ? '#f7c948' : '#2a2a4e',
            transition: 'color 0.15s'
          }}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => onRate && setHovered(star)}
          onMouseLeave={() => onRate && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function CustomerReview() {
  const [form, setForm] = useState({ booking_ref: '', cname: '', rating: 0, comment: '' })
  const [reviews, setReviews] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reviews')
      setReviews(res.data)
    } catch {
      console.error('Could not load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReviews() }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.booking_ref.trim()) return setError('Please enter your booking reference.')
    if (form.rating === 0) return setError('Please select a star rating.')
    if (!form.cname.trim()) return setError('Please enter your name.')
    try {
      await axios.post('http://localhost:5000/api/reviews', form)
      setSubmitted(true)
      fetchReviews()
    } catch {
      setError('Error submitting review. Please try again.')
    }
  }

  const getStarLabel = (rating) => {
    const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }
    return labels[rating] || ''
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⭐ Customer Reviews</h2>
      <p style={styles.subtitle}>Share your experience with CabsOnline</p>

      {/* Stats Bar */}
      {reviews.length > 0 && (
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <p style={styles.statNumber}>{avgRating}</p>
            <p style={styles.statLabel}>Average Rating</p>
            <StarRating rating={Math.round(avgRating)} onRate={null} />
          </div>
          <div style={styles.statItem}>
            <p style={styles.statNumber}>{reviews.length}</p>
            <p style={styles.statLabel}>Total Reviews</p>
          </div>
        </div>
      )}

      {/* Review Form */}
      {submitted ? (
        <div style={styles.successCard}>
          <p style={styles.successIcon}>🎉</p>
          <h3 style={styles.successTitle}>Thank you for your review!</h3>
          <p style={styles.successText}>Your feedback helps us improve our service.</p>
          <button style={styles.btn} onClick={() => { setSubmitted(false); setForm({ booking_ref: '', cname: '', rating: 0, comment: '' }) }}>
            Write Another Review
          </button>
        </div>
      ) : (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Write a Review</h3>
          {error && <p style={styles.error}>❌ {error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Booking Reference *</label>
                <input style={styles.input} name="booking_ref" placeholder="e.g. CB12345" value={form.booking_ref} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Your Name *</label>
                <input style={styles.input} name="cname" placeholder="e.g. John Smith" value={form.cname} onChange={handleChange} />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Your Rating *</label>
              <StarRating rating={form.rating} onRate={(star) => setForm(prev => ({ ...prev, rating: star }))} />
              {form.rating > 0 && <p style={styles.ratingLabel}>{getStarLabel(form.rating)}</p>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Your Comment</label>
              <textarea
                style={styles.textarea}
                name="comment"
                placeholder="Tell us about your experience..."
                value={form.comment}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <button style={styles.btn} type="submit">Submit Review ⭐</button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div style={styles.reviewsSection}>
        <h3 style={styles.reviewsTitle}>Recent Reviews</h3>
        {loading && <p style={styles.empty}>Loading reviews...</p>}
        {!loading && reviews.length === 0 && (
          <p style={styles.empty}>No reviews yet — be the first to review!</p>
        )}
        {reviews.map(r => (
          <div key={r.id} style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              <div>
                <p style={styles.reviewName}>{r.cname}</p>
                <p style={styles.reviewRef}>Booking: {r.booking_ref}</p>
              </div>
              <div style={styles.reviewRight}>
                <StarRating rating={r.rating} onRate={null} />
                <p style={styles.reviewDate}>
                  {new Date(r.review_datetime).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            {r.comment && <p style={styles.reviewComment}>{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '2rem auto', padding: '1rem' },
  title: { textAlign: 'center', color: '#f7c948', marginBottom: '0.5rem' },
  subtitle: { textAlign: 'center', color: '#9090b0', marginBottom: '1.5rem' },
  statsBar: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  statItem: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '12px', padding: '1rem', textAlign: 'center' },
  statNumber: { color: '#f7c948', fontSize: '2.5rem', fontWeight: 'bold', margin: 0 },
  statLabel: { color: '#9090b0', fontSize: '0.85rem', marginBottom: '0.5rem' },
  formCard: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' },
  formTitle: { color: '#f7c948', marginBottom: '1rem' },
  error: { color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' },
  label: { color: '#9090b0', fontSize: '0.85rem' },
  input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #2a2a4e', background: '#0d0d1a', color: '#fff', fontSize: '0.95rem' },
  textarea: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #2a2a4e', background: '#0d0d1a', color: '#fff', fontSize: '0.95rem', resize: 'vertical' },
  ratingLabel: { textAlign: 'center', color: '#f7c948', fontWeight: 'bold', marginTop: '-0.5rem' },
  btn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #f7c948, #f4a011)', color: '#0d0d1a', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  successCard: { background: '#1a1a2e', border: '1px solid #51cf66', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '2rem' },
  successIcon: { fontSize: '3rem', margin: 0 },
  successTitle: { color: '#51cf66', marginBottom: '0.5rem' },
  successText: { color: '#9090b0', marginBottom: '1.5rem' },
  reviewsSection: { marginTop: '1rem' },
  reviewsTitle: { color: '#f7c948', marginBottom: '1rem' },
  empty: { textAlign: 'center', color: '#9090b0', padding: '2rem' },
  reviewCard: { background: '#1a1a2e', border: '1px solid #2a2a4e', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  reviewName: { color: '#fff', fontWeight: 'bold', margin: 0 },
  reviewRef: { color: '#9090b0', fontSize: '0.8rem', margin: 0 },
  reviewRight: { textAlign: 'right' },
  reviewDate: { color: '#9090b0', fontSize: '0.8rem', margin: 0 },
  reviewComment: { color: '#ccc', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: '1.5' }
}

export default CustomerReview