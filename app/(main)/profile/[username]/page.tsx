export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{username}</h1>
        <p className="text-gray-600 text-lg mb-4">Rank: District Curator</p>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Recent Contributions</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Submitted: Timmins Summerfest</li>
            <li>Spotted: Old Town Hall Flyer</li>
            <li>Submitted: Cochrane Farmers Market</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Badges Earned</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full">First Post</span>
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full">Event Enthusiast</span>
          </div>
        </div>
      </div>
    </div>
  );
}