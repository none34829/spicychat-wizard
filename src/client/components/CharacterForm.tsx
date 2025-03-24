import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { CharacterData } from '../../types';

interface CharacterFormProps {
  onGenerate: (character: CharacterData) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string) => void;
  className?: string;
}

export default function CharacterForm({ onGenerate, setIsGenerating, setError, className }: CharacterFormProps) {
  const [description, setDescription] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);
  
  // Validate URL
  const validateUrl = (value: string) => {
    if (!value) {
      setIsUrlValid(true);
      return;
    }
    
    try {
      new URL(value);
      setIsUrlValid(true);
    } catch {
      setIsUrlValid(false);
    }
  };
  
  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Ensure we prevent default at the very start
    if (e) e.preventDefault();
    
    if (!description.trim()) {
      setError('Please provide a character description');
      return;
    }
    
    if (url && !isUrlValid) {
      setError('Please provide a valid URL or leave the field empty');
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
      <h2 className="form-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Character Details
      </h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}>
        <div className="form-group">
          <label htmlFor="description">Character Description*</label>
          <textarea
            id="description"
            rows={5}
            placeholder="Describe your character in detail. The more information you provide, the better the result will be."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isLoading}
          ></textarea>
          <p className="help-text">
            Example: "A wise old wizard who specializes in fire magic. He is kind but stern, and has a soft spot for teaching young mages."
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="url">Reference URL (Optional)</label>
          <input
            type="url"
            id="url"
            placeholder="https://example.com/reference-content"
            value={url}
            onChange={handleUrlChange}
            disabled={isLoading}
          />
          <p className="help-text">
            You can provide a URL to a webpage that contains additional information about your character.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !description.trim() || (url.trim() !== '' && !isUrlValid)}
            className="btn btn-primary btn-lg"
          >
            {isLoading ? (
              <>
                <div className="loader"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Character
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}