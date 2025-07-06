'use client';

import { useUser } from '@/lib/context/UserContext';
import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import EventCard from '@/components/events/EventCard';

type Event = Database['public']['Tables']['events']['Row'];

export default function MyEventsPage() {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState<'created' | 'favorites'>('created');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoadingEvents(false);
        return;
      }

      setLoadingEvents(true);
      setError(null);
      
      try {
        // Fetch created events (including deleted ones for management)
        const { data: createdData, error: createdError } = await supabase
          .from('events')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (createdError) throw createdError;

        // Fetch favorite events (only active ones)
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('event_interactions')
          .select(`
            events!inner (
              *
            )
          `)
          .eq('user_id', user.id)
          .eq('interaction_type', 'favorite')
          .eq('events.status', 'active') // Only active favorite events
          .order('created_at', { ascending: false });

        if (favoritesError) throw favoritesError;

        setMyEvents(createdData || []);
        setFavoriteEvents((favoritesData as any)?.map((item: any) => item.events).filter(Boolean) || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This will hide it from the website but preserve the data.`)) {
      return;
    }

    try {
      console.log('Deleting event:', eventId, eventTitle);
      
      const { error } = await supabase
        .from('events')
        .update({ 
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Event deleted successfully in database');
      alert(`Event "${eventTitle}" deleted successfully!`);
      
      // Update the event status in the list instead of removing it
      setMyEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, status: 'deleted', updated_at: new Date().toISOString() }
            : event
        )
      );
      
      console.log('UI updated');
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert(`Failed to delete event: ${err.message}`);
    }
  };

  const handleRestore = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to restore "${eventTitle}"? This will make it visible on the website again.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) throw error;

      alert(`Event "${eventTitle}" restored successfully!`);
      // Refresh the events list
      setMyEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, status: 'active' }
            : event
        )
      );
    } catch (err: any) {
      console.error('Error restoring event:', err);
      alert(`Failed to restore event: ${err.message}`);
    }
  };

  if (userLoading || loadingEvents) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">My Events</h1>
          <p className="text-gray-600 mb-6">You must be logged in to view your events.</p>
          <Link 
            href="/auth" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Login or Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600 mt-2">Manage your created events and saved favorites</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('created')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'created'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Created Events ({myEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'favorites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Favorite Events ({favoriteEvents.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                Error: {error}
              </div>
            )}

            {activeTab === 'created' && (
              <div>
                {myEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h3>
                    <p className="text-gray-600 mb-4">Start by creating your first event!</p>
                    <Link 
                      href="/submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Create Event
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myEvents.map(event => (
                      <div key={event.id} className={`border rounded-lg p-4 transition-colors duration-200 ${
                        event.status === 'deleted' 
                          ? 'border-red-200 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${
                                event.status === 'deleted' ? 'text-red-700' : 'text-gray-900'
                              }`}>
                                {event.title}
                              </h3>
                              {event.status === 'deleted' && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                  Deleted
                                </span>
                              )}
                              {event.status === 'draft' && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                  Draft
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.date_time).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-3 ml-4">
                            {event.status !== 'deleted' && (
                              <>
                                <Link 
                                  href={`/events/${event.id}`} 
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  View
                                </Link>
                                <Link 
                                  href={`/account/my-events/edit/${event.id}`} 
                                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                                >
                                  Edit
                                </Link>
                                <button 
                                  onClick={() => handleDelete(event.id, event.title)}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                            {event.status === 'deleted' && (
                              <button 
                                onClick={() => handleRestore(event.id, event.title)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Restore
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                {favoriteEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite events yet</h3>
                    <p className="text-gray-600 mb-4">Start favoriting events you&apos;re interested in!</p>
                    <Link 
                      href="/events" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}