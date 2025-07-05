'use client';

import EventCard from './EventCard';
import CardGrid from '@/components/layout/CardGrid';
import { Event } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { formatTownName } from '@/lib/utils';

const allMockEvents: Event[] = [
  {
    id: 'mock-event-1',
    title: 'Timmins Summerfest',
    date: 'Sat, Jul 12 @ 4:00 PM',
    location: 'Hollinger Park, Timmins',
    imageUrl: 'https://picsum.photos/id/237/800/600',
    tags: ['Music', 'Family'],
    town: 'timmins',
    description: 'A fun summer festival for the whole family.',
    time: '4:00 PM',
  },
  {
    id: 'mock-event-2',
    title: 'Kapuskasing Lumberjack Fest',
    date: 'Sun, Jul 13 @ 10:00 AM',
    location: 'Riverside Park, Kapuskasing',
    imageUrl: 'https://picsum.photos/id/238/800/600',
    tags: ['Outdoors', 'Free'],
    town: 'kapuskasing',
    description: 'Witness thrilling lumberjack competitions.',
    time: '10:00 AM',
  },
  {
    id: 'mock-event-3',
    title: 'Cochrane Farmers Market',
    date: 'Sat, Jul 12 @ 9:00 AM',
    location: 'Commando Pavilion, Cochrane',
    imageUrl: 'https://picsum.photos/id/239/800/600',
    tags: ['Food', 'Local'],
    town: 'cochrane',
    description: 'Fresh produce and local goods.',
    time: '9:00 AM',
  },
  {
    id: 'mock-event-4',
    title: 'Iroquois Falls Art Show',
    date: 'Mon, Jul 14 @ 6:00 PM',
    location: 'Jus Jordan Arena, Iroquois Falls',
    imageUrl: 'https://picsum.photos/id/240/800/600',
    tags: ['Art', 'Indoor'],
    town: 'iroquois-falls',
    description: 'Showcasing local artists.',
    time: '6:00 PM',
  },
  {
    id: 'mock-event-5',
    title: 'Timmins Winter Carnival',
    date: 'Sat, Feb 15 @ 1:00 PM',
    location: 'Gillies Lake, Timmins',
    imageUrl: 'https://picsum.photos/id/247/800/600',
    tags: ['Winter', 'Family'],
    town: 'timmins',
    description: 'Winter fun for everyone.',
    time: '1:00 PM',
  },
];

export default function UpcomingEvents({ townSlug }: { townSlug?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('events').select('id, title, date, time, location, description, image_url, tags, town');

        if (townSlug) {
          query = query.eq('town', townSlug);
        }

        const { data, error } = await query.order('date', { ascending: true }).limit(5);

        if (error) {
          throw error;
        }
        
        // Map Supabase data to our Event interface, handling image_url to imageUrl
        const fetchedEvents: Event[] = data.map(item => ({
          id: item.id,
          title: item.title,
          date: item.date,
          time: item.time,
          location: item.location,
          description: item.description,
          imageUrl: item.image_url, // Map image_url from DB to imageUrl in interface
          tags: item.tags || [],
          town: item.town,
        }));

        setEvents(fetchedEvents);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching upcoming events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [townSlug]);

  return (
    <CardGrid 
      title={townSlug ? `Upcoming in ${formatTownName(townSlug)}` : 'Upcoming This Week'}
      gridColsClass="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {loading && <div className="flex justify-center w-full"><Spinner /></div>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && events.length === 0 && (
        <p className="text-gray-600">No upcoming events found {townSlug ? `for ${formatTownName(townSlug)}` : ''}.</p>
      )}
      {!loading && !error && events.length > 0 && (
        events.map(event => (
          <EventCard key={event.title} event={event} />
        ))
      )}
    </CardGrid>
  );
}
