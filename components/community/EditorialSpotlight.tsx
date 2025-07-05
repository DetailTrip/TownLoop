import Image from 'next/image';
import Link from 'next/link';

const spotlightEvent = {
  title: 'The Annual Cochrane Polar Bear Dip',
  description: "Join hundreds of brave souls for the annual tradition. All proceeds support the local food bank. It's the coolest event of the year!",
  imageUrl: 'https://picsum.photos/id/241/800/600',
  link: '#',
};

export default function EditorialSpotlight() {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Mobile-optimized header */}
      <div className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Editorial Spotlight</h2>
        <p className="text-xs sm:text-sm text-gray-600">Featured community story</p>
      </div>
      
      {/* Image section with mobile-friendly height */}
      <div className="relative h-48 sm:h-64">
        <Image 
          src={spotlightEvent.imageUrl} 
          fill
          alt={spotlightEvent.title} 
          className="object-cover" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <h3 className="text-white text-lg sm:text-2xl font-bold leading-tight">{spotlightEvent.title}</h3>
        </div>
      </div>
      
      {/* Content section with mobile spacing */}
      <div className="p-4 sm:p-6">
        <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">{spotlightEvent.description}</p>
        <Link 
          href={spotlightEvent.link} 
          aria-label={`Learn more about ${spotlightEvent.title}`} 
          className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm sm:text-base"
        >
          Learn More 
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
