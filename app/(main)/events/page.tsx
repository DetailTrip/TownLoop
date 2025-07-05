'use client';

import EventCard from '@/components/events/EventCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Mock data - same as in UpcomingEvents for now
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

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filteredEvents, setFilteredEvents] = useState(allMockEvents);
  const [find, setFind] = useState(searchParams.get('find') || '');
  const [near, setNear] = useState(searchParams.get('near') || '');
  const [on, setOn] = useState(searchParams.get('on') || '');

  useEffect(() => {
    // Basic filtering logic based on query params
    let events = allMockEvents;
    if (find && find !== 'an event') {
      // In a real app, this would filter by event type/category
      // For mock, we'll just show all for now
    }
    if (near && near !== 'All') {
      events = events.filter(event => event.town === near.toLowerCase().replace(/ /g, '-'));
    }
    if (on && on !== 'Today') {
      // In a real app, this would filter by date
      // For mock, we'll just show all for now
    }
    setFilteredEvents(events);
  }, [find, near, on, searchParams]);

  const handleFilterChange = (e: React.FormEvent) => {
    e.preventDefault();
    const newFind = (document.getElementById('filter-find') as HTMLSelectElement).value;
    const newNear = (document.getElementById('filter-near') as HTMLSelectElement).value;
    const newOn = (document.getElementById('filter-on') as HTMLSelectElement).value;

    setFind(newFind);
    setNear(newNear);
    setOn(newOn);

    const query = new URLSearchParams({
      find: newFind,
      near: newNear,
      on: newOn,
    }).toString();
    router.push(`/events?${query}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse All Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Column */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <form onSubmit={handleFilterChange}>
            <div className="mb-4">
              <label htmlFor="filter-find" className="block text-gray-700 text-sm font-bold mb-2">Find</label>
              <select id="filter-find" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={find} onChange={(e) => setFind(e.target.value)}>
                <option>an event</option>
                <option>a place</option>
                <option>a deal</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="filter-near" className="block text-gray-700 text-sm font-bold mb-2">Near</label>
              <select id="filter-near" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={near} onChange={(e) => setNear(e.target.value)}>
                <option>All</option>
                <option>Timmins</option>
                <option>Kapuskasing</option>
                <option>Cochrane</option>
                <option>Iroquois Falls</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="filter-on" className="block text-gray-700 text-sm font-bold mb-2">On</label>
              <select id="filter-on" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={on} onChange={(e) => setOn(e.target.value)}>
                <option>Today</option>
                <option>This Weekend</option>
                <option>Next Week</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Apply Filters</button>
          </form>
        </div>

        {/* Event Listings Column */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.title} event={event} />
              ))
            ) : (
              <p className="text-gray-600">No events found matching your criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
