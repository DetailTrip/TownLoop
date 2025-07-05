export default function CommunityHubPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Community Hub: Earn XP & Badges!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User XP and Rank */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
          <p className="text-4xl font-bold text-blue-600">1500 XP</p>
          <p className="text-lg text-gray-700">District Curator</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">75% to next rank</p>
        </div>

        {/* Leaderboard */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between items-center">
              <span className="font-medium">1. John Doe</span>
              <span className="text-gray-600">1500 XP</span>
            </li>
            <li className="py-2 flex justify-between items-center">
              <span className="font-medium">2. Jane Smith</span>
              <span className="text-gray-600">1200 XP</span>
            </li>
            <li className="py-2 flex justify-between items-center">
              <span className="font-medium">3. Community Member</span>
              <span className="text-gray-600">800 XP</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Missions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weekly Missions</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-2">Submit 3 events from Kapuskasing <span className="text-green-600 font-semibold">(+200 XP)</span></li>
            <li className="mb-2">Upload 5 flyers this week <span className="text-green-600 font-semibold">(+300 XP)</span></li>
            <li>Attend a featured event <span className="text-green-600 font-semibold">(+100 XP)</span></li>
          </ul>
        </div>

        {/* Badges */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
          <div className="flex flex-wrap gap-4">
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
