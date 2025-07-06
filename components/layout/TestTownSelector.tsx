'use client';

import { useState } from 'react';

export default function TestTownSelector() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    console.log('Test button clicked!');
    alert('Button works!');
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Button (Open: {isOpen.toString()})
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border p-4 shadow-lg">
          <p>Dropdown is working!</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
