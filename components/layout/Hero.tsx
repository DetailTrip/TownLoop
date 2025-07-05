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
    <div className="relative bg-gray-800 text-white py-8 px-4 text-center overflow-hidden sm:py-12 md:py-16">
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

      <div className="relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
          The Heartbeat of<br className="sm:hidden" /> Cochrane District
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-xl text-gray-200">
          Your guide to Timmins, Kapuskasing & Beyond.
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

        {/* Desktop: Full Search Form */}
        <div className="mt-6 max-w-4xl mx-auto bg-white/20 backdrop-blur-sm p-4 rounded-lg hidden sm:block">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <span className="font-semibold text-sm md:text-base">Find...</span>
            <select 
              value={find}
              onChange={(e) => setFind(e.target.value)}
              className="flex-1 bg-white text-gray-800 p-2 rounded-md text-sm md:text-base"
            >
              <option value="an event">an event</option>
              <option value="a place">a place</option>
              <option value="a deal">a deal</option>
            </select>
            <span className="font-semibold text-sm md:text-base">near...</span>
            <select 
              value={near}
              onChange={(e) => setNear(e.target.value)}
              className="flex-1 bg-white text-gray-800 p-2 rounded-md text-sm md:text-base"
            >
              <option value="Timmins">Timmins</option>
              <option value="Kapuskasing">Kapuskasing</option>
              <option value="Cochrane">Cochrane</option>
            </select>
            <span className="font-semibold text-sm md:text-base">on...</span>
            <select 
              value={on}
              onChange={(e) => setOn(e.target.value)}
              className="flex-1 bg-white text-gray-800 p-2 rounded-md text-sm md:text-base"
            >
              <option value="Today">Today</option>
              <option value="This Weekend">This Weekend</option>
              <option value="Next Week">Next Week</option>
            </select>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex-shrink-0 text-sm md:text-base transition-colors duration-200">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}