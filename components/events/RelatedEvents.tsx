'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import EventCard from './EventCard';
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

interface RelatedEventsProps {
  currentEventId: string;
  town?: string | null;
  tags?: string[] | null;
}

export default function RelatedEvents({ currentEventId, town, tags }: RelatedEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        let query = supabase
          .from('events')
          .select('*')
          .neq('id', currentEventId) // Exclude current event
          .order('date_time', { ascending: true })
          .limit(4);

        // If we have a town, prioritize events from the same town
        if (town) {
          query = query.eq('town', town);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching related events:', error);
          return;
        }

        if (data) {
          const relatedEvents: Event[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            date_time: item.date_time,
            end_time: item.end_time,
            location: item.location,
            coordinates: item.coordinates,
            town: item.town,
            category: item.category,
            tags: item.tags || [],
            image_url: item.image_url,
            creator_id: item.creator_id,
            is_featured: item.is_featured,
            view_count: item.view_count,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
          })) as Event[];

          setEvents(relatedEvents);
        }
      } catch (err) {
        console.error('Error fetching related events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedEvents();
  }, [currentEventId, town, tags]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Related Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null; // Don't show section if no related events
  }

  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {town ? `More Events in ${town}` : 'Related Events'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
