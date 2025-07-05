'use client';

import { useUser } from '@/lib/context/UserContext';
import { supabase } from '@/lib/supabase/client';
import { Event } from '@/lib/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';

export default function MyEventsPage() {
  const { user, loading: userLoading } = useUser();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) {
        setLoadingEvents(false);
        return;
      }

      setLoadingEvents(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, title, date, time, location, description, image_url, tags, town')
          .eq('user_id', user.id) // Filter by the current user's ID
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

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
        setMyEvents(fetchedEvents);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching my events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchMyEvents();
  }, [user]); // Re-fetch when user changes

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      alert(`Event "${eventTitle}" deleted successfully!`);
      // Remove the event from the local state
      setMyEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert(`Failed to delete event: ${err.message}`);
    }
  };

  if (userLoading || loadingEvents) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Submitted Events</h1>
        <p className="text-gray-600 mb-4">You must be logged in to view your submitted events.</p>
        <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Login or Sign Up</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-4">
        <Link href="/" className="text-blue-500 hover:text-blue-800 text-sm">&larr; Back to Home</Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Submitted Events</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        {myEvents.length === 0 ? (
          <p className="text-gray-600">You haven't submitted any events yet. <Link href="/submit" className="text-blue-500 hover:underline">Submit one now!</Link></p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {myEvents.map(event => (
              <li key={event.id} className="py-3 flex justify-between items-center">
                <span>{event.title} ({event.date})</span>
                <div>
                  <Link href={`/events/${event.id}`} className="text-blue-500 hover:underline mr-4">View</Link>
                  <Link href={`/account/my-events/edit/${event.id}`} className="text-blue-500 hover:underline mr-4">Edit</Link>
                  <button 
                    onClick={() => handleDelete(event.id, event.title)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}