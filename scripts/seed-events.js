const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wwebbpdpbrzlunanvexl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZWJicGRwYnJ6bHVuYW52ZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODI1ODksImV4cCI6MjA2NzI1ODU4OX0.8BgqGlx_kDN2N9l7Xo2uAlLHaGfK47BuEflVAZggQDg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleEvents = [
  // Timmins Events
  {
    title: 'Timmins Winter Carnival',
    description: 'Annual winter celebration featuring ice sculptures, snowmobile races, hot chocolate stations, and family activities. Embrace the Northern Ontario winter spirit!',
    date_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    end_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    location: 'Gillies Lake Conservation Area, Timmins',
    town: 'timmins',
    category: 'community',
    tags: ['winter', 'family', 'carnival', 'outdoor', 'northern ontario'],
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    is_featured: true
  },
  {
    title: 'Mining Heritage Museum Tour',
    description: 'Explore Timmins rich mining history with guided tours, interactive exhibits, and stories from local miners. Perfect for history enthusiasts and families.',
    date_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    location: 'Timmins Museum & Resource Centre',
    town: 'timmins',
    category: 'education',
    tags: ['history', 'mining', 'museum', 'educational', 'family'],
    image_url: 'https://images.unsplash.com/photo-1594736797933-d0d6b6d11d85?w=500',
    is_featured: false
  },
  {
    title: 'Local Craft Beer Tasting',
    description: 'Sample the finest craft beers from Northern Ontario breweries. Meet the brewers, learn about the process, and enjoy local appetizers.',
    date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
    location: 'Northern Tap House, Downtown Timmins',
    town: 'timmins',
    category: 'food',
    tags: ['craft beer', 'local', 'tasting', 'breweries', 'adults'],
    image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500',
    is_featured: false
  },

  // Kapuskasing Events
  {
    title: 'Kapuskasing River Festival',
    description: 'Celebrate our beautiful river with canoe races, riverside picnics, live folk music, and local artisan market. A true Northern Ontario summer tradition.',
    date_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours later
    location: 'Kapuskasing River Waterfront Park',
    town: 'kapuskasing',
    category: 'community',
    tags: ['river', 'festival', 'canoe', 'music', 'artisan market'],
    image_url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500',
    is_featured: true
  },
  {
    title: 'French-Canadian Cultural Night',
    description: 'Experience the rich Franco-Ontarian heritage with traditional music, dancing, storytelling, and authentic Québécois cuisine.',
    date_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
    end_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
    location: 'Centre Communautaire Franco-Ontarien',
    town: 'kapuskasing',
    category: 'culture',
    tags: ['franco-ontarian', 'culture', 'music', 'dance', 'heritage'],
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    is_featured: false
  },
  {
    title: 'Outdoor Photography Workshop',
    description: 'Learn to capture the stunning natural beauty of the Cochrane District. Professional photographer will guide you through techniques and locations.',
    date_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    end_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
    location: 'Rene Brunelle Provincial Park',
    town: 'kapuskasing',
    category: 'education',
    tags: ['photography', 'workshop', 'nature', 'outdoor', 'learning'],
    image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
    is_featured: false
  },

  // Cochrane Events
  {
    title: 'Polar Bear Habitat Adventure',
    description: 'Educational tour of the world-famous Polar Bear Habitat and Heritage Village. Learn about polar bear conservation and northern wildlife.',
    date_time: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days from now
    end_time: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours later
    location: 'Cochrane Polar Bear Habitat',
    town: 'cochrane',
    category: 'education',
    tags: ['polar bears', 'wildlife', 'conservation', 'family', 'tourism'],
    image_url: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=500',
    is_featured: true
  },
  {
    title: 'Railway Heritage Walk',
    description: 'Discover Cochrane railway history with a guided walking tour. Visit historic stations, learn about the ONR, and enjoy local refreshments.',
    date_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours later
    location: 'Historic Cochrane Railway Station',
    town: 'cochrane',
    category: 'education',
    tags: ['railway', 'history', 'walking tour', 'heritage', 'onr'],
    image_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500',
    is_featured: false
  },

  // Hearst Events
  {
    title: 'Forest Industry Open House',
    description: 'Tour local sawmills and learn about sustainable forestry practices. See how trees become lumber and support our local economy.',
    date_time: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    end_time: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
    location: 'Hearst Forest Management Inc.',
    town: 'hearst',
    category: 'business',
    tags: ['forestry', 'industry', 'sustainable', 'tour', 'economy'],
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
    is_featured: false
  },
  {
    title: 'Bilingual Storytelling Evening',
    description: 'Stories in French and English celebrating northern life. Local storytellers share tales of adventure, community, and tradition.',
    date_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    location: 'Hearst Public Library',
    town: 'hearst',
    category: 'culture',
    tags: ['storytelling', 'bilingual', 'culture', 'library', 'community'],
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
    is_featured: false
  },

  // Cross-Town Events
  {
    title: 'Northern Lights Photography Expedition',
    description: 'Join professional photographers for a guided aurora borealis viewing and photography session. Equipment tutorials and hot drinks provided.',
    date_time: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    end_time: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
    location: 'Dark Sky Location, Cochrane District',
    town: 'timmins',
    category: 'education',
    tags: ['northern lights', 'aurora', 'photography', 'night', 'winter'],
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    is_featured: true
  },
  {
    title: 'Community Hockey Tournament',
    description: 'Annual inter-town hockey tournament bringing together teams from across Cochrane District. Come cheer for your hometown team!',
    date_time: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days from now
    end_time: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours later
    location: 'Tim Horton Event Centre, Cochrane',
    town: 'cochrane',
    category: 'sports',
    tags: ['hockey', 'tournament', 'community', 'sports', 'inter-town'],
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    is_featured: false
  },
  {
    title: 'Northern Ontario Business Expo',
    description: 'Showcase of local businesses, networking opportunities, and economic development presentations. Connect with entrepreneurs across the region.',
    date_time: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days from now
    end_time: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 5 hours later
    location: 'Timmins Convention Centre',
    town: 'timmins',
    category: 'business',
    tags: ['business', 'expo', 'networking', 'entrepreneurs', 'economic development'],
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500',
    is_featured: true
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
