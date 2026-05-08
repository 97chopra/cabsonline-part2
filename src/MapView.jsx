import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// This component moves the map when position changes
function MoveMap({ position }) {
  const map = useMap()
  useEffect(() => {
    map.setView(position, 15)
  }, [position])
  return null
}

function MapView({ address, suburb }) {
  const [position, setPosition] = useState([-36.8485, 174.7633])

  useEffect(() => {
    if (address) {
      const searchQuery = suburb
        ? `${address}, ${suburb}, New Zealand`
        : `${address}, New Zealand`
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)])
          }
        })
    }
  }, [address, suburb])

  return (
    <div style={{ marginTop: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
      <h3 style={{ color: '#f7c948', marginBottom: '0.5rem' }}>📍 Pickup Location</h3>
      <MapContainer center={position} zoom={15} style={{ height: '300px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        <MoveMap position={position} />
        <Marker position={position}>
          <Popup>{address}{suburb ? `, ${suburb}` : ''}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default MapView