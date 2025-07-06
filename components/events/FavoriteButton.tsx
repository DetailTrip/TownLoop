'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { supabase } from '@/lib/supabase/client';

interface FavoriteButtonProps {
  eventId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ eventId, className = '', size = 'md' }: FavoriteButtonProps) {
  const { user } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, eventId]);

  const checkFavoriteStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_interactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .eq('interaction_type', 'favorite')
        .single();

      setIsFavorited(!!data);
    } catch (error) {
      // If no favorite found, it's not favorited
      setIsFavorited(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      if (isFavorited) {
        // Remove favorite
        const { error } = await supabase
          .from('event_interactions')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId)
          .eq('interaction_type', 'favorite');

        if (error) throw error;
        setIsFavorited(false);
      } else {
        // Add favorite
        const { error } = await supabase
          .from('event_interactions')
          .insert([{
            user_id: user.id,
            event_id: eventId,
            interaction_type: 'favorite'
          }]);

        if (error) throw error;
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show favorite button if user is not logged in
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${isFavorited 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        rounded-full border border-gray-300 transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <div className={`${iconSizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-gray-600`}></div>
      ) : (
        <svg 
          className={iconSizes[size]} 
          fill={isFavorited ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
    </button>
  );
}
