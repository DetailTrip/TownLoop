'use client';

import SubmitEventForm from '@/components/forms/SubmitEventForm';
import { supabase } from '@/lib/supabase/client';
import { Event } from '@/lib/types';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import { useState, useEffect } from 'react';

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
            date: data.date,
            time: data.time,
            location: data.location,
            description: data.description,
            imageUrl: data.image_url, // Map image_url from DB to imageUrl in interface
            tags: data.tags || [],
            town: data.town,
          };
          console.log('Fetched event time:', fetchedEvent.time); // <-- ADDED LOG
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
