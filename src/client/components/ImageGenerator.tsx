import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { CharacterData } from '../../types';

interface ImageGeneratorProps {
  character: CharacterData;
  onImageGenerated: (imageUrl: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string) => void;
  className?: string;
}

const STYLE_OPTIONS = [
  { value: 'realistic portrait', label: 'Realistic Portrait' },
  { value: 'anime style', label: 'Anime Style' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'fantasy character', label: 'Fantasy Character' },
  { value: 'oil painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'sketch', label: 'Sketch' },
  { value: 'character portrait', label: 'Character Portrait' },
  { value: 'other', label: 'Other (Custom)' }
];

export default function ImageGenerator({ 
  character, 
  onImageGenerated, 
  setIsGenerating, 
  setError,
  className
}: ImageGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('realistic portrait');
  const [customStyle, setCustomStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Generate the image
  const handleGenerateImage = async () => {
    setIsLoading(true);
    setIsGenerating(true);
    setError('');
    
    try {
      // Use custom style if "other" is selected, otherwise use the selected style
      const finalStyle = selectedStyle === 'other' ? customStyle : selectedStyle;
      
      if (selectedStyle === 'other' && !customStyle.trim()) {
        throw new Error('Please enter a custom style description');
      }
      
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterData: {
            name: character.name,
            title: character.title,
            persona: character.persona,
          },
          style: finalStyle,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate image');
      }
      
      if (result.status === 'success' && result.data && result.data.imageUrl) {
        onImageGenerated(result.data.imageUrl);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Frontend error when generating image:', error.message);
        setError(error.message);
      } else {
        console.error('Frontend unknown error:', error);
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Generate Character Image</h2>
      
      <div className="bg-purple-50 p-4 rounded-lg mb-4">
        <p className="text-sm">
          Now that your character details are ready, let's generate an avatar image for them.
          Select a style and click the button below.
        </p>
      </div>
      
      <div className="mb-4">
        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
          Image Style
        </label>
        <select
          id="style"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          disabled={isLoading}
        >
          {STYLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Custom style input field when "Other" is selected */}
      {selectedStyle === 'other' && (
        <div className="mb-4">
          <label htmlFor="customStyle" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Style Description
          </label>
          <input
            id="customStyle"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="E.g., cyberpunk style, steampunk portrait, etc."
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Be descriptive to get the best results. Example: "cyberpunk character with neon lighting"
          </p>
        </div>
      )}
      
      <div className="flex justify-center">
        <button
          onClick={handleGenerateImage}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" /> 
              <span className="ml-2">Generating Image...</span>
            </>
          ) : (
            'Generate Avatar'
          )}
        </button>
      </div>
    </div>
  );
}