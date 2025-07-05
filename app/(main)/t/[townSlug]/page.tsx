import UpcomingEvents from '@/components/events/UpcomingEvents';
import SpottedFlyers from '@/components/community/SpottedFlyers';

export default function TownPage({ params }: { params: { townSlug: string } }) {
  const { townSlug } = params;
  const formattedTownName = townSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to {formattedTownName}!</h1>
      <p className="text-gray-700 text-lg mb-8">Discover all the exciting events happening in {formattedTownName}.</p>
      
      <UpcomingEvents townSlug={townSlug} />
      
      <div className="mt-12">
        <SpottedFlyers townSlug={townSlug} />
      </div>
    </div>
  );
}