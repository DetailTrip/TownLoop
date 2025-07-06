'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { towns } from '@/constants';
import { formatTownName } from '@/lib/utils';

interface TownData {
  name: string;
  slug: string;
  eventCount?: number;
  isPopular?: boolean;
}

export default function MobileTownSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get current town from URL
  const currentTownSlug = pathname.startsWith('/t/') ? pathname.split('/')[2] : null;
  const currentTown = currentTownSlug ? formatTownName(currentTownSlug) : 'All Towns';
  
  // Enhanced town data
  const townData: TownData[] = towns.map(town => ({
    name: town,
    slug: town.toLowerCase().replace(/ /g, '-'),
    eventCount: Math.floor(Math.random() * 20) + 1,
    isPopular: ['Timmins', 'Kapuskasing', 'Cochrane'].includes(town)
  }));

  const allTownsOption: TownData = {
    name: 'All Towns',
    slug: '',
    eventCount: townData.reduce((sum, town) => sum + (town.eventCount || 0), 0),
    isPopular: true
  };

  const allOptions = [allTownsOption, ...townData];

  const handleTownSelect = (townSlug: string) => {
    if (townSlug === '') {
      router.push('/');
    } else {
      router.push(`/t/${townSlug}`);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700 font-medium">{currentTown}</span>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md max-h-[80vh] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Choose Location</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Towns List */}
            <div className="overflow-y-auto max-h-96">
              {allOptions.map((town) => (
                <button
                  key={town.slug || 'all'}
                  onClick={() => handleTownSelect(town.slug)}
                  className={`w-full px-4 py-4 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                    (town.slug === '' && currentTown === 'All Towns') ||
                    (town.slug !== '' && currentTown === town.name)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {town.slug === '' ? '🌐' : town.isPopular ? '⭐' : '📍'}
                      </div>
                      <div>
                        <div className="font-medium">{town.name}</div>
                        {town.eventCount !== undefined && (
                          <div className="text-sm text-gray-500">
                            {town.eventCount} event{town.eventCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {town.isPopular && town.slug !== '' && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      {((town.slug === '' && currentTown === 'All Towns') ||
                        (town.slug !== '' && currentTown === town.name)) && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600 text-center">
                Missing your town? <button className="text-blue-600 hover:text-blue-700 font-medium">Let us know</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
