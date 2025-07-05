export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="/about" className="hover:text-gray-800">About</a>
          <a href="/contact" className="hover:text-gray-800">Contact</a>
          <a href="/terms" className="hover:text-gray-800">Terms of Service</a>
          <a href="/privacy" className="hover:text-gray-800">Privacy Policy</a>
        </div>
        <p>&copy; {new Date().getFullYear()} TownLoop. All rights reserved.</p>
        <p className="text-sm mt-2">Made with ❤️ in Northern Ontario</p>
      </div>
    </footer>
  );
}
