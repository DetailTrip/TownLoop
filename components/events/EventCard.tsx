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
  return (
    <Link href={`/events/${event.id}`} aria-label={`View details for ${event.title}`} className="block bg-white rounded-lg shadow-md overflow-hidden w-full sm:w-72 flex-shrink-0 hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-40 w-full">
        <Image src={event.image_url || '/placeholder.png'} width={288} height={160} alt={event.title} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{new Date(event.date_time).toLocaleDateString()}</p>
        <p className="text-gray-600 text-sm mb-4">{event.location}</p>
        <div className="flex flex-wrap gap-2">
          {event.tags && event.tags.map(tag => (
            <span key={tag} className={`px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}