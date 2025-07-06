'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface PendingEvent {
  id: string;
  title: string;
  description: string;
  creator_name: string;
  created_at: string;
  status: string;
}

interface BulkEventOpsProps {
  onError: (error: string) => void;
}

export default function BulkEventOperations({ onError }: BulkEventOpsProps) {
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingEvents();
  }, []);

  const loadPendingEvents = async () => {
    try {
      const { data, error } = await supabase.rpc('get_pending_events');
      if (error) throw error;
      setPendingEvents(data || []);
    } catch (err: any) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventAction = async (eventId: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'active' : 'deleted';
      
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', eventId);

      if (error) throw error;
      await loadPendingEvents(); // Refresh
    } catch (err: any) {
      onError(err.message);
    }
  };

  const handleBulkOperation = async (action: 'approve' | 'reject') => {
    if (selectedEvents.length === 0) {
      onError('Please select events first');
      return;
    }

    try {
      const newStatus = action === 'approve' ? 'active' : 'deleted';
      
      const { error } = await supabase.rpc('bulk_update_events', {
        event_ids: selectedEvents,
        new_status: newStatus
      });

      if (error) throw error;
      
      setSelectedEvents([]);
      await loadPendingEvents(); // Refresh
    } catch (err: any) {
      onError(err.message);
    }
  };

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const selectAll = () => {
    setSelectedEvents(
      selectedEvents.length === pendingEvents.length 
        ? [] 
        : pendingEvents.map(e => e.id)
    );
  };

  if (loading) {
    return <div className="p-4">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Bulk Operations */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Event Management</h2>
          <div className="space-x-2">
            <button
              onClick={selectAll}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              {selectedEvents.length === pendingEvents.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              onClick={() => handleBulkOperation('approve')}
              disabled={selectedEvents.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Bulk Approve ({selectedEvents.length})
            </button>
            <button
              onClick={() => handleBulkOperation('reject')}
              disabled={selectedEvents.length === 0}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Bulk Reject ({selectedEvents.length})
            </button>
          </div>
        </div>

        {/* Events List */}
        {pendingEvents.length === 0 ? (
          <p className="text-gray-500">No events pending approval</p>
        ) : (
          <div className="space-y-3">
            {pendingEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEventSelection(event.id)}
                    className="rounded"
                  />
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600">by {event.creator_name}</p>
                    <p className="text-xs text-gray-500">
                      Status: {event.status} • {new Date(event.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {event.description?.substring(0, 100)}...
                    </p>
                  </div>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={() => handleEventAction(event.id, 'approve')}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleEventAction(event.id, 'reject')}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
