'use client';

import EventCard from './EventCard';
import CardGrid from '@/components/layout/CardGrid';
import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { formatTownName } from '@/lib/utils';
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export default function UpcomingEvents({ townSlug }: { townSlug?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
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

    fetchEvents();
  }, [townSlug, mounted]);

  return (
    <CardGrid 
      title={townSlug ? `Upcoming in ${formatTownName(townSlug)}` : 'Upcoming This Week'}
      subtitle="Don't miss out on what's happening in your community"
      gridColsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      showViewAll={!townSlug}
      viewAllHref="/events"
    >
      {loading && <div className="flex justify-center w-full col-span-full"><Spinner /></div>}
      {error && <p className="text-red-500 col-span-full text-center py-8">Error: {error}</p>}
      {!loading && !error && events.length === 0 && (
        <div className="col-span-full text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
          </svg>
          <p className="text-gray-600 text-sm">No upcoming events found {townSlug ? `for ${formatTownName(townSlug)}` : ''}.</p>
          <p className="text-gray-500 text-xs mt-1">Be the first to add an event to your community!</p>
        </div>
      )}
      {!loading && !error && events.length > 0 && (
        events.map(event => (
          <EventCard key={event.title} event={event} />
        ))
      )}
    </CardGrid>
  );
}
