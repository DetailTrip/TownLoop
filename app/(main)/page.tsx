import React from 'react';
import Hero from '@/components/layout/Hero';
import UpcomingEvents from '@/components/events/UpcomingEvents';
import CommunityHub from '@/components/community/CommunityHub';
import EditorialSpotlight from '@/components/community/EditorialSpotlight';
import SpottedFlyers from '@/components/community/SpottedFlyers';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      
      {/* Main content with sidebar layout for desktop */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 py-8 sm:py-12 lg:py-16">
          {/* Main content - 3/4 width */}
          <div className="lg:col-span-3 space-y-8 sm:space-y-12">
            <UpcomingEvents />
            
            {/* Editorial Spotlight */}
            <section>
              <EditorialSpotlight />
            </section>
            
            {/* Spotted Flyers */}
            <section>
              <SpottedFlyers />
            </section>
          </div>
          
          {/* Sidebar - 1/4 width, starts at top */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <CommunityHub />
              
              {/* Quick Actions Card - Desktop Only */}
              <div className="hidden lg:block bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/submit" className="block w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors duration-200">
                    Submit an Event
                  </a>
                  <a href="/events" className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors duration-200">
                    Browse All Events
                  </a>
                  <a href="/community" className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-4 rounded-lg text-center font-medium transition-colors duration-200">
                    Community Hub
                  </a>
                </div>
              </div>
              
              {/* Newsletter Signup - Desktop Only */}
              <div className="hidden lg:block bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Stay in the Loop</h3>
                <p className="text-blue-100 text-sm mb-4">Get weekly updates on events in your area</p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-lg text-gray-800 placeholder-gray-500 text-sm"
                  />
                  <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
