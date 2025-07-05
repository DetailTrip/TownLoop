import Image from 'next/image';
import Link from 'next/link';
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

const getTagColor = (tag: string) => {
  switch (tag.toLowerCase()) {
    case 'free':
      return 'bg-green-200 text-green-800';
    case 'music':
      return 'bg-purple-200 text-purple-800';
    case 'family':
      return 'bg-blue-200 text-blue-800';
    case 'outdoors':
      return 'bg-yellow-200 text-yellow-800';
    case 'food':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

export default function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.date_time);
  const timeString = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  const dateString = eventDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <Link 
      href={`/events/${event.id}`} 
      aria-label={`View details for ${event.title}`} 
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl active:scale-98 transition-all duration-200 group border border-gray-100 hover:border-gray-200"
    >
      <div className="relative h-40 sm:h-48 lg:h-52 w-full overflow-hidden">
        <Image 
          src={event.image_url || '/placeholder.png'} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          alt={event.title} 
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200"></div>
        {/* Featured badge */}
        {event.is_featured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5 lg:p-6">
        <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {event.title}
        </h3>
        
        {/* Desktop: Show description */}
        <div className="hidden lg:block mb-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        </div>
        
        <div className="text-sm lg:text-base text-gray-600 mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-blue-600">{dateString} at {timeString}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="truncate">{event.location}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {event.tags && event.tags.slice(0, 4).map(tag => (
            <span key={tag} className={`px-2.5 py-1 text-xs lg:text-sm rounded-full ${getTagColor(tag)} font-medium`}>
              #{tag}
            </span>
          ))}
          {event.tags && event.tags.length > 4 && (
            <span className="px-2.5 py-1 text-xs lg:text-sm rounded-full bg-gray-100 text-gray-500 font-medium">
              +{event.tags.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}