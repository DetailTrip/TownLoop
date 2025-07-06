import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { formatTownName } from '@/lib/utils';
import { Database } from '@/lib/database.types';
import EventCard from '@/components/events/EventCard';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

async function getProfile(username: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile;
}

async function getUserEvents(userId: string) {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })
    .limit(6);

  return events || [];
}

async function getUserFavorites(userId: string): Promise<Event[]> {
  const { data: interactions, error } = await supabase
    .from('event_interactions')
    .select(`
      events!inner (*)
    `)
    .eq('user_id', userId)
    .eq('interaction_type', 'favorite')
    .order('created_at', { ascending: false })
    .limit(6);

  return (interactions as any)?.map((interaction: any) => interaction.events as Event).filter(Boolean) || [];
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = params;
  
  const profile = await getProfile(username);
  
  if (!profile) {
    notFound();
  }

  const [userEvents, userFavorites] = await Promise.all([
    getUserEvents(profile.id),
    getUserFavorites(profile.id)
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || username}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {(profile.display_name || username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Profile Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.display_name || username}
                </h1>
                <p className="text-gray-600 mb-2">@{username}</p>
                {profile.town && (
                  <p className="text-gray-600 mb-2">
                    📍 {formatTownName(profile.town)}
                  </p>
                )}
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-blue-700 font-medium">Level {profile.level || 1}</span>
                  </div>
                  <div className="bg-green-50 px-3 py-1 rounded-full">
                    <span className="text-green-700 font-medium">{profile.xp || 0} XP</span>
                  </div>
                  <div className="bg-purple-50 px-3 py-1 rounded-full">
                    <span className="text-purple-700 font-medium">{userEvents.length} Events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Created Events */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Created Events</h2>
            {userEvents.length > 0 ? (
              <div className="space-y-4">
                {userEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.date_time).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No events created yet</p>
            )}
          </div>

          {/* Favorite Events */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Favorite Events</h2>
            {userFavorites.length > 0 ? (
              <div className="space-y-4">
                {userFavorites.map((event: Event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.date_time).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No favorite events yet</p>
            )}
          </div>
        </div>

        {/* Badges */}
        {profile.badges && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Badges</h2>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(profile.badges) ? (
                profile.badges.map((badge: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-medium">
                    {badge.name || badge}
                  </div>
                ))
              ) : (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-medium">
                  New Member
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
