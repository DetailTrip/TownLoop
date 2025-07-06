// Tags are descriptive attributes that complement categories
// They should be cross-cutting concerns that apply across all event types
export const suggestedTags = [
  // Audience & Age Groups
  'family-friendly',
  'kids-only',
  'adults-only',
  'seniors-welcome',
  'teens',
  'all-ages',
  
  // Cost & Payment
  'free',
  'paid',
  'donation-based',
  'bring-cash',
  'registration-fee',
  
  // Setting & Environment
  'outdoors',
  'indoors',
  'hybrid',
  'online',
  'rain-or-shine',
  
  // Experience Level
  'beginner-friendly',
  'all-levels',
  'intermediate',
  'advanced',
  'no-experience-needed',
  
  // Accessibility & Inclusion
  'wheelchair-accessible',
  'pet-friendly',
  'parking-available',
  'public-transit',
  'asl-interpreted',
  
  // Event Format & Style
  'workshop',
  'hands-on',
  'lecture',
  'interactive',
  'competition',
  'festival',
  'market',
  'networking',
  'drop-in',
  'registration-required',
  
  // Special Attributes
  'recurring',
  'seasonal',
  'limited-capacity',
  'early-bird-pricing',
  'local-vendors',
  'charity',
  'volunteer-opportunity',
  'bring-your-own',
  'refreshments-provided'
];

// Helper function to get tag display name (converts kebab-case to Title Case)
export const getTagDisplayName = (tag: string): string => {
  return tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Group tags by category for better UX in form interfaces
export const tagGroups = {
  audience: [
    'family-friendly',
    'kids-only', 
    'adults-only',
    'seniors-welcome',
    'teens',
    'all-ages'
  ],
  cost: [
    'free',
    'paid',
    'donation-based',
    'bring-cash',
    'registration-fee'
  ],
  setting: [
    'outdoors',
    'indoors',
    'hybrid', 
    'online',
    'rain-or-shine'
  ],
  experience: [
    'beginner-friendly',
    'all-levels',
    'intermediate',
    'advanced',
    'no-experience-needed'
  ],
  accessibility: [
    'wheelchair-accessible',
    'pet-friendly',
    'parking-available',
    'public-transit',
    'asl-interpreted'
  ],
  format: [
    'workshop',
    'hands-on',
    'lecture',
    'interactive',
    'competition',
    'festival',
    'market',
    'networking',
    'drop-in',
    'registration-required'
  ],
  special: [
    'recurring',
    'seasonal',
    'limited-capacity',
    'early-bird-pricing',
    'local-vendors',
    'charity',
    'volunteer-opportunity',
    'bring-your-own',
    'refreshments-provided'
  ]
} as const;
