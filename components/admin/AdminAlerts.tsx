'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AdminAlert {
  id: string;
  alert_type: string;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
  expires_at: string | null;
}

interface AdminAlertsProps {
  onError?: (error: string) => void;
}

export default function AdminAlerts({ onError }: AdminAlertsProps) {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('unresolved');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    loadAdminAlerts();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('admin_alerts_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_alerts'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts(current => [payload.new as AdminAlert, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(current => 
              current.map(alert => 
                alert.id === payload.new.id ? payload.new as AdminAlert : alert
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAdminAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_admin_alerts', {
        unread_only: false
      });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      console.error('Error loading admin alerts:', error);
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase.rpc('mark_alert_read', {
        alert_id: alertId
      });

      if (error) throw error;
      
      // Update local state
      setAlerts(current => 
        current.map(alert => 
          alert.id === alertId 
            ? { ...alert, is_read: true }
            : alert
        )
      );
    } catch (error: any) {
      console.error('Error resolving alert:', error);
      onError?.(error.message);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (alertType: string) => {
    switch (alertType.toLowerCase()) {
      case 'critical':
      case 'error':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'warning':
        return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'performance':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'info':
      case 'system':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getSeverityIcon = (alertType: string) => {
    switch (alertType.toLowerCase()) {
      case 'critical':
      case 'error':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'performance':
        return '⚡';
      case 'info':
      case 'system':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getAlertTypeIcon = (alertType: string) => {
    switch (alertType.toLowerCase()) {
      case 'security':
        return '🔒';
      case 'performance':
        return '📈';
      case 'error':
        return '❌';
      case 'system':
        return '🖥️';
      case 'user':
        return '👤';
      case 'content':
        return '📝';
      default:
        return '📢';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesResolved = filter === 'all' || 
      (filter === 'resolved' && alert.is_read) ||
      (filter === 'unresolved' && !alert.is_read);
    
    const matchesSeverity = severityFilter === 'all' || alert.alert_type === severityFilter;
    
    return matchesResolved && matchesSeverity;
  });

  const unresolvedCount = alerts.filter(alert => !alert.is_read).length;
  const criticalCount = alerts.filter(alert => !alert.is_read && (alert.alert_type === 'critical' || alert.alert_type === 'error')).length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">
              🚨 Admin Alerts
            </h2>
            <div className="flex space-x-2">
              {unresolvedCount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                  {unresolvedCount} unresolved
                </span>
              )}
              {criticalCount > 0 && (
                <span className="px-2 py-1 bg-red-200 text-red-800 text-sm rounded-full">
                  {criticalCount} critical
                </span>
              )}
            </div>
          </div>
          <button
            onClick={loadAdminAlerts}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Alerts</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="performance">Performance</option>
              <option value="info">Info</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {filter === 'unresolved' ? 
              'No unresolved alerts. All good! 🎉' : 
              'No alerts found.'
            }
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  alert.is_read ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg">
                        {getAlertTypeIcon(alert.alert_type)}
                      </span>
                      <span className="text-lg">
                        {getSeverityIcon(alert.alert_type)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.alert_type)}`}>
                          {alert.alert_type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600 capitalize">
                          {alert.alert_type}
                        </span>
                        {alert.is_read && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            ✅ READ
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-gray-800 mb-1">
                        {alert.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {alert.message}
                      </p>
                      
                      <div className="text-xs text-gray-500">
                        <div>Created: {formatTimestamp(alert.created_at)}</div>
                        {alert.entity_type && (
                          <div>Entity: {alert.entity_type}</div>
                        )}
                        {alert.expires_at && (
                          <div>Expires: {formatTimestamp(alert.expires_at)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {!alert.is_read && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        ✅ Mark Read
                      </button>
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
