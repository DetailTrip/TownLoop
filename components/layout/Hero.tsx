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
    <div className="relative bg-gray-800 text-white py-12 px-4 text-center overflow-hidden md:py-16">
      {/* Image Grid Background */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-1 opacity-20 z-0">
        {heroImages.map((img, index) => (
          <div key={index} className="relative w-full h-full">
            <Image src={img.src} fill style={{ objectFit: 'cover' }} alt={img.alt} sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
        ))}
      </div>
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold">The Heartbeat of Cochrane District</h1>
        <p className="mt-3 text-base md:text-xl">Your guide to Timmins, Kapuskasing & Beyond.</p>
        <div className="mt-6 max-w-full mx-auto bg-white/20 backdrop-blur-sm p-3 rounded-lg sm:max-w-4xl sm:p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3">
            <span className="font-semibold text-sm md:text-base">Find...</span>
            <select className="flex-1 bg-white text-gray-800 p-2 rounded-md text-sm md:text-base">
              <option>an event</option>
              <option>a place</option>
              <option>a deal</option>
            </select>
            <span className="font-semibold text-sm md:text-base">near...</span>
            <select className="flex-1 bg-white text-gray-800 p-2 rounded-md text-sm md:text-base">
              <option>Timmins</option>
              <option>Kapuskasing</option>
              <option>Cochrane</option>
            </select>
            <span className="font-semibold text-sm md:text-base">on...</span>
            <select className="flex-1 bg-white text-gray-800 p-2 rounded-md text-sm md:text-base">
              <option>Today</option>
              <option>This Weekend</option>
              <option>Next Week</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md flex-shrink-0 text-sm md:text-base">Search</button>
          </form>
        </div>
      </div>
    </div>
  );
}