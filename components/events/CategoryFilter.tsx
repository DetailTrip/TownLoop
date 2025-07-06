'use client';

import { useState } from 'react';
import { eventCategories, getCategoryById } from '@/constants/categories';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

export default function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  className = '' 
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategoryData = selectedCategory ? getCategoryById(selectedCategory) : null;

  return (
    <div className={`relative ${className}`}>
      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="flex items-center">
            {selectedCategoryData ? (
              <>
                <span className="mr-2">{selectedCategoryData.icon}</span>
                {selectedCategoryData.name}
              </>
            ) : (
              'All Categories'
            )}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            <button
              onClick={() => {
                onCategoryChange(null);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 ${
                !selectedCategory ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              All Categories
            </button>
            {eventCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center ${
                  selectedCategory === category.id 
                    ? `${category.bgColor} ${category.textColor} font-medium` 
                    : 'text-gray-700'
                }`}
              >
                <span className="mr-3">{category.icon}</span>
                <div>
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Horizontal filter pills */}
      <div className="hidden sm:flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            !selectedCategory
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Categories
        </button>
        
        {eventCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === category.id
                ? `${category.color} text-white shadow-md`
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
