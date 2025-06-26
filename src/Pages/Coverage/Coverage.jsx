import React from 'react';
import MapView from './MapView';

const Coverage = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h2 className="text-3xl font-bold text-center text-primary">We are available in 64 districts</h2>

      {/* Search Box Placeholder */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search for a district..."
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {/* Map Display */}
      <MapView />
    </div>
    );
};

export default Coverage;