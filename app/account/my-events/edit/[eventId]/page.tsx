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
          .eq('id', eventId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const fetchedEvent: Event = {
            id: data.id,
            title: data.title,
            description: data.description,
            date_time: data.date_time,
            end_time: data.end_time,
            location: data.location,
            coordinates: data.coordinates,
            town: data.town,
            category: data.category,
            tags: data.tags || [],
            image_url: data.image_url,
            creator_id: data.creator_id,
            is_featured: data.is_featured,
            view_count: data.view_count,
            status: data.status,
            created_at: data.created_at,
            updated_at: data.updated_at,
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
