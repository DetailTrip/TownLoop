'use client';

import EventCard from './EventCard';
import CardGrid from '@/components/layout/CardGrid';
import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { formatTownName } from '@/lib/utils';
import { useUser } from '@/lib/context/UserContext';
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export default function UpcomingEvents({ townSlug }: { townSlug?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: isUserLoading } = useUser();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('events').select('id, title, description, date_time, location, image_url, tags, town');

        if (townSlug) {
          query = query.eq('town', townSlug);
        }

        const { data, error } = await query.order('date_time', { ascending: true }).limit(5);

        if (error) {
          throw error;
        }
        
        const fetchedEvents: Event[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          date_time: item.date_time,
          location: item.location,
          image_url: item.image_url,
          tags: item.tags || [],
          town: item.town,
        })) as Event[]; // Cast to Event[] to satisfy TypeScript

        setEvents(fetchedEvents);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching upcoming events:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!isUserLoading) {
      fetchEvents();
    }
  }, [townSlug, isUserLoading]);

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
