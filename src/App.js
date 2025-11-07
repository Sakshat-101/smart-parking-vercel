import React, { useState } from 'react';

const initialSpots = [
  { id: 1, location: "A1", occupied: false },
  { id: 2, location: "A2", occupied: true },
  { id: 3, location: "B1", occupied: false },
  { id: 4, location: "B2", occupied: true },
];

function App() {
  const [spots, setSpots] = useState(initialSpots);

  const toggleSpot = (id) => {
    setSpots(spots.map(spot =>
      spot.id === id ? { ...spot, occupied: !spot.occupied } : spot
    ));
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: 20 }}>
      <h1>IoT Smart Parking System Demo</h1>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {spots.map(spot => (
          <div
            key={spot.id}
            onClick={() => toggleSpot(spot.id)}
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: spot.occupied ? "#e74c3c" : "#2ecc71",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}
            title={`Spot ${spot.location} - ${spot.occupied ? "Occupied" : "Available"}`}
          >
            <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>{spot.location}</span>
            <span>{spot.occupied ? "Occupied" : "Available"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

