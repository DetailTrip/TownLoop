'use client';

import React, { useState } from 'react';
import { suggestedTags } from '@/constants/tags';

export default function SubmitEventForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    tags: [] as string[], // Changed to array
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      // When typing in the tags input, update the array by splitting the string
      setFormData(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = 'Event Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', { ...formData, tags: formData.tags.join(', ') });
      alert('Event submitted successfully! (Check console for data)');
      // In a real app, this is where you'd send data to your backend
      handleClear(); // Clear form after successful submission
    } else {
      alert('Please correct the errors in the form.');
    }
  };

  const handleClear = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      tags: [] as string[],
    });
    setErrors({});
  };

  const handleTagClick = (tag: string) => {
    setFormData(prev => {
      const currentTags = new Set(prev.tags);
      if (currentTags.has(tag)) {
        currentTags.delete(tag);
      } else {
        currentTags.add(tag);
      }
      return { ...prev, tags: Array.from(currentTags) };
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit Your Event</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-5">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Event Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title}
            onChange={handleChange}
            className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="e.g., Timmins Summerfest" 
          />
          {errors.title && <p className="text-red-500 text-xs italic mt-2">{errors.title}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date}
              onChange={handleChange}
              className={`shadow appearance-none border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.date && <p className="text-red-500 text-xs italic mt-2">{errors.date}</p>}
          </div>
          <div>
            <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">Time <span className="text-red-500">*</span></label>
            <input 
              type="time" 
              id="time" 
              name="time" 
              value={formData.time}
              onChange={handleChange}
              className={`shadow appearance-none border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.time && <p className="text-red-500 text-xs italic mt-2">{errors.time}</p>}
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            value={formData.location}
            onChange={handleChange}
            className={`shadow appearance-none border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="e.g., Hollinger Park, Timmins" 
          />
          {errors.location && <p className="text-red-500 text-xs italic mt-2">{errors.location}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description <span className="text-red-500">*</span></label>
          <textarea 
            id="description" 
            name="description" 
            rows={5} 
            value={formData.description}
            onChange={handleChange}
            className={`shadow appearance-none border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Tell us more about your event..." 
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs italic mt-2">{errors.description}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">Tags (comma-separated)</label>
          <input 
            type="text" 
            id="tags" 
            name="tags" 
            value={formData.tags.join(', ')}
            onChange={handleChange}
            className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Music, Family, Free" 
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestedTags.map(tag => (
              <button 
                key={tag} 
                type="button" 
                onClick={() => handleTagClick(tag)}
                className={`text-xs px-3 py-1 rounded-full transition-colors duration-200 ${formData.tags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            Submit Event
          </button>
          <button type="button" onClick={handleClear} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200">
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}