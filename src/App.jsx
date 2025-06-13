import React from 'react';
import SpaceTracker from './components/SpaceTracker';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-black/30 backdrop-blur-sm py-8 sticky top-0 z-50 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            ISS Tracker
          </h1>
          <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
            Track the International Space Station in real-time using live TLE data. 
            Watch as it orbits Earth at approximately 7.66 kilometers per second, 
            completing an orbit every 92.68 minutes.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SpaceTracker />
      </main>

      <footer className="bg-black/30 backdrop-blur-sm py-6 mt-8 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">About ISS</h3>
              <p className="text-gray-400 text-sm">
                The International Space Station is a modular space station in low Earth orbit. 
                It's a multinational collaborative project involving NASA, Roscosmos, ESA, JAXA, and CSA.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Technical Details</h3>
              <p className="text-gray-400 text-sm">
                Data updated every second using TLE (Two-Line Element) sets from Celestrak. 
                Position calculated using SGP4 orbital propagation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Quick Facts</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>Orbital Speed: ~7.66 km/s</li>
                <li>Orbital Period: ~92.68 minutes</li>
                <li>Mass: ~419,725 kg</li>
                <li>Altitude: ~408 km</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>© 2024 • Data provided by Celestrak • Updated in real-time</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 