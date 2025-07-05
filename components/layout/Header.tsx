'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { towns } from '@/constants';
import { useUser } from '@/lib/context/UserContext';
import { supabase } from '@/lib/supabase/client';
import SearchModal from '@/components/search/SearchModal';

export default function Header() {
  const router = useRouter();
  const { user, session, loading } = useUser();
  const [selectedTown, setSelectedTown] = useState('Timmins'); // Default to Timmins
  const [mounted, setMounted] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add keyboard shortcut for search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      <div className="container mx-auto px-4 py-3">
        {/* Main header row */}
        <div className="flex justify-between items-center mb-3 sm:mb-0">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            TownLoop
          </Link>
          
          {/* Mobile: Auth + Search only */}
          <div className="flex items-center gap-2 sm:hidden">
            <button 
              onClick={() => setShowSearchModal(true)}
              aria-label="Search Events" 
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {!mounted || loading ? (
              <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm">
                Logout
              </button>
            ) : (
              <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Desktop: All controls */}
          <div className="hidden sm:flex items-center gap-2 md:gap-4">
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
            
            {/* Visual separator */}
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* Search Button */}
            <button 
              onClick={() => setShowSearchModal(true)}
              aria-label="Search Events" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200 hover:border-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm">Search</span>
              <span className="text-xs text-gray-400 hidden lg:inline">⌘K</span>
            </button>
            
            {/* User Auth / Profile */}
            {!mounted || loading ? (
              <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <>
                <Link href="/account/my-events" className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm">My Events</Link>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Logout</button>
              </>
            ) : (
              <Link href="/auth" aria-label="Login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Login</Link>
            )}
          </div>
        </div>

        {/* Mobile: Navigation buttons row */}
        <div className="sm:hidden">
          {/* Town Selector - Full width on mobile */}
          <div className="mb-3">
            <select 
              value={selectedTown}
              onChange={handleTownChange}
              aria-label="Select a town"
              className="w-full text-gray-600 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {towns.map(town => (
                <option key={town} value={town}>{town}</option>
              ))}
            </select>
          </div>
          
          {/* Navigation buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link href="/submit" className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm text-center">
              Submit Event
            </Link>
            <Link href="/events" className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm text-center">
              Browse Events
            </Link>
            {user && (
              <Link href="/account/my-events" className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm text-center">
                My Events
              </Link>
            )}
            <Link href="/community" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm text-center">
              Community Hub
            </Link>
          </div>
        </div>

        {/* Desktop: Navigation buttons */}
        <div className="hidden sm:flex justify-center gap-2 md:gap-4 mt-3">
          <Link href="/submit" aria-label="Submit Event" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Submit Event</Link>
          <Link href="/events" aria-label="Browse Events" className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Browse Events</Link>
          <Link href="/community" aria-label="Community Hub" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm">Community Hub</Link>
        </div>
      </div>
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
    </header>
  );
}
