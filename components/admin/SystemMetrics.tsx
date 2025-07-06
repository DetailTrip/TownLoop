'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string | null;
  details: any;
  created_at: string;
}

interface SystemMetricsProps {
  onError?: (error: string) => void;
}

export default function SystemMetrics({ onError }: SystemMetricsProps) {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('1h');

  useEffect(() => {
    loadSystemMetrics();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('system_metrics_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_metrics'
        },
        (payload) => {
          setMetrics(current => [payload.new as SystemMetric, ...current.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [timeRange]);

  const loadSystemMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_system_health');

      if (error) throw error;
      setMetrics(data || []);
    } catch (error: any) {
      console.error('Error loading system metrics:', error);
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatValue = (value: number, unit: string | null) => {
    if (unit === 'bytes') {
      return formatBytes(value);
    } else if (unit === 'percentage') {
      return `${value.toFixed(1)}%`;
    } else if (unit === 'ms') {
      return `${value.toFixed(0)}ms`;
    } else if (unit === 'count') {
      return value.toLocaleString();
    }
    return `${value} ${unit || ''}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMetricColor = (metricName: string, value: number) => {
    switch (metricName.toLowerCase()) {
      case 'cpu_usage':
      case 'memory_usage':
        if (value > 80) return 'text-red-600 bg-red-50';
        if (value > 60) return 'text-orange-600 bg-orange-50';
        return 'text-green-600 bg-green-50';
      case 'response_time':
        if (value > 1000) return 'text-red-600 bg-red-50';
        if (value > 500) return 'text-orange-600 bg-orange-50';
        return 'text-green-600 bg-green-50';
      case 'active_connections':
        if (value > 100) return 'text-orange-600 bg-orange-50';
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getMetricIcon = (metricName: string) => {
    switch (metricName.toLowerCase()) {
      case 'cpu_usage':
        return '💻';
      case 'memory_usage':
        return '🧠';
      case 'disk_usage':
        return '💾';
      case 'response_time':
        return '⚡';
      case 'active_connections':
        return '🔗';
      case 'error_rate':
        return '❌';
      case 'throughput':
        return '📈';
      default:
        return '📊';
    }
  };

  // Group metrics by name and get the latest value for each
  const latestMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.metric_name] || new Date(metric.created_at) > new Date(acc[metric.metric_name].created_at)) {
      acc[metric.metric_name] = metric;
    }
    return acc;
  }, {} as Record<string, SystemMetric>);

  const recentMetrics = Object.values(latestMetrics);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
            🔍 System Health Metrics
          </h2>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
            <button
              onClick={loadSystemMetrics}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {recentMetrics.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No system metrics available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentMetrics.map((metric) => (
              <div
                key={metric.id}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getMetricColor(metric.metric_name, metric.metric_value)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getMetricIcon(metric.metric_name)}
                    </span>
                    <h3 className="font-medium text-gray-800 capitalize">
                      {metric.metric_name.replace(/_/g, ' ')}
                    </h3>
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="text-2xl font-bold">
                    {formatValue(metric.metric_value, metric.metric_unit)}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  <div>Updated: {formatTimestamp(metric.created_at)}</div>
                  {metric.details && (
                    <div className="mt-1 p-2 bg-gray-100 rounded text-xs">
                      {typeof metric.details === 'object' ? 
                        Object.entries(metric.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        )) :
                        metric.details
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Data Section */}
      {metrics.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
          <div className="max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {metrics.slice(0, 20).map((metric) => (
                <div key={metric.id} className="flex justify-between items-center text-sm py-2 px-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span>{getMetricIcon(metric.metric_name)}</span>
                    <span className="font-medium">{metric.metric_name.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">
                      {formatValue(metric.metric_value, metric.metric_unit)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatTimestamp(metric.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
