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
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg active:scale-98 transition-all duration-200 group"
    >
      <div className="relative h-36 sm:h-40 w-full overflow-hidden">
        <Image 
          src={event.image_url || '/placeholder.png'} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          alt={event.title} 
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200"></div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {event.title}
        </h3>
        <div className="text-xs sm:text-sm text-gray-600 mb-3 space-y-1">
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
            </svg>
            <p className="font-medium text-blue-600">{dateString} at {timeString}</p>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="truncate">{event.location}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {event.tags && event.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`px-2 py-0.5 text-xs rounded-full ${getTagColor(tag)} font-medium`}>
              #{tag}
            </span>
          ))}
          {event.tags && event.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500 font-medium">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}