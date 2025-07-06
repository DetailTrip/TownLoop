'use client';

import { useState } from 'react';
import { tagGroups, getTagDisplayName } from '@/constants/tags';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  className?: string;
}

export default function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  maxTags = 10,
  className = '' 
}: TagSelectorProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['cost', 'audience']));

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag].slice(0, maxTags);
    
    onTagsChange(newTags);
  };

  const groupDisplayNames = {
    audience: '👥 Audience',
    cost: '💰 Cost & Payment',
    setting: '📍 Setting',
    experience: '🎯 Experience Level',
    accessibility: '♿ Accessibility',
    format: '📋 Format',
    special: '⭐ Special Attributes'
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Event Tags ({selectedTags.length}/{maxTags})
        </label>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={() => onTagsChange([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {getTagDisplayName(tag)}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag Groups */}
      <div className="space-y-3">
        {Object.entries(tagGroups).map(([groupName, tags]) => (
          <div key={groupName} className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleGroup(groupName)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">
                {groupDisplayNames[groupName as keyof typeof groupDisplayNames]}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedGroups.has(groupName) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedGroups.has(groupName) && (
              <div className="px-3 pb-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      disabled={!selectedTags.includes(tag) && selectedTags.length >= maxTags}
                      className={`
                        px-3 py-2 text-sm rounded-lg border transition-all duration-200 text-left
                        ${selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                        }
                        ${!selectedTags.includes(tag) && selectedTags.length >= maxTags
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                        }
                      `}
                    >
                      {getTagDisplayName(tag)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Tags help people discover your event. Choose attributes that best describe the experience.
      </p>
    </div>
  );
}
