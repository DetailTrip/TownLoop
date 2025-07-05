import Image from 'next/image';
import Link from 'next/link';
import { formatTownName } from '@/lib/utils';
import { Flyer } from '@/lib/types';

// Mock flyers for demo purposes - mobile optimized
const mockFlyers: Flyer[] = [
  {
    id: 1,
    url: 'https://picsum.photos/id/502/400/600',
    alt: 'Local concert flyer',
    link: '#',
    title: 'Live Music Night'
  },
  {
    id: 2, 
    url: 'https://picsum.photos/id/503/400/600',
    alt: 'Community garage sale',
    link: '#',
    title: 'Community Garage Sale'
  },
  {
    id: 3,
    url: 'https://picsum.photos/id/504/400/600', 
    alt: 'Fitness class flyer',
    link: '#',
    title: 'Yoga in the Park'
  },
  {
    id: 4,
    url: 'https://picsum.photos/id/505/400/600',
    alt: 'Food truck festival',
    link: '#', 
    title: 'Food Truck Festival'
  },
];

export default function SpottedFlyers({ townSlug }: { townSlug?: string }) {
  const flyersToDisplay: Flyer[] = townSlug 
    ? mockFlyers.slice(0, 2) // Show fewer for specific towns
    : mockFlyers; // Show all for homepage

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h2 className="font-bold text-lg sm:text-xl text-gray-800 mb-1">
          Spotted Flyers {townSlug ? `in ${formatTownName(townSlug)}` : ''}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">Community-shared event posters</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {flyersToDisplay.length > 0 ? (
          flyersToDisplay.map(flyer => (
            <Link 
              key={flyer.id} 
              href={flyer.link} 
              className="block bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative aspect-[3/4]">
                <Image 
                  src={flyer.url} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-200" 
                  alt={flyer.alt} 
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
              </div>
              {flyer.title && (
                <div className="p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">{flyer.title}</p>
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className="col-span-2 sm:col-span-3 md:col-span-4">
            <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-sm">No flyers spotted {townSlug ? `for ${formatTownName(townSlug)}` : ''} yet.</p>
              <p className="text-gray-500 text-xs mt-1">Check back soon for community-shared event posters!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}