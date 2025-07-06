export const eventCategories = [
  {
    id: 'community',
    name: 'Community',
    description: 'Local gatherings, festivals, and community events',
    icon: '🏘️',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Concerts, live performances, and musical events',
    icon: '🎵',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletic events, tournaments, and recreational activities',
    icon: '⚽',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50'
  },
  {
    id: 'food',
    name: 'Food & Drink',
    description: 'Dining experiences, food festivals, and tastings',
    icon: '🍽️',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Workshops, seminars, and learning opportunities',
    icon: '📚',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-700',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Networking, conferences, and professional events',
    icon: '💼',
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50'
  },
  {
    id: 'culture',
    name: 'Arts & Culture',
    description: 'Art exhibitions, theater, and cultural celebrations',
    icon: '🎨',
    color: 'bg-pink-500',
    textColor: 'text-pink-700',
    bgColor: 'bg-pink-50'
  },
  {
    id: 'wellness',
    name: 'Health & Wellness',
    description: 'Fitness, wellness workshops, and health events',
    icon: '🧘',
    color: 'bg-teal-500',
    textColor: 'text-teal-700',
    bgColor: 'bg-teal-50'
  }
] as const;

export type EventCategory = typeof eventCategories[number]['id'];

export const getCategoryById = (id: string) => {
  return eventCategories.find(category => category.id === id);
};

export const getCategoryColor = (categoryId: string) => {
  const category = getCategoryById(categoryId);
  return category ? category.color : 'bg-gray-500';
};

export const getCategoryTextColor = (categoryId: string) => {
  const category = getCategoryById(categoryId);
  return category ? category.textColor : 'text-gray-700';
};

export const getCategoryBgColor = (categoryId: string) => {
  const category = getCategoryById(categoryId);
  return category ? category.bgColor : 'bg-gray-50';
};
