'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

// Fix for default marker icon not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface EventMapProps {
  events: Event[];
}

export default function EventMap({ events }: EventMapProps) {
  // Default center for the map (e.g., central Cochrane District)
  const defaultCenter: [number, number] = [48.5, -81.0]; 

  return (
    <div 
      className="w-full h-[500px] border border-gray-300 rounded-lg overflow-hidden bg-gray-100 relative"
      style={{ 
        touchAction: 'none', // Prevent default touch behaviors on the container
        contain: 'layout style paint' // Contain map rendering and interactions
      }}
    >
      <MapContainer 
        center={defaultCenter} 
        zoom={7} 
        scrollWheelZoom={false}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
        className="focus:outline-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map(event => (
          // For now, we'll use a generic position. Later, we'll need geocoding for actual locations.
          <Marker key={event.id} position={[48.5 + Math.random() * 0.1, -81.0 + Math.random() * 0.1]}> 
            <Popup>
              <strong>{event.title}</strong><br />
              {event.location}<br />
              {new Date(event.date_time).toLocaleDateString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Mobile overlay to help with touch handling */}
      <div className="absolute inset-0 pointer-events-none md:hidden">
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded shadow-sm pointer-events-none">
          Use two fingers to zoom
        </div>
      </div>
    </div>
  );
}
