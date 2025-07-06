'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AnalyticsData {
  date: string;
  new_users: number;
  new_events: number;
  active_users: number;
}

interface AnalyticsChartsProps {
  onError: (error: string) => void;
}

export default function AnalyticsCharts({ onError }: AnalyticsChartsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_analytics', { days_back: timeRange });
      if (error) throw error;
      setAnalytics(data || []);
    } catch (err: any) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totals = analytics.reduce(
    (acc, day) => ({
      users: acc.users + day.new_users,
      events: acc.events + day.new_events,
      active: acc.active + day.active_users,
    }),
    { users: 0, events: 0, active: 0 }
  );

  if (loading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="border rounded px-3 py-1"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">New Users</h3>
            <p className="text-2xl font-bold text-blue-900">{totals.users}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">New Events</h3>
            <p className="text-2xl font-bold text-green-900">{totals.events}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">Active Users</h3>
            <p className="text-2xl font-bold text-purple-900">{totals.active}</p>
          </div>
        </div>

        {/* Simple Data Table (could be replaced with charts later) */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">New Users</th>
                <th className="px-4 py-2 text-left">New Events</th>
                <th className="px-4 py-2 text-left">Active Users</th>
              </tr>
            </thead>
            <tbody>
              {analytics.slice(0, 10).map((day) => (
                <tr key={day.date} className="border-b">
                  <td className="px-4 py-2 text-sm">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">{day.new_users}</td>
                  <td className="px-4 py-2 text-sm">{day.new_events}</td>
                  <td className="px-4 py-2 text-sm">{day.active_users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
