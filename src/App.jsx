import React from 'react';
import SpaceTracker from './components/SpaceTracker';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">ISS Tracker & Space Dashboard</h1>
        </div>
      </header>
      <main>
        <SpaceTracker />
      </main>
      <footer className="bg-white mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Data provided by <a href="http://api.open-notify.org/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Open Notify API</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App; 