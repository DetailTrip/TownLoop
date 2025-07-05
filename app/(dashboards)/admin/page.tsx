export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Pending Approvals */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Pending Event Approvals</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between items-center">
              <span>New Event: <span className="font-medium">"Local Art Fair"</span></span>
              <div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm mr-2">Approve</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Reject</button>
              </div>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>Updated Event: <span className="font-medium">"Community BBQ"</span></span>
              <div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm mr-2">Approve</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Reject</button>
              </div>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>New Flyer: <span className="font-medium">"Charity Run"</span></span>
              <div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm mr-2">Approve</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Reject</button>
              </div>
            </li>
          </ul>
        </div>

        {/* Site Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Site Statistics</h2>
          <p className="text-gray-700 mb-2">Total Events: <span className="font-bold">150</span></p>
          <p className="text-gray-700 mb-2">Total Users: <span className="font-bold">500</span></p>
          <p className="text-gray-700 mb-2">New Submissions (Last 7 Days): <span className="font-bold">15</span></p>
          <p className="text-gray-700">Active Partners: <span className="font-bold">12</span></p>
        </div>

        {/* User Management (Placeholder) */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-700">[Table or list of users with edit/delete options will go here]</p>
        </div>
      </div>
    </div>
  );
}
