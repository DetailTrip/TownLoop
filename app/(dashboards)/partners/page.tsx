export default function PartnerDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Partner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Your Organization's Events */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Organization's Events</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between items-center">
              <span>Annual Library Book Sale</span>
              <span className="text-sm text-gray-500">Approved</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>Weekly Story Time</span>
              <span className="text-sm text-gray-500">Approved</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>Summer Reading Program</span>
              <span className="text-sm text-yellow-600">Pending</span>
            </li>
          </ul>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">View All Your Events</button>
        </div>

        {/* Event Submission Quick Link */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Submit a New Event</h2>
            <p className="text-gray-700 mb-4">Quickly add your upcoming events to TownLoop.</p>
          </div>
          <a href="/submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-center font-semibold">Go to Submission Form</a>
        </div>

        {/* Embeddable Widget */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Embeddable Widget</h2>
          <p className="text-gray-700 mb-4">Copy and paste this code to embed your event list on your website:</p>
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto mt-2">
            <code>&lt;iframe src="https://townloop.com/embed/your-org-id" width="100%" height="500px"&gt;&lt;/iframe&gt;</code>
          </pre>
          <p className="text-gray-600 text-sm mt-2">Customize your widget settings <a href="#" className="text-blue-500 hover:underline">here</a>.</p>
        </div>
      </div>
    </div>
  );
}
