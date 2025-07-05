'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MobileFloatingAction() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide FAB when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="sm:hidden fixed bottom-20 right-4 z-50">
      <Link
        href="/submit"
        className={`
          flex items-center justify-center
          w-14 h-14 bg-green-500 hover:bg-green-600 active:bg-green-700
          text-white rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
          active:scale-95
        `}
        aria-label="Submit new event"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}
