'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { towns } from '@/constants';
import { useUser } from '@/lib/context/UserContext';
import { supabase } from '@/lib/supabase/client';

export default function Header() {
  const router = useRouter();
  const { user, session, loading } = useUser();
  const [selectedTown, setSelectedTown] = useState('Timmins'); // Default to Timmins

  const handleTownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const townSlug = e.target.value.toLowerCase().replace(/ /g, '-');
    setSelectedTown(e.target.value);
    router.push(`/t/${townSlug}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          TownLoop
        </Link>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          {/* Town Selector */}
          <select 
            value={selectedTown}
            onChange={handleTownChange}
            aria-label="Select a town"
            className="text-gray-600 px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {towns.map(town => (
              <option key={town} value={town}>{town}</option>
            ))}
          </select>
          {/* Search Icon */}
          <button aria-label="Search" className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {/* User Auth / Profile */}
          {!loading && (user ? (
            <>
              <Link href="/account/my-events" className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm">My Events</Link>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Logout</button>
            </>
          ) : (
            <Link href="/auth" aria-label="Login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Login</Link>
          ))}
          <Link href="/submit" aria-label="Submit Event" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Submit Event</Link>
          <Link href="/events" aria-label="Browse Events" className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Browse Events</Link>
          <Link href="/community" aria-label="Community Hub" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Community Hub</Link>
        </div>
      </div>
    </header>
  );
}
