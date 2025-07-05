import Image from 'next/image';
import Link from 'next/link';

const allMockFlyers = [
  { id: 1, url: 'https://picsum.photos/id/242/800/600', alt: 'Flyer for a bake sale', link: '#', town: 'timmins' },
  { id: 2, url: 'https://picsum.photos/id/243/800/600', alt: 'Flyer for a local concert', link: '#', town: 'kapuskasing' },
  { id: 3, url: 'https://picsum.photos/id/244/800/600', alt: 'Garage sale announcement', link: '#', town: 'timmins' },
  { id: 4, url: 'https://picsum.photos/id/245/800/600', alt: 'Community theatre poster', link: '#', town: 'cochrane' },
  { id: 5, url: 'https://picsum.photos/id/248/800/600', alt: 'Local event flyer', link: '#', town: 'iroquois-falls' },
];

export default function SpottedFlyers({ townSlug }: { townSlug?: string }) {
  const flyersToDisplay = townSlug 
    ? allMockFlyers.filter(flyer => flyer.town === townSlug) 
    : allMockFlyers;

  return (
    <div className="w-full">
      <h3 className="font-bold text-xl mb-4">Spotted Flyers {townSlug ? `in ${townSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : ''}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {flyersToDisplay.length > 0 ? (
          flyersToDisplay.map(flyer => (
            <Link key={flyer.id} href={flyer.link} className="block bg-white rounded-lg shadow-md overflow-hidden aspect-w-3 aspect-h-4 group relative">
              <Image src={flyer.url} fill style={{ objectFit: 'cover' }} alt={flyer.alt} sizes="(max-width: 768px) 50vw, 25vw" />
            </Link>
          ))
        ) : (
          <p className="text-gray-600">No flyers spotted {townSlug ? `for ${townSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : ''}.</p>
        )}
      </div>
    </div>
  );
}
