import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events: data });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// For testing, let's create a simple event ID generator
export async function POST() {
  // Return a mock event for testing
  const mockEvent = {
    id: 'test-event-123',
    title: 'Downtown Farmers Market',
    description: 'Fresh local produce, artisanal goods, and live music in the heart of downtown.',
    date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: 'Main Street Plaza, Downtown Austin',
    town: 'austin',
    category: 'community',
    tags: ['farmers market', 'local vendors', 'fresh produce', 'family friendly'],
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    is_featured: true,
    status: 'published',
    creator_id: null,
    coordinates: null,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return NextResponse.json({ 
    success: true, 
    event: mockEvent,
    message: 'Mock event for testing' 
  });
}
