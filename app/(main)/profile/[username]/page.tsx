export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-gray-500 text-5xl font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{username}</h1>
          <p className="text-gray-600 text-lg mb-4">Rank: District Curator</p>
          <p className="text-gray-600 text-sm">Total XP: 1500</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Contributions</h2>
          <ul className="list-none space-y-2 text-gray-700">
            <li className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
              <span>Submitted: Timmins Summerfest</span>
              <span className="text-sm text-gray-500">July 1, 2025</span>
            </li>
            <li className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
              <span>Spotted: Old Town Hall Flyer</span>
              <span className="text-sm text-gray-500">June 28, 2025</span>
            </li>
            <li className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
              <span>Submitted: Cochrane Farmers Market</span>
              <span className="text-sm text-gray-500">June 25, 2025</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Badges Earned</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full">First Post</span>
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full">Garage Sale Guru</span>
            <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full">Timmins Explorer</span>
            <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full">Event Enthusiast</span>
          </div>
        </div>
      </div>
    </div>
  );
}
