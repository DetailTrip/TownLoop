'use client';

import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Spinner from '@/components/ui/Spinner';
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export default function EventDetail() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
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
          setEvent(fetchedEvent);
        } else {
          setError('Event not found.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching event details:', err);
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
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-8 text-center">Event not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image src={event.image_url || '/placeholder.png'} fill style={{ objectFit: 'cover' }} alt={event.title} sizes="100vw" />
        </div>
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
          <p className="text-gray-600 text-lg mb-2">🗓️ {new Date(event.date_time).toLocaleDateString()} at {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-gray-600 text-lg mb-4">📍 {event.location}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {event.tags && event.tags.map(tag => (
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
