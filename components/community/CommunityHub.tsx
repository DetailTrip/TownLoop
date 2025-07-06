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
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <h2 className="text-lg font-bold mb-1">Community Hub</h2>
        <p className="text-xs opacity-90">Connect, engage, and grow with your community</p>
      </div>
      
      <div className="p-4 space-y-6">
        {user ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3">
              <span className="text-xl">👋</span>
            </div>
            <p className="font-semibold text-gray-800 mb-4">Welcome back,<br />{user.email?.split('@')[0]}!</p>
            
            {/* User Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
              <div className="text-center mb-3">
                <p className="text-2xl font-bold text-blue-600">1,500</p>
                <p className="text-xs text-gray-600">XP Points</p>
              </div>
              <div className="flex justify-between text-center">
                <div>
                  <p className="text-lg font-bold text-purple-600">5</p>
                  <p className="text-xs text-gray-600">Level</p>
                </div>
                <div>
                  <p className="text-lg">🏆</p>
                  <p className="text-xs text-gray-600">Community Star</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-3">
              <span className="text-xl">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Join TownLoop!</h3>
            <p className="text-xs text-gray-600 mb-4">Earn XP, unlock badges, and help shape your local events scene.</p>
            <Link 
              href="/auth" 
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Get Started
            </Link>
          </div>
        )}
        
        {/* Community Stats */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm">Community Stats</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎉</span>
                <span className="text-sm font-medium text-gray-700">Events This Month</span>
              </div>
              <span className="text-lg font-bold text-blue-600">24</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span className="text-sm font-medium text-gray-700">Active Members</span>
              </div>
              <span className="text-lg font-bold text-green-600">156</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-medium text-gray-700">Reviews</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}