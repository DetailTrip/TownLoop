import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pb-16 sm:pb-0">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        {/* Desktop: Multi-column layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-3">TownLoop</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Connecting communities across Cochrane District. Discover events, connect with neighbors, and stay in the loop.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.23 18.148c-2.016 0-3.658-1.642-3.658-3.658s1.642-3.658 3.658-3.658 3.658 1.642 3.658 3.658S10.246 18.148 8.23 18.148zM12.017 15.826c-2.016 0-3.658-1.642-3.658-3.658S9.999 8.51 12.017 8.51s3.658 1.642 3.658 3.658S14.033 15.826 12.017 15.826zM15.803 18.148c-2.016 0-3.658-1.642-3.658-3.658s1.642-3.658 3.658-3.658 3.658 1.642 3.658 3.658S17.819 18.148 15.803 18.148z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors duration-200">Browse Events</Link></li>
              <li><Link href="/submit" className="text-gray-400 hover:text-white transition-colors duration-200">Submit Event</Link></li>
              <li><Link href="/community" className="text-gray-400 hover:text-white transition-colors duration-200">Community Hub</Link></li>
              <li><Link href="/t/timmins" className="text-gray-400 hover:text-white transition-colors duration-200">Timmins Events</Link></li>
              <li><Link href="/t/kapuskasing" className="text-gray-400 hover:text-white transition-colors duration-200">Kapuskasing Events</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-3">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-3">Get weekly event updates delivered to your inbox.</p>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: Simplified layout */}
        <div className="sm:hidden space-y-5 mb-5">
          {/* Brand */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-1">TownLoop</h3>
            <p className="text-gray-400 text-xs px-2 leading-relaxed">
              Connecting communities across Cochrane District
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 px-2">
            <Link href="/events" className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 px-3 rounded-lg text-center font-medium transition-all duration-200 text-sm active:scale-95">
              Browse Events
            </Link>
            <Link href="/submit" className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-2.5 px-3 rounded-lg text-center font-medium transition-all duration-200 text-sm active:scale-95">
              Submit Event
            </Link>
          </div>

          {/* Links - More compact */}
          <div className="px-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <h4 className="font-medium text-white mb-1.5 text-xs uppercase tracking-wide">Towns</h4>
                <div className="space-y-1">
                  <Link href="/t/timmins" className="block text-gray-400 hover:text-white transition-colors duration-200 text-xs py-0.5">Timmins</Link>
                  <Link href="/t/kapuskasing" className="block text-gray-400 hover:text-white transition-colors duration-200 text-xs py-0.5">Kapuskasing</Link>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1.5 text-xs uppercase tracking-wide">Info</h4>
                <div className="space-y-1">
                  <Link href="/about" className="block text-gray-400 hover:text-white transition-colors duration-200 text-xs py-0.5">About</Link>
                  <Link href="/community" className="block text-gray-400 hover:text-white transition-colors duration-200 text-xs py-0.5">Community</Link>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1.5 text-xs uppercase tracking-wide">Help</h4>
                <div className="space-y-1">
                  <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors duration-200 text-xs py-0.5">Contact</Link>
                  <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors duration-200 text-xs py-0.5">Terms</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="flex justify-center space-x-5 pt-2">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 p-1" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 p-1" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 p-1" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-4 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-xs sm:text-sm">&copy; {new Date().getFullYear()} TownLoop. All rights reserved.</p>
              <p className="text-gray-500 text-xs mt-0.5 sm:mt-1">Made with ❤️ in Northern Ontario</p>
            </div>
            <div className="flex space-x-4 sm:space-x-6 text-xs">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
