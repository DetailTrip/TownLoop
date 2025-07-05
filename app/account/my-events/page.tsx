export default function MyEventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Submitted Events</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="list-disc list-inside text-gray-700">
          <li>Timmins Summerfest (Pending Approval) - <a href="#" className="text-blue-500 hover:underline">Edit</a> | <a href="#" className="text-red-500 hover:underline">Delete</a></li>
          <li>Cochrane Farmers Market (Approved) - <a href="#" className="text-blue-500 hover:underline">View</a></li>
        </ul>
      </div>
    </div>
  );
}