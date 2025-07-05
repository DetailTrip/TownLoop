export default function CommunityHubPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Community Hub: Earn XP & Badges!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
          <ul className="list-disc list-inside">
            <li>John Doe - 1500 XP (District Curator)</li>
            <li>Jane Smith - 1200 XP (Event Scout)</li>
            <li>Community Member - 800 XP (Rookie Spotter)</li>
          </ul>
        </div>

        {/* Missions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weekly Missions</h2>
          <ul className="list-disc list-inside">
            <li>Submit 3 events from Kapuskasing (+200 XP)</li>
            <li>Upload 5 flyers this week (+300 XP)</li>
            <li>Attend a featured event (+100 XP)</li>
          </ul>
        </div>

        {/* Badges */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
          <div className="flex flex-wrap gap-4">
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full">First Post</span>
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full">Garage Sale Guru</span>
            <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full">Timmins Explorer</span>
          </div>
        </div>
      </div>
    </div>
  );
}