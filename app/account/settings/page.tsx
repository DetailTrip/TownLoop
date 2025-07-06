'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { supabase } from '@/lib/supabase/client';
import TextInput from '@/components/ui/TextInput';
import SelectInput from '@/components/ui/SelectInput';
import { towns } from '@/constants';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AccountSettingsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [profile, setProfile] = useState<Partial<Profile>>({
    display_name: '',
    username: '',
    town: '',
    avatar_url: ''
  });

  const townOptions = [
    { value: '', label: 'Select a town' },
    ...towns.map(town => ({ value: town.toLowerCase().replace(/ /g, '-'), label: town }))
  ];

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, userLoading, router]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        // Create profile if it doesn't exist
        await createProfile();
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user!.id,
            display_name: user!.email?.split('@')[0] || '',
            username: user!.email?.split('@')[0] || '',
            level: 1,
            xp: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          username: profile.username,
          town: profile.town,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <TextInput 
              label="Display Name" 
              id="display_name" 
              name="display_name" 
              value={profile.display_name || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="How you want to appear to others"
              required
            />
          </div>
          
          <div className="mb-5">
            <TextInput 
              label="Username" 
              id="username" 
              name="username" 
              value={profile.username || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Your unique username"
              required
            />
          </div>
          
          <div className="mb-5">
            <TextInput 
              label="Email" 
              id="email" 
              name="email" 
              type="email" 
              value={user?.email || ''} 
              disabled
              placeholder="Email cannot be changed here"
            />
            <p className="text-sm text-gray-500 mt-1">
              To change your email, please contact support.
            </p>
          </div>
          
          <div className="mb-5">
            <TextInput 
              label="Avatar URL" 
              id="avatar_url" 
              name="avatar_url" 
              type="url" 
              value={profile.avatar_url || ''} 
              onChange={(e) => setProfile(prev => ({ ...prev, avatar_url: e.target.value }))}
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>
          
          <div className="mb-6">
            <SelectInput 
              label="Home Town" 
              id="town" 
              name="town" 
              options={townOptions}
              value={profile.town || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, town: e.target.value }))}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
