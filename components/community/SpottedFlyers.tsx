import Image from 'next/image';
import Link from 'next/link';
import CardGrid from '@/components/layout/CardGrid';
import { formatTownName } from '@/lib/utils';

export default function SpottedFlyers({ townSlug }: { townSlug?: string }) {
  const flyersToDisplay = townSlug 
    ? [] // No mock flyers for specific towns
    : []; // No mock flyers for all towns

  return (
    <div className="w-full">
      <h3 className="font-bold text-xl mb-4">Spotted Flyers {townSlug ? `in ${formatTownName(townSlug)}` : ''}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {flyersToDisplay.length > 0 ? (
          flyersToDisplay.map(flyer => (
            <Link key={flyer.id} href={flyer.link} className="block bg-white rounded-lg shadow-md overflow-hidden aspect-w-3 aspect-h-4 group relative">
              <Image src={flyer.url} fill style={{ objectFit: 'cover' }} alt={flyer.alt} sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" />
            </Link>
          ))
        ) : (
          <p className="text-gray-600">No flyers spotted {townSlug ? `for ${formatTownName(townSlug)}` : ''}.</p>
        )}
      </div>
    </div>
  );
}