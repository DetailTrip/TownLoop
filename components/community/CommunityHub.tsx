import EditorialSpotlight from './EditorialSpotlight';
import SpottedFlyers from './SpottedFlyers';
import { useUser } from '@/lib/context/UserContext';
import Spinner from '@/components/ui/Spinner';

export default function CommunityHub() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Community Hub</h2>
        {user ? (
          <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-8 text-center">
            <p className="text-lg font-semibold text-blue-800">Welcome, {user.email}!</p>
            <p className="text-blue-700">Your XP: 1500 | Level: 5</p>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8 text-center">
            <p className="text-lg text-gray-700">Log in to see your XP and participate in the community!</p>
          </div>
        )}
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