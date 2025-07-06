'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { towns } from '@/constants';
import { formatTownName } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

interface TownData {
  name: string;
  slug: string;
  eventCount?: number;
  isPopular?: boolean;
}

export default function ImprovedTownSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [townData, setTownData] = useState<TownData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get current town from URL
  const currentTownSlug = pathname.startsWith('/t/') ? pathname.split('/')[2] : null;
  const currentTown = currentTownSlug ? formatTownName(currentTownSlug) : 'All Towns';
  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize with fallback data immediately, then fetch real counts
  useEffect(() => {
    if (!mounted) return;

    // Start with fallback data so component works immediately
    const fallbackData = towns.map(town => ({
      name: town,
      slug: town.toLowerCase().replace(/ /g, '-'),
      eventCount: 0,
      isPopular: ['Timmins', 'Kapuskasing', 'Cochrane'].includes(town)
    }));
    
    setTownData(fallbackData);
    setLoading(false);

    // Then fetch real counts in background
    const fetchEventCounts = async () => {
      try {
        // Only run on client-side
        if (typeof window === 'undefined') return;
        
        const townCounts = await Promise.all(
          towns.map(async (town) => {
            try {
              const { count } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .eq('town', town)
                .eq('status', 'active') // Only count active events
                .gte('date_time', new Date().toISOString());

              return {
                name: town,
                slug: town.toLowerCase().replace(/ /g, '-'),
                eventCount: count || 0,
                isPopular: ['Timmins', 'Kapuskasing', 'Cochrane'].includes(town)
              };
            } catch (townError) {
              console.error(`Error fetching count for ${town}:`, townError);
              return {
                name: town,
                slug: town.toLowerCase().replace(/ /g, '-'),
                eventCount: 0,
                isPopular: ['Timmins', 'Kapuskasing', 'Cochrane'].includes(town)
              };
            }
          })
        );

        setTownData(townCounts);
      } catch (error) {
        console.error('Error fetching event counts:', error);
        // Keep fallback data on error
      }
    };

    fetchEventCounts();
  }, [mounted]);

  // Add "All Towns" option with total count
  const totalEvents = townData.reduce((sum, town) => sum + (town.eventCount || 0), 0);
  const allTownsOption: TownData = {
    name: 'All Towns',
    slug: '',
    eventCount: totalEvents,
    isPopular: true
  };

  const allOptions = [allTownsOption, ...townData];
  
  // Filter towns based on search
  const filteredTowns = allOptions.filter(town =>
    town.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTownSelect = (townSlug: string) => {
    if (townSlug === '') {
      router.push('/');
    } else {
      router.push(`/t/${townSlug}`);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  // Simple toggle function
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="relative">
        {/* Mobile placeholder */}
        <div className="sm:hidden">
          <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-sm animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
        {/* Desktop placeholder */}
        <div className="hidden sm:block">
          <div className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm animate-pulse max-w-[120px]">
            <div className="h-4 bg-gray-300 rounded w-12"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Mobile: Full width button */}
      <div className="sm:hidden">
        <button
          onClick={handleDropdownToggle}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-700 font-medium">{currentTown}</span>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Desktop: Compact header button */}
      <div className="hidden sm:block">
        <button
          onClick={handleDropdownToggle}
          className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm max-w-[120px]"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          title={currentTown} // Show full name on hover
        >
          <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700 truncate flex-1 min-w-0">
            {currentTown === 'All Towns' ? 'All' : currentTown}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu - Responsive */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden ${
          // Mobile: full width, Desktop: fixed width
          'w-full sm:w-72'
        }`}>
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Towns List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredTowns.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                No towns found
              </div>
            ) : (
              filteredTowns.map((town) => (
                <button
                  key={town.slug || 'all'}
                  onClick={() => handleTownSelect(town.slug)}
                  className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 ${
                    (town.slug === '' && currentTown === 'All Towns') ||
                    (town.slug !== '' && currentTown === town.name)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="text-base flex-shrink-0">
                        {town.slug === '' ? '🌐' : town.isPopular ? '⭐' : '📍'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{town.name}</div>
                        <div className="text-xs text-gray-500">
                          {town.eventCount || 0} event{town.eventCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    {town.isPopular && town.slug !== '' && town.eventCount && town.eventCount > 0 && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        Hot
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              Missing your town? <button className="text-blue-600 hover:text-blue-700">Add it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
