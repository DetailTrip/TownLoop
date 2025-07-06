'use client';
import EventCard from '@/components/events/EventCard';
import CategoryFilter from '@/components/events/CategoryFilter';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase/client';
import CardGrid from '@/components/layout/CardGrid';
import { suggestedTags } from '@/constants/tags';
import { getCategoryById } from '@/constants/categories';
import dynamic from 'next/dynamic';
import Spinner from '@/components/ui/Spinner';

// Dynamically import EventMap to prevent SSR issues
const EventMap = dynamic(() => import('@/components/map/EventMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

const EVENTS_PER_PAGE = 12; // Define how many events per page

function EventsContent() {
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
  const [isMapView, setIsMapView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const from = (currentPage - 1) * EVENTS_PER_PAGE;
        const to = from + EVENTS_PER_PAGE - 1;

        let query = supabase
          .from('events')
          .select('id, title, description, date_time, location, image_url, tags, town', { count: 'exact' })
          .eq('status', 'active'); // Only show active events

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
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
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
  }, [find, near, on, selectedTags, selectedCategory, searchParams, currentPage]); // Re-fetch when currentPage changes

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
      ...(selectedCategory && { category: selectedCategory }),
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

  // Helper to check if any filters are active
  const hasActiveFilters = selectedCategory || selectedTags.length > 0 || near !== 'All' || on !== 'Today' || find !== 'an event';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse All Events</h1>
      
      {/* Mobile Filter Toggle + Map Toggle */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`md:hidden px-4 py-2 rounded-md flex items-center gap-2 ${hasActiveFilters ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L9 19.414V15.414a1 1 0 00-.293-.707L2.293 8.293A1 1 0 012 7.586V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full ml-1">
              Active
            </span>
          )}
        </button>
        <button 
          onClick={() => setIsMapView(!isMapView)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          {isMapView ? 'Show List View' : 'Show Map View'}
        </button>
      </div>

      {/* Quick Category Filter (Always Visible on Mobile) */}
      <div className="md:hidden mb-4 bg-white p-4 rounded-lg shadow-sm">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Active Filters Summary (Mobile) */}
      {hasActiveFilters && (
        <div className="md:hidden mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800 mb-2 font-medium">Active Filters:</div>
          <div className="flex flex-wrap gap-1">
            {selectedCategory && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {getCategoryById(selectedCategory)?.name}
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {tag}
                <button 
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </span>
            ))}
            {near !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Near: {near}
                <button 
                  onClick={() => setNear('All')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Column */}
        <div className={`md:col-span-1 bg-white p-6 rounded-lg shadow-md ${showFilters ? 'block' : 'hidden md:block'}`}>
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
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <CategoryFilter 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="filter-tags" className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.slice(0, showAllTags ? suggestedTags.length : 12).map(tag => (
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
              {suggestedTags.length > 12 && (
                <button 
                  type="button"
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showAllTags ? 'Show Less' : `Show ${suggestedTags.length - 12} More Tags`}
                </button>
              )}
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">Apply Filters</button>
            {hasActiveFilters && (
              <button 
                type="button" 
                onClick={() => {
                  setFind('an event');
                  setNear('All');
                  setOn('Today');
                  setSelectedTags([]);
                  setSelectedCategory(null);
                  setCurrentPage(1);
                  router.push('/events');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Clear All
              </button>
            )}
          </form>
        </div>

        {/* Event Listings / Map View Column */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{isMapView ? 'Event Map' : 'Event Listings'}</h2>
          {isMapView ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">Interactive Event Map</p>
                <p>Explore events by location. Click markers for details. {events.length > 0 ? `Showing ${events.length} events.` : 'No events to display.'}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <EventMap events={events} />
              </div>
            </div>
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

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center"><Spinner /></div>}>
      <EventsContent />
    </Suspense>
  );
}