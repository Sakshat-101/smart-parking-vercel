import React, { useState, useEffect } from 'react';
import './App.css';

const initialSpots = [
  { id: 1, location: "A1", occupied: false, booking: null },
  { id: 2, location: "A2", occupied: false, booking: null },
  { id: 3, location: "B1", occupied: false, booking: null },
  { id: 4, location: "B2", occupied: false, booking: null },
  { id: 5, location: "C1", occupied: false, booking: null },
  { id: 6, location: "C2", occupied: false, booking: null },
];

const RATE_PER_HOUR = 50; // ₹50 per hour

function App() {
  const [spots, setSpots] = useState(initialSpots);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    vehicleNumber: '',
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateDuration = (startTime) => {
    const duration = (currentTime - new Date(startTime)) / 1000 / 60; // in minutes
    return Math.max(1, Math.ceil(duration)); // minimum 1 minute
  };

  const calculateCharges = (startTime) => {
    const minutes = calculateDuration(startTime);
    const hours = Math.ceil(minutes / 60);
    return hours * RATE_PER_HOUR;
  };

  const formatDuration = (startTime) => {
    const minutes = calculateDuration(startTime);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleBookSpot = (spot) => {
    if (spot.occupied) {
      setSelectedSpot(spot);
      setShowCheckoutModal(true);
    } else {
      setSelectedSpot(spot);
      setShowBookingModal(true);
    }
  };

  const submitBooking = (e) => {
    e.preventDefault();
    
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.vehicleNumber) {
      alert('Please fill all fields');
      return;
    }

    if (bookingForm.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    const booking = {
      ...bookingForm,
      startTime: new Date().toISOString(),
    };

    setSpots(spots.map(spot =>
      spot.id === selectedSpot.id
        ? { ...spot, occupied: true, booking }
        : spot
    ));

    setShowBookingModal(false);
    setBookingForm({ name: '', phone: '', vehicleNumber: '' });
    setSelectedSpot(null);
  };

  const handleCheckout = () => {
    const charges = calculateCharges(selectedSpot.booking.startTime);
    const duration = formatDuration(selectedSpot.booking.startTime);
    
    const confirmCheckout = window.confirm(
      `Checkout Details:\n\n` +
      `Name: ${selectedSpot.booking.name}\n` +
      `Vehicle: ${selectedSpot.booking.vehicleNumber}\n` +
      `Duration: ${duration}\n` +
      `Total Charges: ₹${charges}\n\n` +
      `Proceed with checkout?`
    );

    if (confirmCheckout) {
      setSpots(spots.map(spot =>
        spot.id === selectedSpot.id
          ? { ...spot, occupied: false, booking: null }
          : spot
      ));
      
      alert(`Payment of ₹${charges} received successfully!\nThank you for using our parking service.`);
      setShowCheckoutModal(false);
      setSelectedSpot(null);
    }
  };

  const availableSpots = spots.filter(s => !s.occupied).length;
  const occupiedSpots = spots.filter(s => s.occupied).length;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🚗</div>
            <div>
              <h1>Smart Parking System</h1>
              <p className="subtitle">IoT-Enabled Parking Management</p>
            </div>
          </div>
          <div className="stats">
            <div className="stat-card available">
              <span className="stat-number">{availableSpots}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-card occupied">
              <span className="stat-number">{occupiedSpots}</span>
              <span className="stat-label">Occupied</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="info-banner">
          <p>📍 Current Time: {currentTime.toLocaleString('en-IN')}</p>
          <p>💰 Parking Rate: ₹{RATE_PER_HOUR}/hour</p>
        </div>

        <div className="parking-grid">
          {spots.map(spot => (
            <div
              key={spot.id}
              className={`parking-spot ${spot.occupied ? 'occupied' : 'available'}`}
              onClick={() => handleBookSpot(spot)}
            >
              <div className="spot-header">
                <span className="spot-location">{spot.location}</span>
                <span className={`status-badge ${spot.occupied ? 'badge-occupied' : 'badge-available'}`}>
                  {spot.occupied ? '🔴 Occupied' : '🟢 Available'}
                </span>
              </div>
              
              {spot.occupied && spot.booking ? (
                <div className="booking-info">
                  <p><strong>👤 {spot.booking.name}</strong></p>
                  <p>🚗 {spot.booking.vehicleNumber}</p>
                  <p>📞 {spot.booking.phone}</p>
                  <p className="duration">
                    ⏱️ {formatDuration(spot.booking.startTime)}
                  </p>
                  <p className="charges">
                    💵 ₹{calculateCharges(spot.booking.startTime)}
                  </p>
                </div>
              ) : (
                <div className="available-info">
                  <p className="tap-message">Click to book this spot</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Parking Spot {selectedSpot?.location}</h2>
              <button className="close-btn" onClick={() => setShowBookingModal(false)}>✕</button>
            </div>
            
            <form onSubmit={submitBooking} className="booking-form">
              <div className="form-group">
                <label>👤 Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>📞 Contact Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>🚗 Vehicle Number</label>
                <input
                  type="text"
                  placeholder="e.g., MH12AB1234"
                  value={bookingForm.vehicleNumber}
                  onChange={(e) => setBookingForm({ ...bookingForm, vehicleNumber: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="rate-info">
                <p>💰 Rate: ₹{RATE_PER_HOUR}/hour</p>
                <p>🕐 Billing starts from booking time</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && selectedSpot && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Checkout - Spot {selectedSpot.location}</h2>
              <button className="close-btn" onClick={() => setShowCheckoutModal(false)}>✕</button>
            </div>
            
            <div className="checkout-details">
              <div className="detail-row">
                <span>👤 Name:</span>
                <strong>{selectedSpot.booking.name}</strong>
              </div>
              <div className="detail-row">
                <span>🚗 Vehicle:</span>
                <strong>{selectedSpot.booking.vehicleNumber}</strong>
              </div>
              <div className="detail-row">
                <span>📞 Contact:</span>
                <strong>{selectedSpot.booking.phone}</strong>
              </div>
              <div className="detail-row">
                <span>🕐 Start Time:</span>
                <strong>{new Date(selectedSpot.booking.startTime).toLocaleString('en-IN')}</strong>
              </div>
              <div className="detail-row">
                <span>⏱️ Duration:</span>
                <strong>{formatDuration(selectedSpot.booking.startTime)}</strong>
              </div>
              <div className="detail-row total">
                <span>💰 Total Charges:</span>
                <strong className="amount">₹{calculateCharges(selectedSpot.booking.startTime)}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowCheckoutModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleCheckout}>
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
