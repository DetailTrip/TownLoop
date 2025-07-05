'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const heroImages = [
  { src: 'https://picsum.photos/id/1015/800/600', alt: 'Community event' },
  { src: 'https://picsum.photos/id/1018/800/600', alt: 'Local festival' },
  { src: 'https://picsum.photos/id/1019/800/600', alt: 'Town square' },
  { src: 'https://picsum.photos/id/1020/800/600', alt: 'Outdoor activity' },
];

export default function Hero() {
  const [find, setFind] = useState('an event');
  const [near, setNear] = useState('Timmins');
  const [on, setOn] = useState('Today');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      find: find,
      near: near,
      on: on,
    }).toString();
    router.push(`/events?${query}`);
  };

  return (
    <div className="relative bg-gray-800 text-white py-8 px-4 text-center overflow-hidden sm:py-12 md:py-20 lg:py-24">
      {/* Image Grid Background */}
      <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 opacity-20 z-0">
        {heroImages.map((img, index) => (
          <div key={index} className="relative w-full h-full">
            <Image src={img.src} fill style={{ objectFit: 'cover' }} alt={img.alt} sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" />
          </div>
        ))}
      </div>
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
          The Heartbeat of<br className="sm:hidden" /> Cochrane District
        </h1>
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto">
          Your guide to Timmins, Kapuskasing & Beyond.<br className="hidden md:inline" />
          <span className="hidden lg:inline"> Discover local events, connect with your community, and never miss what's happening around you.</span>
        </p>
        
        {/* Mobile: Simple Search */}
        <div className="mt-6 sm:hidden">
          <button 
            onClick={() => router.push('/events')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg w-full max-w-xs mx-auto block transition-colors duration-200"
          >
            Find Events
          </button>
          <p className="mt-2 text-xs text-gray-300">Discover what&apos;s happening in your area</p>
        </div>

        {/* Desktop: Enhanced Search Form */}
        <div className="mt-8 sm:mt-12 max-w-5xl mx-auto bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl hidden sm:block border border-white/20">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-3 text-lg md:text-xl font-semibold">
              <span>Find</span>
            </div>
            <select 
              value={find}
              onChange={(e) => setFind(e.target.value)}
              className="flex-1 bg-white text-gray-800 p-3 md:p-4 rounded-lg text-base md:text-lg font-medium min-w-0 shadow-sm"
            >
              <option value="an event">an event</option>
              <option value="a place">a place</option>
              <option value="a deal">a deal</option>
            </select>
            <div className="flex items-center space-x-3 text-lg md:text-xl font-semibold">
              <span>near</span>
            </div>
            <select 
              value={near}
              onChange={(e) => setNear(e.target.value)}
              className="flex-1 bg-white text-gray-800 p-3 md:p-4 rounded-lg text-base md:text-lg font-medium min-w-0 shadow-sm"
            >
              <option value="Timmins">Timmins</option>
              <option value="Kapuskasing">Kapuskasing</option>
              <option value="Cochrane">Cochrane</option>
            </select>
            <div className="flex items-center space-x-3 text-lg md:text-xl font-semibold">
              <span>on</span>
            </div>
            <select 
              value={on}
              onChange={(e) => setOn(e.target.value)}
              className="flex-1 bg-white text-gray-800 p-3 md:p-4 rounded-lg text-base md:text-lg font-medium min-w-0 shadow-sm"
            >
              <option value="Today">Today</option>
              <option value="This Weekend">This Weekend</option>
              <option value="Next Week">Next Week</option>
            </select>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg flex-shrink-0 text-base md:text-lg font-semibold transition-all duration-200 hover:shadow-lg">
              Search Events
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}