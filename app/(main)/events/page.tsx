'use client';
import EventCard from '@/components/events/EventCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import CardGrid from '@/components/layout/CardGrid';
import { suggestedTags } from '@/constants/tags';
import EventMap from '@/components/map/EventMap'; // Import EventMap
import Spinner from '@/components/ui/Spinner'; // Import Spinner
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

const EVENTS_PER_PAGE = 12; // Define how many events per page

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [find, setFind] = useState(searchParams.get('find') || '');
  const [near, setNear] = useState(searchParams.get('near') || '');
  const [on, setOn] = useState(searchParams.get('on') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.get('tags')?.split(',').filter(Boolean) || []);
  const [isMapView, setIsMapView] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const from = (currentPage - 1) * EVENTS_PER_PAGE;
        const to = from + EVENTS_PER_PAGE - 1;

        let query = supabase.from('events').select('id, title, description, date_time, location, image_url, tags, town', { count: 'exact' });

        if (find && find !== 'an event') {
          // In a real app, this would filter by event type/category based on 'find'
        }
        if (near && near !== 'All') {
          query = query.eq('town', near.toLowerCase().replace(/ /g, '-'));
        }
        if (on && on !== 'Today') {
          // In a real app, this would filter by date based on 'on'
        }
        if (selectedTags.length > 0) {
          query = query.contains('tags', selectedTags);
        }

        const { data, error, count } = await query
          .order('date_time', { ascending: true })
          .range(from, to);

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
        })) as Event[];

        setEvents(fetchedEvents);
        setHasMore(count ? count > to + 1 : false);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [find, near, on, selectedTags, searchParams, currentPage]); // Re-fetch when currentPage changes

  const handleFilterChange = (e: React.FormEvent) => {
    e.preventDefault();
    const newFind = (document.getElementById('filter-find') as HTMLSelectElement).value;
    const newNear = (document.getElementById('filter-near') as HTMLSelectElement).value;
    const newOn = (document.getElementById('filter-on') as HTMLSelectElement).value;

    setFind(newFind);
    setNear(newNear);
    setOn(newOn);
    setCurrentPage(1); // Reset to first page on filter change

    const query = new URLSearchParams({
      find: newFind,
      near: newNear,
      on: newOn,
      tags: selectedTags.join(','),
    }).toString();
    router.push(`/events?${query}`);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return Array.from(newTags);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse All Events</h1>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsMapView(!isMapView)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          {isMapView ? 'Show List View' : 'Show Map View'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Column */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <form onSubmit={handleFilterChange}>
            <div className="mb-4">
              <label htmlFor="filter-find" className="block text-gray-700 text-sm font-bold mb-2">Find</label>
              <select id="filter-find" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={find} onChange={(e) => setFind(e.target.value)}>
                <option>an event</option>
                <option>a place</option>
                <option>a deal</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="filter-near" className="block text-gray-700 text-sm font-bold mb-2">Near</label>
              <select id="filter-near" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={near} onChange={(e) => setNear(e.target.value)}>
                <option>All</option>
                <option>Timmins</option>
                <option>Kapuskasing</option>
                <option>Cochrane</option>
                <option>Iroquois Falls</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="filter-on" className="block text-gray-700 text-sm font-bold mb-2">On</label>
              <select id="filter-on" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={on} onChange={(e) => setOn(e.target.value)}>
                <option>Today</option>
                <option>This Weekend</option>
                <option>Next Week</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="filter-tags" className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map(tag => (
                  <button 
                    key={tag} 
                    type="button" 
                    onClick={() => handleTagToggle(tag)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors duration-200 ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Apply Filters</button>
          </form>
        </div>

        {/* Event Listings / Map View Column */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{isMapView ? 'Event Map' : 'Event Listings'}</h2>
          {isMapView ? (
            <EventMap events={events} />
          ) : (
            <CardGrid title="" gridColsClass="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {loading && <div className="flex justify-center w-full"><Spinner /></div>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && events.length === 0 && (
                <p className="text-gray-600">No events found matching your criteria.</p>
              )}
              {!loading && !error && events.length > 0 && (
                events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </CardGrid>
          )}
          <div className="flex justify-between mt-8">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Page
            </button>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!hasMore || loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}