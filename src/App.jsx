import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BookingForm from './BookingForm'
import BookingTracker from './BookingTracker'
import DriverDashboard from './DriverDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <nav style={styles.nav}>
          <h1 style={styles.logo}>🚕 CabsOnline</h1>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>Book a Cab</Link>
            <Link to="/track" style={styles.link}>Track Booking</Link>
            <Link to="/driver" style={styles.link}>Driver Dashboard</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<BookingForm />} />
          <Route path="/track" element={<BookingTracker />} />
          <Route path="/driver" element={<DriverDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: '1rem 2rem',
    color: 'white'
  },
  logo: { margin: 0, fontSize: '1.5rem' },
  navLinks: { display: 'flex', gap: '2rem' },
  link: { color: 'white', textDecoration: 'none', fontSize: '1rem' }
}

export default App