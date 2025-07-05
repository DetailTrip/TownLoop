'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SubmitEventForm from '@/components/forms/SubmitEventForm';
import Spinner from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const eventData = data[0];
          const fetchedEvent: Event = {
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            date_time: eventData.date_time,
            end_time: eventData.end_time,
            location: eventData.location,
            coordinates: eventData.coordinates,
            town: eventData.town,
            category: eventData.category,
            tags: eventData.tags || [],
            image_url: eventData.image_url,
            creator_id: eventData.creator_id,
            is_featured: eventData.is_featured,
            view_count: eventData.view_count,
            status: eventData.status,
            created_at: eventData.created_at,
            updated_at: eventData.updated_at,
          };
          setEventData(fetchedEvent);
        } else {
          setError('Event not found.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching event for edit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Event not found for editing.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-4">
        <Link href="/" className="text-blue-500 hover:text-blue-800 text-sm">&larr; Back to Home</Link>
      </div>
      <SubmitEventForm initialData={eventData} />
    </div>
  );
}
