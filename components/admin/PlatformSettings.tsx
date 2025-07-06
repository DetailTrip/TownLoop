'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface PlatformStats {
  total_events: number;
  total_users: number;
  database_size_mb: number;
  last_backup: string | null;
}

interface PlatformSettingsProps {
  onError: (error: string) => void;
}

export default function PlatformSettings({ onError }: PlatformSettingsProps) {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.rpc('get_platform_settings');
      if (error) throw error;
      setStats(data);
    } catch (err: any) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: 'events' | 'users') => {
    try {
      if (type === 'events') {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .csv();
        
        if (error) throw error;
        
        // Create and download CSV file
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // For users, we need to call our function
        const { data, error } = await supabase.rpc('get_all_users', { limit_count: 1000 });
        if (error) throw error;
        
        // Convert to CSV manually
        const csvContent = [
          'Email,Username,Role,Town,Created At,Event Count',
          ...data.map((user: any) => 
            `${user.email},${user.username || ''},${user.role},${user.town || ''},${user.created_at},${user.event_count}`
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      onError(err.message);
    }
  };

  if (loading) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Data Export</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => exportData('events')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center"
          >
            📊 Export Events Data
          </button>
          <button
            onClick={() => exportData('users')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center justify-center"
          >
            👥 Export Users Data
          </button>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h3 className="font-medium text-gray-700">Total Events</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.total_events}</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium text-gray-700">Total Users</h3>
              <p className="text-2xl font-bold text-green-600">{stats.total_users}</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium text-gray-700">Database Size</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.database_size_mb} MB</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium text-gray-700">Last Backup</h3>
              <p className="text-2xl font-bold text-orange-600">
                {stats.last_backup ? new Date(stats.last_backup).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading platform statistics...</p>
        )}
      </div>

      {/* System Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">System Actions</h2>
        <div className="space-y-4">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all cache?')) {
                // TODO: Implement cache clearing
                console.log('Clear cache');
              }
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
          >
            🗑️ Clear Cache
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to rebuild search index?')) {
                // TODO: Implement search index rebuild
                console.log('Rebuild search index');
              }
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
          >
            🔍 Rebuild Search Index
          </button>
        </div>
      </div>
    </div>
  );
}
