'use client';

import Link from 'next/link';
import { formatTownName } from '@/lib/utils';

interface BreadcrumbProps {
  townSlug?: string;
  eventTitle?: string;
}

export default function Breadcrumb({ townSlug, eventTitle }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
        🏠 Home
      </Link>
      
      {townSlug && (
        <>
          <span>/</span>
          <Link 
            href={`/t/${townSlug}`} 
            className="hover:text-blue-600 transition-colors duration-200"
          >
            📍 {formatTownName(townSlug)}
          </Link>
        </>
      )}
      
      {eventTitle && (
        <>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">
            {eventTitle}
          </span>
        </>
      )}
    </nav>
  );
}
