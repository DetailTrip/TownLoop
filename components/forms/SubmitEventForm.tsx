'use client';

import React, { useState, useEffect } from 'react';
import TagSelector from './TagSelector';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/lib/context/UserContext';
import { eventCategories } from '@/constants';
import { Database } from '@/lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

// Import reusable UI components
import TextInput from '@/components/ui/TextInput';
import DateInput from '@/components/ui/DateInput';
import TimeInput from '@/components/ui/TimeInput';
import TextAreaInput from '@/components/ui/TextAreaInput';
import SelectInput from '@/components/ui/SelectInput';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';

interface SubmitEventFormProps {
  initialData?: Event | null;
}

export default function SubmitEventForm({ initialData = null }: SubmitEventFormProps) {
  const { user, loading: userLoading } = useUser();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    date_time: initialData?.date_time || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFlyerFile, setSelectedFlyerFile] = useState<File | null>(null);
  const [selectedEventImage, setSelectedEventImage] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiExtractedData, setAiExtractedData] = useState<any>(null); // To store AI results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Effect to update form data if initialData changes (e.g., when navigating to edit a different event)
  useEffect(() => {
    if (initialData) {
      // Convert UTC datetime to local datetime for form fields
      let localDateTime = '';
      if (initialData.date_time) {
        const utcDate = new Date(initialData.date_time);
        // Format as YYYY-MM-DDTHH:MM for datetime-local input
        localDateTime = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000))
          .toISOString()
          .slice(0, 16);
      }
      
      setFormData({
        title: initialData.title,
        date_time: localDateTime,
        location: initialData.location || '',
        description: initialData.description || '',
        category: initialData.category || '',
        tags: initialData.tags || [],
      });
      setEventImagePreview(initialData.image_url || null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setFormData(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      }));
    } else if (name === 'date') {
      setFormData(prev => ({
        ...prev,
        date_time: `${value}T${prev.date_time ? prev.date_time.split('T')[1] : '00:00'}`,
      }));
    } else if (name === 'time') {
      setFormData(prev => ({
        ...prev,
        date_time: `${prev.date_time ? prev.date_time.split('T')[0] : ''}T${value}`,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFlyerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFlyerFile(e.target.files[0]);
      setAiExtractedData(null); // Clear previous AI data
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedEventImage(file);
      setEventImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedEventImage(null);
      setEventImagePreview(null);
    }
  };

  const handleExtractFromFlyer = async () => {
    if (!selectedFlyerFile) {
      setFormMessage({ type: 'error', text: 'Please select a flyer image first.' });
      return;
    }

    setIsProcessingAI(true);
    setAiExtractedData(null);
    setFormMessage(null);

    const formData = new FormData();
    formData.append('flyer', selectedFlyerFile);

    try {
      const response = await fetch('/api/flyers', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAiExtractedData(data);
      setFormMessage({ type: 'success', text: 'AI Extraction Complete! Review the pre-filled fields below.' });
      // Optionally, pre-fill form fields with extracted data here
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        date_time: data.date_time || prev.date_time,
        location: data.location || prev.location,
        description: data.description || prev.description,
        tags: data.tags && data.tags.length > 0 ? data.tags : prev.tags,
      }));

    } catch (error) {
      console.error('Error extracting from flyer:', error);
      setFormMessage({ type: 'error', text: 'Failed to extract data from flyer. Please try again or enter manually.' });
    } finally {
      setIsProcessingAI(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = 'Event Title is required';
    if (!formData.date_time) newErrors.date_time = 'Date and Time are required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    if (!validateForm()) {
      setFormMessage({ type: 'error', text: 'Please correct the errors in the form.' });
      return;
    }

    if (!user) {
      setFormMessage({ type: 'error', text: 'You must be logged in to submit an event.' });
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = initialData?.image_url || ''; // Start with existing image if editing

    // Handle image upload to Supabase Storage if a new image is selected
    if (selectedEventImage) {
      const fileExtension = selectedEventImage.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExtension}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('event-images') 
          .upload(filePath, selectedEventImage, { cacheControl: '3600', upsert: false });

        if (error) {
          throw error;
        }
        finalImageUrl = `${supabase.storage.from('event-images').getPublicUrl(data.path).data.publicUrl}`;
      } catch (error: any) {
        console.error('Error uploading image:', error.message);
        setFormMessage({ type: 'error', text: `Failed to upload image: ${error.message}` });
        setIsSubmitting(false);
        return;
      }
    }

    // Convert local datetime back to UTC for storage
    const localDate = new Date(formData.date_time);
    const utcDateTime = localDate.toISOString();

    const eventDataToSave = {
      title: formData.title,
      date_time: utcDateTime,
      location: formData.location,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      town: 'timmins', // Assuming a default town for now, or add a town selector to the form
      image_url: finalImageUrl, // Use the uploaded or existing image URL
      creator_id: user.id, // Use creator_id instead of user_id
    };

    try {
      let supabaseResponse;
      if (initialData) {
        // Update existing event
        supabaseResponse = await supabase
          .from('events')
          .update(eventDataToSave)
          .eq('id', initialData.id);
      } else {
        // Insert new event
        supabaseResponse = await supabase
          .from('events')
          .insert([eventDataToSave]);
      }

      const { data, error } = supabaseResponse;

      if (error) {
        throw error;
      }

      console.log('Event submitted successfully:', data);
      setFormMessage({ type: 'success', text: `Event ${initialData ? 'updated' : 'submitted'} successfully!` });
      handleClear();
    } catch (error: any) {
      console.error(`Error ${initialData ? 'updating' : 'submitting'} event:`, error.message);
      setFormMessage({ type: 'error', text: `Failed to ${initialData ? 'update' : 'submit'} event: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      title: '',
      date_time: '',
      location: '',
      description: '',
      category: '',
      tags: [] as string[],
    });
    setErrors({});
    setSelectedFlyerFile(null);
    setSelectedEventImage(null);
    setEventImagePreview(null);
    setAiExtractedData(null);
    setFormMessage(null);
  };

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Submit Your Event</h1>
        <p className="text-gray-600 mb-4">You must be logged in to submit an event.</p>
        <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Login or Sign Up</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{initialData ? 'Edit Event' : 'Submit Your Event'}</h1>
      {formMessage && (
        <div className={`p-3 mb-4 rounded-md text-sm ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {formMessage.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">Option 1: Upload a Flyer (AI-Powered)</h2>
          <p className="text-gray-700 mb-4">Upload an image of your event flyer, and our AI will try to extract the details for you!</p>
          <div className="mb-4">
            <label htmlFor="flyer-upload" className="block text-gray-700 text-sm font-bold mb-2">Select Flyer Image</label>
            <input 
              type="file" 
              id="flyer-upload" 
              name="flyer-upload" 
              accept="image/*" 
              onChange={handleFlyerFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFlyerFile && <p className="text-gray-600 text-sm mt-2">Selected: {selectedFlyerFile.name}</p>}
          </div>
          <button 
            type="button" 
            onClick={handleExtractFromFlyer} 
            disabled={!selectedFlyerFile || isProcessingAI}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingAI ? 'Extracting...' : 'Extract Details from Flyer'}
          </button>
          {aiExtractedData && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="font-semibold">AI Extraction Complete!</p>
              <p className="text-sm">Review the pre-filled fields below.</p>
            </div>
          )}
        </div>

        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Option 2: Enter Details Manually</h2>
          <p className="text-gray-700 mb-4">Fill in the event details below.</p>
          
          {/* New: Event Image Upload */}
          <div className="mb-5">
            <label htmlFor="event-image-upload" className="block text-gray-700 text-sm font-bold mb-2">Event Image (Optional)</label>
            <input 
              type="file" 
              id="event-image-upload" 
              name="event-image-upload" 
              accept="image/*" 
              onChange={handleEventImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
            {eventImagePreview && (
              <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                <img src={eventImagePreview} alt="Event Preview" className="object-cover w-full h-full" />
              </div>
            )}
          </div>

          {/* Manual form fields start here */}
          <div className="mb-5">
            <TextInput 
              label="Event Title" 
              id="title" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="e.g., Timmins Summerfest" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <DateInput 
              label="Date" 
              id="date" 
              name="date" 
              value={formData.date_time ? formData.date_time.split('T')[0] : ''}
              onChange={handleChange}
              error={errors.date_time}
              required
            />
            <TimeInput 
              label="Time" 
              id="time" 
              name="time" 
              value={formData.date_time ? formData.date_time.split('T')[1]?.substring(0, 5) : ''}
              onChange={handleChange}
              error={errors.date_time}
              required
            />
          </div>
          <div className="mb-5">
            <TextInput 
              label="Location" 
              id="location" 
              name="location" 
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
              placeholder="e.g., Hollinger Park, Timmins" 
            />
          </div>
          <div className="mb-5">
            <SelectInput 
              label="Category" 
              id="category" 
              name="category" 
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              required
              options={[
                { value: '', label: 'Select a category...' },
                ...eventCategories.map(cat => ({ value: cat.id, label: cat.name }))
              ]}
            />
          </div>
          <div className="mb-5">
            <TextAreaInput 
              label="Description" 
              id="description" 
              name="description" 
              rows={5} 
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
              placeholder="Tell us more about your event..." 
            />
          </div>
          
          {/* Tags */}
          <div className="mb-6">
            <TagSelector
              selectedTags={formData.tags}
              onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
              maxTags={8}
            />
            {errors.tags && <p className="text-red-500 text-xs italic mt-2">{errors.tags}</p>}
          </div>
          
          {/* Manual form fields end here */}
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" aria-label="Submit Event" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            Submit Event
          </button>
          <button type="button" onClick={handleClear} aria-label="Clear Form" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200">
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}