import Image from 'next/image';

// This is a placeholder type. We will replace it with our actual data model from /lib/types later.
type Event = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  tags: string[];
};

const mockEvent: Event = {
  title: 'Sample Community Festival',
  date: 'Saturday, August 10, 2025',
  time: '10:00 AM - 6:00 PM',
  location: 'Main Street Park, Timmins',
  description: 'Join us for a day of fun, food, and music! Featuring local artists, food trucks, and activities for all ages. Don\'t miss the annual pie-eating contest at 3 PM!',
  imageUrl: 'https://picsum.photos/id/246/1200/800',
  tags: ['Festival', 'Family', 'Food', 'Music', 'Free'],
};

export default function EventDetail({ event = mockEvent }: { event?: Event }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image src={event.imageUrl} fill style={{ objectFit: 'cover' }} alt={event.title} sizes="100vw" />
        </div>
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
          <p className="text-gray-600 text-lg mb-2">🗓️ {event.date} at {event.time}</p>
          <p className="text-gray-600 text-lg mb-4">📍 {event.location}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {event.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>

          {/* Placeholder for Map / Directions */}
          <div className="bg-gray-100 p-4 rounded-md text-gray-700">
            <h3 className="font-semibold mb-2">Location Map</h3>
            <p>[Map will be embedded here]</p>
          </div>
        </div>
      </div>
    </div>
  );
}