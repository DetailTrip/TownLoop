const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://upuyvfzwedebmkrzddny.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdXl2Znp3ZWRlYm1rcnpkZG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NDQ2ODQsImV4cCI6MjA1MTMyMDY4NH0.qGG7-kCHpxSCj1iT8LofPmI0k4DdWZRJRb_OPKiOlT0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleEvents = [
  {
    title: 'Downtown Farmers Market',
    description: 'Fresh local produce, artisanal goods, and live music in the heart of downtown. Join us every Saturday morning for the best local vendors and community atmosphere.',
    date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
    location: 'Main Street Plaza, Downtown Austin',
    town: 'austin',
    category: 'community',
    tags: ['farmers market', 'local vendors', 'fresh produce', 'family friendly'],
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    is_featured: true
  },
  {
    title: 'Live Jazz at The Blue Note',
    description: 'An intimate evening with acclaimed jazz quartet performing classic standards and original compositions. Premium cocktails and appetizers available.',
    date_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
    location: 'The Blue Note Jazz Club, East 6th Street',
    town: 'austin',
    category: 'music',
    tags: ['jazz', 'live music', 'cocktails', 'date night'],
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    is_featured: false
  },
  {
    title: 'Tech Startup Networking Mixer',
    description: 'Connect with fellow entrepreneurs, investors, and tech professionals. Featuring keynote speaker from successful local startup. Light refreshments provided.',
    date_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    location: 'Capital Factory, Downtown Austin',
    town: 'austin',
    category: 'business',
    tags: ['networking', 'startups', 'technology', 'entrepreneurs'],
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500',
    is_featured: false
  },
  {
    title: 'Food Truck Friday',
    description: 'The best food trucks in the city gather for a delicious outdoor dining experience. Over 20 vendors featuring cuisine from around the world.',
    date_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 5 hours later
    location: 'Rainey Street District',
    town: 'austin',
    category: 'food',
    tags: ['food trucks', 'outdoor dining', 'variety', 'casual'],
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
    is_featured: true
  },
  {
    title: 'Morning Yoga in the Park',
    description: 'Start your weekend with peaceful yoga practice surrounded by nature. All skill levels welcome. Bring your own mat or rent one on-site.',
    date_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now (Saturday morning)
    end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours later
    location: 'Zilker Park, Great Lawn',
    town: 'austin',
    category: 'wellness',
    tags: ['yoga', 'outdoor', 'wellness', 'morning', 'all levels'],
    image_url: 'https://images.unsplash.com/photo-1506629905996-636ebe6f0be9?w=500',
    is_featured: false
  }
];

async function seedEvents() {
  console.log('Starting to seed events...');
  
  try {
    const { data, error } = await supabase
      .from('events')
      .insert(sampleEvents)
      .select();

    if (error) {
      console.error('Error inserting events:', error);
      return;
    }

    console.log('Successfully inserted events:', data);
    console.log(`Inserted ${data.length} events`);
    
    // Print the event IDs for testing
    console.log('\nEvent IDs for testing:');
    data.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}: ${event.id}`);
    });
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

seedEvents();
