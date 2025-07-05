'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { towns } from '@/constants';
import { formatTownName } from '@/lib/utils';

export default function TownSelector() {
  const pathname = usePathname();
  const currentTownSlug = pathname.startsWith('/t/') ? pathname.split('/')[2] : null;
  const currentTown = currentTownSlug ? formatTownName(currentTownSlug) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Switch Location</h3>
      <div className="space-y-2">
        <Link 
          href="/"
          className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
            !currentTown 
              ? 'bg-blue-100 text-blue-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }`}
        >
          🌐 All Towns
        </Link>
        {towns.map(town => {
          const townSlug = town.toLowerCase().replace(/ /g, '-');
          const isActive = currentTown === town;
          
          return (
            <Link 
              key={town}
              href={`/t/${townSlug}`}
              className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              📍 {town}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
