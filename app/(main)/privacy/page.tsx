import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 mb-4">At TownLoop, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by TownLoop and how we use it.</p>
        <p className="text-gray-700 mb-4">If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
        <h2 className="text-xl font-semibold mb-2">Log Files</h2>
        <p className="text-gray-700 mb-4">TownLoop follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&apos; analytics.</p>
        <h2 className="text-xl font-semibold mb-2">Cookies and Web Beacons</h2>
        <p className="text-gray-700">Like any other website, TownLoop uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited.</p>
      </div>
    </div>
  );
}