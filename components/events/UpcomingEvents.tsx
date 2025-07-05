import EventCard from './EventCard';

// Mock data - we will replace this with a real API call later
const allMockEvents = [
  {
    title: 'Timmins Summerfest',
    date: 'Sat, Jul 12 @ 4:00 PM',
    location: 'Hollinger Park, Timmins',
    imageUrl: 'https://picsum.photos/id/237/800/600',
    tags: ['Music', 'Family'],
    town: 'timmins',
  },
  {
    title: 'Kapuskasing Lumberjack Fest',
    date: 'Sun, Jul 13 @ 10:00 AM',
    location: 'Riverside Park, Kapuskasing',
    imageUrl: 'https://picsum.photos/id/238/800/600',
    tags: ['Outdoors', 'Free'],
    town: 'kapuskasing',
  },
  {
    title: 'Cochrane Farmers Market',
    date: 'Sat, Jul 12 @ 9:00 AM',
    location: 'Commando Pavilion, Cochrane',
    imageUrl: 'https://picsum.photos/id/239/800/600',
    tags: ['Food', 'Local'],
    town: 'cochrane',
  },
  {
    title: 'Iroquois Falls Art Show',
    date: 'Mon, Jul 14 @ 6:00 PM',
    location: 'Jus Jordan Arena, Iroquois Falls',
    imageUrl: 'https://picsum.photos/id/240/800/600',
    tags: ['Art', 'Indoor'],
    town: 'iroquois-falls',
  },
  {
    title: 'Timmins Winter Carnival',
    date: 'Sat, Feb 15 @ 1:00 PM',
    location: 'Gillies Lake, Timmins',
    imageUrl: 'https://picsum.photos/id/247/800/600',
    tags: ['Winter', 'Family'],
    town: 'timmins',
  },
];

export default function UpcomingEvents({ townSlug }: { townSlug?: string }) {
  const eventsToDisplay = townSlug 
    ? allMockEvents.filter(event => event.town === townSlug) 
    : allMockEvents;

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Upcoming {townSlug ? `in ${townSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : 'This Week'}</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {eventsToDisplay.length > 0 ? (
            eventsToDisplay.map(event => (
              <EventCard key={event.title} event={event} />
            ))
          ) : (
            <p className="text-gray-600">No upcoming events found {townSlug ? `for ${townSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : ''}.</p>
          )}
        </div>
      </div>
    </div>
  );
}
