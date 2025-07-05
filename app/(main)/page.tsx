import Hero from '@/components/layout/Hero';
import UpcomingEvents from '@/components/events/UpcomingEvents';
import CommunityHub from '@/components/community/CommunityHub';
import EditorialSpotlight from '@/components/community/EditorialSpotlight';
import SpottedFlyers from '@/components/community/SpottedFlyers';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      
      {/* Main content sections with consistent mobile spacing */}
      <div className="space-y-6 sm:space-y-8 md:space-y-12">
        <UpcomingEvents />
        
        {/* Editorial Spotlight - mobile optimized */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <EditorialSpotlight />
          </div>
        </section>
        
        <CommunityHub />
        
        {/* Spotted Flyers */}
        <section className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <SpottedFlyers />
          </div>
        </section>
      </div>
    </main>
  );
}
