'use client';

import Link from 'next/link';
import { useUser } from '@/lib/context/UserContext';
import Spinner from '@/components/ui/Spinner';

export default function CommunityHub() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">Community Hub</h2>
          <p className="text-xs sm:text-sm text-gray-600">Connect, engage, and grow with your community</p>
        </div>
        
        {user ? (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                <span className="text-2xl">👋</span>
              </div>
              <p className="text-sm sm:text-base font-semibold">Welcome back, {user.email?.split('@')[0]}!</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold">1,500</p>
                <p className="text-xs opacity-90">XP Points</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">5</p>
                <p className="text-xs opacity-90">Level</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl">🏆</p>
                <p className="text-xs opacity-90">Community Star</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-blue-200 p-4 sm:p-6 rounded-xl mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Join the TownLoop Community!</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">Earn XP, unlock badges, and help shape your local events scene.</p>
            <Link 
              href="/auth" 
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Get Started
            </Link>
          </div>
        )}
        
        {/* Quick stats - mobile optimized */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-xl sm:text-2xl mb-1">🎉</div>
            <p className="text-xs font-medium text-gray-700 mb-1">Events This Month</p>
            <p className="text-base sm:text-lg font-bold text-blue-600">24</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-xl sm:text-2xl mb-1">👥</div>
            <p className="text-xs font-medium text-gray-700 mb-1">Active Members</p>
            <p className="text-base sm:text-lg font-bold text-green-600">156</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-xl sm:text-2xl mb-1">⭐</div>
            <p className="text-xs font-medium text-gray-700 mb-1">Reviews</p>
            <p className="text-base sm:text-lg font-bold text-yellow-600">89</p>
          </div>
        </div>
      </div>
    </section>
  );
}