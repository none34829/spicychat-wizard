import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { CharacterData } from '../../types';

interface CharacterFormProps {
  onGenerate: (character: CharacterData) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string) => void;
}

export default function CharacterForm({ onGenerate, setIsGenerating, setError }: CharacterFormProps) {
  const [description, setDescription] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please provide a character description');
      return;
    }
    
    setIsLoading(true);
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/character/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          url: url.trim() || undefined,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate character');
      }
      
      if (result.status === 'success' && result.data) {
        onGenerate(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating character:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Character Details</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Character Description*
          </label>
          <textarea
            id="description"
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe your character in detail. The more information you provide, the better the result will be."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isLoading}
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            Example: "A wise old wizard who specializes in fire magic. He is kind but stern, and has a soft spot for teaching young mages."
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Reference URL (Optional)
          </label>
          <input
            type="url"
            id="url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com/reference-content"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            You can provide a URL to a webpage that contains additional information about your character.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" /> 
                <span className="ml-2">Generating...</span>
              </>
            ) : (
              'Generate Character'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}