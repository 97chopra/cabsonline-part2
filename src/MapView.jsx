import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapView({ address }) {
  const [position, setPosition] = useState([-36.8485, 174.7633]) // Default Auckland

  useEffect(() => {
    if (address) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Auckland, New Zealand')}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)])
          }
        })
    }
  }, [address])

  return (
    <div style={{ marginTop: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
      <h3>📍 Pickup Location</h3>
      <MapContainer center={position} zoom={15} style={{ height: '300px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        <Marker position={position}>
          <Popup>{address || 'Pickup Location'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default MapView