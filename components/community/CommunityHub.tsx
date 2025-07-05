import EditorialSpotlight from './EditorialSpotlight';
import SpottedFlyers from './SpottedFlyers';

export default function CommunityHub() {
  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <EditorialSpotlight />
          </div>
          <div>
            <SpottedFlyers />
          </div>
        </div>
      </div>
    </div>
  );
}