import { notFound } from 'next/navigation';
import UpcomingEvents from '@/components/events/UpcomingEvents';
import CommunityHub from '@/components/community/CommunityHub';
import SpottedFlyers from '@/components/community/SpottedFlyers';
import Breadcrumb from '@/components/layout/Breadcrumb';
import TownSelector from '@/components/layout/TownSelector';
import { towns } from '@/constants';
import { formatTownName } from '@/lib/utils';

interface TownPageProps {
  params: {
    townSlug: string;
  };
}

export async function generateStaticParams() {
  return towns.map((town) => ({
    townSlug: town.toLowerCase().replace(/ /g, '-'),
  }));
}

export async function generateMetadata({ params }: TownPageProps) {
  const townName = formatTownName(params.townSlug);
  
  if (!towns.includes(townName)) {
    return {
      title: 'Town Not Found',
    };
  }

  return {
    title: `${townName} Events - TownLoop`,
    description: `Discover local events and community happenings in ${townName}. Your guide to what's happening in ${townName}.`,
    openGraph: {
      title: `${townName} Events - TownLoop`,
      description: `Local events and community happenings in ${townName}`,
    },
  };
}

export default function TownPage({ params }: TownPageProps) {
  const townName = formatTownName(params.townSlug);
  
  // Check if the town exists in our supported towns list
  if (!towns.includes(townName)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb navigation */}
      <div className="pt-4 pb-2">
        <Breadcrumb townSlug={params.townSlug} />
      </div>
      
      {/* Town-specific hero */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-8 sm:py-12 px-4 text-center mb-6">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Events in {townName}
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-blue-100">
            Discover what&apos;s happening in your community
          </p>
        </div>
      </div>
      
      {/* Main content with town selector sidebar on desktop */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8">
            <UpcomingEvents townSlug={params.townSlug} />
            <CommunityHub />
            <SpottedFlyers townSlug={params.townSlug} />
          </div>
          
          {/* Sidebar - Town selector (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <TownSelector />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
