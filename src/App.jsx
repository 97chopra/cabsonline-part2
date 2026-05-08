import { BrouserRouter as Router, Routes, Route, Link, useLocation} from 'react-router-dom'
import BookingForm from './BookingForm'
import BookingTracker from './BookingTracker'
import DriverDashboard from './DriverDashboard'
import './App.css'

function NavBar(){
  const location = useLocation();
  const links = [
    {path: '/', label: '🚕 Book a cab'},
    {path: '/track', label: '📍 Track Booking'},
    {path: '/driver', label: '🚗 Driver Dashborad'},
  ]

  return (
    <nav style={StyleSheet.nav}>
      <div style={StyleSheet.logo}>CabsOnline
        {links.map(({ path, label }) => (
          <Link key={path} to={path} style={{
            ...styles.link,
            ...(location.pathname === path ? styles.activeLink : {})
          }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function App(){
  return (
    <Router>
      <div styles={styles.app}>
        <NavBar/>
        <Routes>
          <Route path = "/" element={<BookingForm/>}/>
          <Route path="/track" element={<BokingTracker/>}/>
          <Route path = "/driver" element={<DriverDashboard/>}/>
          
        </Routes>
      </div>
      <footer styles = {styles.footer}>
      &copy; 2024 CabsOnline. -React + Node.js
      </footer>
    
    </Router>
  )

  
}

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#0d0d1a', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', background: 'linear-gradient(90deg, #1a1a2e, #16213e)', borderBottom: '1px solid #2a2a4e', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(135deg, #f7c948, #f4a011)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  navLinks: { display: 'flex', gap: '0.5rem' },
  link: { color: '#9090b0', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', transition: 'all 0.2s' },
  activeLink: { background: 'rgba(247,201,72,0.12)', color: '#f7c948', fontWeight: '600' },
  content: { flex: 1, padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' },
  footer: { textAlign: 'center', padding: '1rem', background: '#1a1a2e', color: '#555', fontSize: '0.8rem', borderTop: '1px solid #2a2a4e' }
}

export default App