import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import * as satellite from 'satellite.js';

const SpaceTracker = () => {
  const [issPosition, setIssPosition] = useState({ latitude: 0, longitude: 0, altitude: 0, velocity: 0 });
  const [loading, setLoading] = useState(true);
  const [orbitPath, setOrbitPath] = useState({ lons: [], lats: [] });
  const [groundTrack, setGroundTrack] = useState({ lons: [], lats: [] });
  const [stats, setStats] = useState({ 
    orbitalPeriod: 0,
    eccentricity: 0,
    inclination: 0,
    epoch: ''
  });
  const plotRef = useRef(null);

  // Current ISS TLE data
  const tleLine1 = '1 25544U 98067A   25162.87378584  .00008511  00000+0  15622-3 0  9999';
  const tleLine2 = '2 25544  51.6380 333.4042 0001399 212.1497 291.1430 15.50130147514335';

  useEffect(() => {
    const calculateOrbitPath = () => {
      const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
      const points = [];
      const groundPoints = [];
      const now = new Date();
      
      // Calculate positions for next 90 minutes (one orbit)
      for (let i = 0; i < 90; i++) {
        const time = new Date(now.getTime() + i * 60000);
        const positionAndVelocity = satellite.propagate(satrec, time);
        const gmst = satellite.gstime(time);
        const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
        
        points.push({
          longitude: satellite.degreesLong(position.longitude),
          latitude: satellite.degreesLat(position.latitude)
        });

        // Add ground track points
        if (i % 5 === 0) { // Add a point every 5 minutes to reduce density
          groundPoints.push({
            longitude: satellite.degreesLong(position.longitude),
            latitude: satellite.degreesLat(position.latitude)
          });
        }
      }

      setOrbitPath({
        lons: points.map(p => p.longitude),
        lats: points.map(p => p.latitude)
      });

      setGroundTrack({
        lons: groundPoints.map(p => p.longitude),
        lats: groundPoints.map(p => p.latitude)
      });

      // Calculate orbital parameters
      const meanMotion = parseFloat(tleLine2.substring(52, 63));
      const eccentricity = parseFloat('0.' + tleLine2.substring(26, 33));
      const inclination = parseFloat(tleLine2.substring(8, 16));
      const epochYear = parseInt(tleLine1.substring(18, 20));
      const epochDay = parseFloat(tleLine1.substring(20, 32));
      
      const year = epochYear < 57 ? 2000 + epochYear : 1900 + epochYear;
      const date = new Date(year, 0);
      date.setDate(1 + epochDay);

      setStats({
        orbitalPeriod: (24 * 60) / meanMotion,
        eccentricity: eccentricity,
        inclination: inclination,
        epoch: date.toISOString().split('T')[0]
      });
    };

    calculateOrbitPath();
    const interval = setInterval(calculateOrbitPath, 60000); // Update orbit path every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculatePosition = () => {
      try {
        const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
        const now = new Date();
        const positionAndVelocity = satellite.propagate(satrec, now);
        const gmst = satellite.gstime(now);
        const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
        
        // Calculate velocity magnitude
        const velocity = Math.sqrt(
          Math.pow(positionAndVelocity.velocity.x, 2) +
          Math.pow(positionAndVelocity.velocity.y, 2) +
          Math.pow(positionAndVelocity.velocity.z, 2)
        );

        const latitude = satellite.degreesLat(position.latitude);
        const longitude = satellite.degreesLong(position.longitude);
        const altitude = position.height * 1000; // Convert to meters

        setIssPosition({
          latitude,
          longitude,
          altitude,
          velocity
        });
        setLoading(false);
      } catch (error) {
        console.error('Error calculating ISS position:', error);
        setLoading(false);
      }
    };

    calculatePosition();
    const interval = setInterval(calculatePosition, 1000);
    return () => clearInterval(interval);
  }, []);

  const mapData = [
    // Ground track
    {
      type: 'scattergeo',
      lon: groundTrack.lons,
      lat: groundTrack.lats,
      mode: 'lines',
      line: {
        width: 1,
        color: '#4299E1',
        dash: 'dot'
      },
      opacity: 0.3,
      name: 'Ground Track'
    },
    // Orbit path
    {
      type: 'scattergeo',
      lon: orbitPath.lons,
      lat: orbitPath.lats,
      mode: 'lines',
      line: {
        width: 2,
        color: '#4299E1'
      },
      opacity: 0.5,
      name: 'Orbit Path'
    },
    // Current ISS position
    {
      type: 'scattergeo',
      lon: [issPosition.longitude],
      lat: [issPosition.latitude],
      mode: 'markers+text',
      text: ['ISS'],
      textposition: 'top',
      marker: {
        size: 12,
        color: '#F56565',
        symbol: 'star'
      },
      name: 'ISS Location'
    }
  ];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    geo: {
      projection: {
        type: 'orthographic',
        rotation: {
          lon: issPosition.longitude,
          lat: issPosition.latitude
        }
      },
      showland: true,
      showocean: true,
      showcoastlines: true,
      showcountries: true,
      oceancolor: '#1A365D',
      landcolor: '#2D3748',
      coastlinecolor: '#4A5568',
      countrycolor: '#4A5568',
      bgcolor: 'rgba(0,0,0,0)',
      lonaxis: {
        showgrid: true,
        gridcolor: '#4A5568',
        gridwidth: 0.5
      },
      lataxis: {
        showgrid: true,
        gridcolor: '#4A5568',
        gridwidth: 0.5
      }
    },
    margin: { t: 0, b: 0, l: 0, r: 0 },
    height: 600,
    showlegend: false
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Latitude</h3>
              <p className="text-3xl font-bold text-blue-400">{issPosition.latitude.toFixed(2)}°</p>
              <p className="text-sm text-gray-400 mt-1">North/South position</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Longitude</h3>
              <p className="text-3xl font-bold text-blue-400">{issPosition.longitude.toFixed(2)}°</p>
              <p className="text-sm text-gray-400 mt-1">East/West position</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Altitude</h3>
              <p className="text-3xl font-bold text-blue-400">{(issPosition.altitude / 1000).toFixed(2)} km</p>
              <p className="text-sm text-gray-400 mt-1">Above Earth's surface</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Velocity</h3>
              <p className="text-3xl font-bold text-blue-400">{(issPosition.velocity).toFixed(2)} km/s</p>
              <p className="text-sm text-gray-400 mt-1">Orbital speed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <Plot
                ref={plotRef}
                data={mapData}
                layout={layout}
                config={config}
                className="w-full"
              />
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Orbital Parameters</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Orbital Period</p>
                  <p className="text-lg font-semibold text-blue-400">{stats.orbitalPeriod.toFixed(2)} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Eccentricity</p>
                  <p className="text-lg font-semibold text-blue-400">{stats.eccentricity.toFixed(7)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Inclination</p>
                  <p className="text-lg font-semibold text-blue-400">{stats.inclination.toFixed(2)}°</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">TLE Epoch</p>
                  <p className="text-lg font-semibold text-blue-400">{stats.epoch}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceTracker; 