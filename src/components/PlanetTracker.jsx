import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import * as satellite from 'satellite.js';

const PlanetTracker = () => {
  const [selectedPlanet, setSelectedPlanet] = useState('mars');
  const [planetData, setPlanetData] = useState({
    position: { latitude: 0, longitude: 0 },
    distance: 0,
    velocity: 0,
    phase: 0
  });
  const [loading, setLoading] = useState(true);
  const plotRef = useRef(null);

  const planets = {
    mercury: {
      name: 'Mercury',
      color: '#E6B89C',
      diameter: 4879,
      orbitalPeriod: 88,
      avgDistance: 57.9,
      description: 'The smallest and innermost planet in the Solar System'
    },
    venus: {
      name: 'Venus',
      color: '#FFCF9C',
      diameter: 12104,
      orbitalPeriod: 225,
      avgDistance: 108.2,
      description: 'Often called Earth\'s sister planet due to similar size'
    },
    mars: {
      name: 'Mars',
      color: '#FF6B6B',
      diameter: 6792,
      orbitalPeriod: 687,
      avgDistance: 227.9,
      description: 'The Red Planet, home to the largest volcano in the Solar System'
    },
    jupiter: {
      name: 'Jupiter',
      color: '#FFB347',
      diameter: 142984,
      orbitalPeriod: 4333,
      avgDistance: 778.5,
      description: 'The largest planet in our Solar System'
    },
    saturn: {
      name: 'Saturn',
      color: '#FFD700',
      diameter: 120536,
      orbitalPeriod: 10759,
      avgDistance: 1.434e3,
      description: 'Known for its prominent ring system'
    }
  };

  useEffect(() => {
    const calculatePlanetPosition = () => {
      try {
        // This is where we'll implement actual planetary calculations
        // For now, using placeholder orbital simulation
        const now = new Date();
        const timeScale = now.getTime() / 1000; // seconds since epoch
        const planet = planets[selectedPlanet];
        const orbitalPeriod = planet.orbitalPeriod * 24 * 60 * 60; // convert days to seconds
        const phase = (timeScale % orbitalPeriod) / orbitalPeriod * 2 * Math.PI;
        
        // Simulate elliptical orbit
        const eccentricity = 0.1;
        const a = planet.avgDistance;
        const r = a * (1 - eccentricity * Math.cos(phase));
        const x = r * Math.cos(phase);
        const y = r * Math.sin(phase);
        
        // Convert to lat/long for visualization
        const longitude = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        const latitude = 0; // Simplified to ecliptic plane
        
        // Calculate velocity (simplified)
        const velocity = 2 * Math.PI * planet.avgDistance / (planet.orbitalPeriod * 24 * 60 * 60);

        setPlanetData({
          position: { latitude, longitude },
          distance: r,
          velocity: velocity,
          phase: phase * 180 / Math.PI
        });
        setLoading(false);
      } catch (error) {
        console.error('Error calculating planet position:', error);
        setLoading(false);
      }
    };

    calculatePlanetPosition();
    const interval = setInterval(calculatePlanetPosition, 1000);
    return () => clearInterval(interval);
  }, [selectedPlanet]);

  const mapData = [
    // Planet position
    {
      type: 'scattergeo',
      lon: [planetData.position.longitude],
      lat: [planetData.position.latitude],
      mode: 'markers+text',
      text: [planets[selectedPlanet].name],
      textposition: 'top',
      marker: {
        size: 16,
        color: planets[selectedPlanet].color,
        symbol: 'circle'
      },
      name: planets[selectedPlanet].name
    }
  ];

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    geo: {
      projection: {
        type: 'orthographic',
        rotation: {
          lon: planetData.position.longitude,
          lat: planetData.position.latitude
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
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(planets).map(([key, planet]) => (
              <button
                key={key}
                onClick={() => setSelectedPlanet(key)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all
                  ${selectedPlanet === key 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {planet.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Distance from Sun</h3>
              <p className="text-3xl font-bold text-blue-400">{planetData.distance.toFixed(1)} million km</p>
              <p className="text-sm text-gray-400 mt-1">Average: {planets[selectedPlanet].avgDistance} million km</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Orbital Velocity</h3>
              <p className="text-3xl font-bold text-blue-400">{planetData.velocity.toFixed(1)} km/s</p>
              <p className="text-sm text-gray-400 mt-1">Current speed in orbit</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Orbital Phase</h3>
              <p className="text-3xl font-bold text-blue-400">{planetData.phase.toFixed(1)}°</p>
              <p className="text-sm text-gray-400 mt-1">Current position in orbit</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Diameter</h3>
              <p className="text-3xl font-bold text-blue-400">{planets[selectedPlanet].diameter.toLocaleString()} km</p>
              <p className="text-sm text-gray-400 mt-1">Planet size</p>
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
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Planet Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-lg font-semibold text-blue-400">{planets[selectedPlanet].name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Orbital Period</p>
                  <p className="text-lg font-semibold text-blue-400">{planets[selectedPlanet].orbitalPeriod} Earth days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-lg font-semibold text-blue-400">{planets[selectedPlanet].description}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlanetTracker; 