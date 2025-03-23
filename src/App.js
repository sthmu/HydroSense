import React, { useState, useEffect } from "react";
import { database, ref, onValue } from "./firebaseConfig";
import { Gauge } from "./Components/Gauge";
import "bootstrap/dist/css/bootstrap.min.css";

const DEFAULT_TANK_HEIGHT = 100; // Default tank height in cm
const MAX_RETRIES = 5; // Max retry attempts for Firebase connection

function App() {
  const [tankHeight, setTankHeight] = useState(DEFAULT_TANK_HEIGHT);
  const [sensorData, setSensorData] = useState({
    distance: 0,
    tds: 0,
    temperature: 0,
  });
  const [error, setError] = useState(false);
  const [lastFetchedData, setLastFetchedData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const fetchData = () => {
      try {
        if (database) {
          const sensorRef = ref(database, "sensor");
          onValue(sensorRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setSensorData(data);
              setLastFetchedData(data); // Save last successful data
              setError(false);
              setRetryCount(0); // Reset retry counter on success
            } else {
              handleError();
            }
          }, handleError);
        } else {
          console.error("Database is not initialized.");
          handleError();
        }
      } catch (err) {
        handleError();
      }
    };

    const handleError = () => {
      console.error("Firebase connection error.");
      setError(true);
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchData();
        }, 5000);
      }
    };

    fetchData();
  }, [retryCount]);

  const handleTankHeightChange = (e) => {
    const value = parseFloat(e.target.value);
    setTankHeight(value > 0 ? value : DEFAULT_TANK_HEIGHT);
  };

  // Use last fetched data if new data fails
  const safeSensorData = error && lastFetchedData ? lastFetchedData : sensorData;

  // Calculate water level percentage safely

  const waterQuality = 3 * safeSensorData.tds;
  const waterLevel = Math.max(0, Math.min(100, ((tankHeight - (safeSensorData.distance - 20)) / tankHeight) * 100));
  // const waterQuality =(Math.max(0, Math.min(100, ( tdsVal/ 500) * 100)));
  console.log(safeSensorData.tds);

  const temperature = Math.max(0, Math.min(100, (safeSensorData.temperature / 50) * 100));

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">hydrosense Tank Monitoring</h1>

      <div className="mt-5 mb-5">
        <label className="form-label">Enter Tank Height (cm):</label>
        <input
          type="number"
          className="form-control"
          value={tankHeight}
          onChange={handleTankHeightChange}
        />
      </div>

      {error && (
        <div className="alert alert-danger">
          ⚠️ Connection to Firebase failed. Retrying... (Attempt {retryCount}/{MAX_RETRIES})
        </div>
      )}

      {!isOnline && (
        <div className="alert alert-warning">
          ⚠️ You are offline. Some data may not be updated.
        </div>
      )}

      <div className="row mt-5">
        <div className="col-md-4">
          <h3>Water Level</h3>
          <Gauge
            percent={waterLevel}
            radius={80}
            text={`${waterLevel.toFixed(2)}%`}
            colors={["#1267ff", "#98c0ff"]} // Blue shades
          />
          <p></p>
        </div>

        <div className="col-md-4">
          <h3>Water Quality</h3>
          <Gauge
            percent={waterQuality}
            radius={80}
            text={
              waterQuality === 0
                ? "Error"
                : waterQuality > 66
                  ? "Bad"
                  : waterQuality > 33
                    ? "Poor"
                    : "Good"
            }
            colors={[
              waterQuality > 66 ? "#ff0000" : waterQuality > 33 ? "#FFA500" : "#00ff00",  // Primary color
              waterQuality > 66 ? "#B22222" : waterQuality > 33 ? "#FFB347" : "#00cc00"   // Close gradient color
            ]}
          />

        </div>

        <div className="col-md-4">
          <h3>Temperature</h3>
          <Gauge
            percent={temperature}
            radius={80}
            text="Temp"
            colors={["#F53B3B", "#4D93DD"]} // Blue → Red
          />
          <p>{safeSensorData.temperature.toFixed(2)}°C</p>
        </div>
      </div>
    </div>
  );
}

export default App;
