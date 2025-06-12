import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const SpaceTracker = () => {
  const [issPosition, setIssPosition] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchISSPosition = async () => {
      try {
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await response.json();
        setIssPosition({
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude)
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ISS position:', error);
        setLoading(false);
      }
    };

    fetchISSPosition();
    const interval = setInterval(fetchISSPosition, 5000);

    return () => clearInterval(interval);
  }, []);

  const mapData = [{
    type: 'scattergeo',
    lon: [issPosition.longitude],
    lat: [issPosition.latitude],
    mode: 'markers+text',
    text: ['ISS'],
    textposition: 'top',
    marker: {
      size: 12,
      color: '#FF4136',
      symbol: 'star'
    },
    name: 'ISS Location'
  }];

  const layout = {
    title: 'International Space Station Live Tracker',
    geo: {
      projection: {
        type: 'orthographic'
      },
      showland: true,
      showocean: true,
      showcoastlines: true,
      showcountries: true,
      oceancolor: '#87CEEB',
      landcolor: '#90EE90',
      countrycolor: '#d3d3d3'
    },
    updatemenus: [{
      type: 'buttons',
      showactive: false,
      buttons: [{
        method: 'relayout',
        args: ['geo.projection.type', 'orthographic'],
        label: '3D Globe'
      }, {
        method: 'relayout',
        args: ['geo.projection.type', 'mercator'],
        label: 'Flat Map'
      }]
    }],
    height: 600,
    margin: { t: 50, b: 20, l: 20, r: 20 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ISS Live Tracker
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-lg text-gray-700">
                Current Position: {issPosition.latitude.toFixed(2)}°N, {issPosition.longitude.toFixed(2)}°E
              </p>
            </div>
            <Plot
              data={mapData}
              layout={layout}
              config={{ responsive: true }}
              className="w-full"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SpaceTracker; 