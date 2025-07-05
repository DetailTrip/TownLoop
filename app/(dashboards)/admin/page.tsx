export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending Event Approvals</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>New Event: "Local Art Fair" - <a href="#" className="text-green-500 hover:underline">Approve</a> | <a href="#" className="text-red-500 hover:underline">Reject</a></li>
          <li>Updated Event: "Community BBQ" - <a href="#" className="text-green-500 hover:underline">Approve</a> | <a href="#" className="text-red-500 hover:underline">Reject</a></li>
        </ul>

        <h2 className="text-xl font-semibold mb-4">Site Statistics</h2>
        <p className="text-gray-700">Total Events: 150</p>
        <p className="text-gray-700">Total Users: 500</p>
      </div>
    </div>
  );
}