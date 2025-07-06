'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/ui/Spinner';
import UserManagement from '@/components/admin/UserManagement';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import BulkEventOperations from '@/components/admin/BulkEventOperations';
import PlatformSettings from '@/components/admin/PlatformSettings';
import ActivityLogs from '@/components/admin/ActivityLogs';
import SystemMetrics from '@/components/admin/SystemMetrics';
import AdminAlerts from '@/components/admin/AdminAlerts';

interface AdminStats {
  total_events: number;
  total_users: number;
  active_events: number;
  pending_events: number;
  recent_signups: number;
}

type TabType = 'overview' | 'events' | 'users' | 'analytics' | 'monitoring' | 'settings';

export default function AdminDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      if (userLoading) return;
      
      if (!user) {
        router.push('/auth');
        return;
      }

      try {
        // Check if user is admin
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin');
        
        if (adminError) {
          throw adminError;
        }

        if (!adminCheck) {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        // Load admin stats
        const { data: statsData, error: statsError } = await supabase.rpc('get_admin_stats');
        if (statsError) throw statsError;
        if (statsData && statsData.length > 0) {
          setStats(statsData[0]);
        }

      } catch (err: any) {
        console.error('Admin dashboard error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [user, userLoading, router]);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <h2 className="font-bold">Access Denied</h2>
          <p>You don't have admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'events', label: 'Event Management', icon: '🎪' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'monitoring', label: 'Live Monitoring', icon: '🔍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back, Admin! 👋
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overview Stats */}
            {stats && (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_events}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500">Active Events</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.active_events}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.total_users}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500">Pending Events</h3>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending_events}</p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'events' && <BulkEventOperations onError={handleError} />}
        {activeTab === 'users' && <UserManagement onError={handleError} />}
        {activeTab === 'analytics' && <AnalyticsCharts onError={handleError} />}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <AdminAlerts onError={handleError} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityLogs onError={handleError} />
              <SystemMetrics onError={handleError} />
            </div>
          </div>
        )}
        {activeTab === 'settings' && <PlatformSettings onError={handleError} />}
      </div>
    </div>
  );
}
