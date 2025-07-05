'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleTownSelect = () => {
    // For now, we'll hardcode navigation to Timmins page.
    // Later, this will open a dropdown or modal for town selection.
    router.push('/t/timmins');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          TownLoop
        </Link>
        <div className="flex items-center space-x-4">
          {/* Town Selector */}
          <button 
            onClick={handleTownSelect}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            Timmins ▼
          </button>
          {/* Search Icon */}
          <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {/* User Auth */}
          <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">Login</Link>
          <Link href="/submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200">Submit Event</Link>
          <Link href="/events" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors duration-200">Browse Events</Link>
          <Link href="/community" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-200">Community Hub</Link>
        </div>
      </div>
    </header>
  );
}