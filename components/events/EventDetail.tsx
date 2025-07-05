'use client';

import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import RelatedEvents from './RelatedEvents';
import { Database } from '@/lib/database.types';
import { formatTownName } from '@/lib/utils';

type Event = Database['public']['Tables']['events']['Row'];

interface EventDetailProps {
  eventId: string;
}

// Helper function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export default function EventDetail({ eventId }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Special cases for testing
    if (eventId === 'test-event-123') {
      const mockEvent: Event = {
        id: 'test-event-123',
        title: 'Downtown Farmers Market',
        description: 'Fresh local produce, artisanal goods, and live music in the heart of downtown. Join us every Saturday morning for the best local vendors and community atmosphere.',
        date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        location: 'Main Street Plaza, Downtown Austin',
        town: 'austin',
        category: 'community',
        tags: ['farmers market', 'local vendors', 'fresh produce', 'family friendly'],
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        is_featured: true,
        status: 'published',
        creator_id: null,
        coordinates: null,
        view_count: 42,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setEvent(mockEvent);
      setLoading(false);
      return;
    }

    if (eventId === 'test-event-456') {
      const mockEvent: Event = {
        id: 'test-event-456',
        title: 'Live Jazz at The Blue Note',
        description: 'An intimate evening with acclaimed jazz quartet performing classic standards and original compositions. Premium cocktails and appetizers available.',
        date_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        location: 'The Blue Note Jazz Club, East 6th Street',
        town: 'austin',
        category: 'music',
        tags: ['jazz', 'live music', 'cocktails', 'date night'],
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        is_featured: false,
        status: 'published',
        creator_id: null,
        coordinates: null,
        view_count: 18,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setEvent(mockEvent);
      setLoading(false);
      return;
    }

    // Validate UUID format first
    if (!isValidUUID(eventId)) {
      setError('Invalid event ID format');
      setLoading(false);
      return;
    }

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
          setEvent(data[0]);
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
        <Spinner size="lg" />
        <p className="text-gray-600 mt-4">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Event</h2>
          <p className="text-red-600">{error}</p>
          <Link href="/events" className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/events" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date_time);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description || 'Check out this event!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-48 sm:h-64 md:h-80 w-full">
            <Image 
              src={event.image_url || '/placeholder.png'} 
              fill
              className="object-cover" 
              alt={event.title} 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Event Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Title and Town */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                {event.title}
              </h1>
              {event.town && (
                <Link 
                  href={`/t/${event.town.toLowerCase().replace(/ /g, '-')}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {formatTownName(event.town)}
                </Link>
              )}
            </div>

            {/* Date, Time, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{formattedDate}</p>
                  <p className="text-sm text-gray-600">{formattedTime}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {event.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons - Mobile First */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg transition-colors duration-200 active:scale-95"
              >
                <svg className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-xs font-medium">Share</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-lg transition-colors duration-200 active:scale-95">
                <svg className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                </svg>
                <span className="text-xs font-medium">Calendar</span>
              </button>
              
              <button className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg transition-colors duration-200 active:scale-95">
                <svg className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs font-medium">Save</span>
              </button>
              
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(event.location || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center bg-orange-50 hover:bg-orange-100 text-orange-700 p-3 rounded-lg transition-colors duration-200 active:scale-95"
              >
                <svg className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-xs font-medium">Directions</span>
              </a>
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Location Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Event Location
              </h3>
              <p className="text-gray-700 mb-3">{event.location}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(event.location || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Google Maps
              </a>
            </div>
          </div>
        </article>
      </div>
      
      {/* Related Events */}
      <RelatedEvents 
        currentEventId={eventId} 
        town={event.town} 
        tags={event.tags} 
      />
    </>
  );
}
