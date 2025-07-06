'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ActivityLog {
  id: string;
  user_id: string | null;
  action_type: string;
  table_name: string;
  record_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user_email?: string;
}

interface ActivityLogsProps {
  onError?: (error: string) => void;
}

export default function ActivityLogs({ onError }: ActivityLogsProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadActivityLogs();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('activity_logs_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs'
        },
        (payload) => {
          setLogs(current => [payload.new as ActivityLog, ...current.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_recent_activity_logs', {
        limit_count: 100
      });

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error loading activity logs:', error);
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionColor = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'create':
      case 'insert':
        return 'text-green-600 bg-green-50';
      case 'update':
        return 'text-blue-600 bg-blue-50';
      case 'delete':
        return 'text-red-600 bg-red-50';
      case 'login':
        return 'text-purple-600 bg-purple-50';
      case 'logout':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'create':
      case 'insert':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'login':
        return '🔐';
      case 'logout':
        return '🚪';
      default:
        return '📝';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.action_type.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' || 
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user_email && log.user_email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            📋 Live Activity Feed
          </h2>
          <button
            onClick={loadActivityLogs}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No activity logs found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">
                      {getActionIcon(log.action_type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action_type)}`}>
                          {log.action_type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          on {log.table_name}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-800">
                        {log.user_email ? (
                          <span className="font-medium">{log.user_email}</span>
                        ) : (
                          <span className="text-gray-500">System</span>
                        )}
                        {log.details && (
                          <div className="mt-1 text-xs text-gray-600 bg-gray-100 rounded p-2 max-w-md">
                            {typeof log.details === 'object' ? 
                              JSON.stringify(log.details, null, 2) : 
                              log.details
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-right">
                    <div>{formatTimestamp(log.created_at)}</div>
                    {log.ip_address && (
                      <div className="mt-1">IP: {log.ip_address}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
