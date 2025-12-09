import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMap.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LocationMap() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Auto-fetch location when component mounts
  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        // Try to get detailed address from coordinates using Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const addr = data.address || {};
          const street = addr.road || addr.street || '';
          const city_name = addr.city || addr.town || addr.village || '';
          const state_name = addr.state || '';
          
          setAddress(`${street} ${city_name}`.trim());
          setCity(city_name);
          setState(state_name);
        } catch (err) {
          console.log('Address lookup failed:', err);
          setAddress('Location found (address unavailable)');
        }

        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  };

  return (
    <div className="location-map-container">
      <div className="location-header">
        <h3>📍 My Location</h3>
      </div>

      {loading && (
        <div className="location-loading">
          <p>⏳ Fetching your location...</p>
        </div>
      )}

      {error && (
        <div className="location-error">
          <p>❌ Error: {error}</p>
        </div>
      )}

      {location && !loading && (
        <>
          <div className="location-info-card">
            <div className="info-row">
              <span className="info-label">📍 Coordinates:</span>
              <span className="info-value">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
            </div>
            
            {city && (
              <div className="info-row">
                <span className="info-label">🏙️ City:</span>
                <span className="info-value">{city}</span>
              </div>
            )}
            
            {state && (
              <div className="info-row">
                <span className="info-label">🗺️ State:</span>
                <span className="info-value">{state}</span>
              </div>
            )}
            
            {address && (
              <div className="info-row">
                <span className="info-label">📬 Address:</span>
                <span className="info-value">{address}</span>
              </div>
            )}
          </div>

          <MapContainer 
            center={[location.lat, location.lng]} 
            zoom={15} 
            style={{ height: '450px', width: '100%', marginTop: '15px', borderRadius: '8px' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                <div className="popup-content">
                  <strong>Your Location</strong><br />
                  Lat: {location.lat.toFixed(6)}<br />
                  Lng: {location.lng.toFixed(6)}<br />
                  {address && <>Address: {address}</>}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </>
      )}

      {!location && !error && !loading && (
        <div className="location-placeholder">
          <p>Unable to fetch location</p>
        </div>
      )}
    </div>
  );
}
