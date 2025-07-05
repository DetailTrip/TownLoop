export default function PartnerDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Partner Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Organization's Events</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>Annual Library Book Sale - <a href="#" className="text-blue-500 hover:underline">View Stats</a></li>
          <li>Weekly Story Time - <a href="#" className="text-blue-500 hover:underline">View Stats</a></li>
        </ul>

        <h2 className="text-xl font-semibold mb-4">Embeddable Widget</h2>
        <p className="text-gray-700">Copy and paste this code to embed your event list on your website:</p>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto mt-2">
          <code>&lt;iframe src="https://townloop.com/embed/your-org-id" width="100%" height="500px"&gt;&lt;/iframe&gt;</code>
        </pre>
      </div>
    </div>
  );
}