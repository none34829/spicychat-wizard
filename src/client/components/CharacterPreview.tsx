import React, { useState } from 'react';
import { CharacterData } from '../../types';

interface CharacterPreviewProps {
  character: CharacterData;
  className?: string;
}

export default function CharacterPreview({ character, className }: CharacterPreviewProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Character Preview</h2>
      
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-purple-100 px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">{character.name}</h3>
          <p className="text-sm text-gray-600">{character.title}</p>
        </div>
        
        {/* Info Sections */}
        <div className="divide-y">
          {/* Persona */}
          <div>
            <button
              className="flex justify-between items-center w-full px-4 py-3 text-left hover:bg-gray-50"
              onClick={() => toggleSection('persona')}
            >
              <span className="font-medium">Persona</span>
              <span>{expandedSection === 'persona' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'persona' && (
              <div className="px-4 py-3 bg-gray-50">
                <p className="whitespace-pre-line">{character.persona}</p>
              </div>
            )}
          </div>
          
          {/* Greeting */}
          <div>
            <button
              className="flex justify-between items-center w-full px-4 py-3 text-left hover:bg-gray-50"
              onClick={() => toggleSection('greeting')}
            >
              <span className="font-medium">Greeting</span>
              <span>{expandedSection === 'greeting' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'greeting' && (
              <div className="px-4 py-3 bg-gray-50">
                <p className="whitespace-pre-line">{character.greeting}</p>
              </div>
            )}
          </div>
          
          {/* Scenario */}
          <div>
            <button
              className="flex justify-between items-center w-full px-4 py-3 text-left hover:bg-gray-50"
              onClick={() => toggleSection('scenario')}
            >
              <span className="font-medium">Scenario</span>
              <span>{expandedSection === 'scenario' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'scenario' && (
              <div className="px-4 py-3 bg-gray-50">
                <p className="whitespace-pre-line">{character.scenario}</p>
              </div>
            )}
          </div>
          
          {/* Example Conversation */}
          <div>
            <button
              className="flex justify-between items-center w-full px-4 py-3 text-left hover:bg-gray-50"
              onClick={() => toggleSection('conversation')}
            >
              <span className="font-medium">Example Conversation</span>
              <span>{expandedSection === 'conversation' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'conversation' && (
              <div className="px-4 py-3 bg-gray-50">
                {Array.isArray(character.exampleConversation) ? (
  character.exampleConversation.map((entry, index) => (
    <div key={index} className="border p-2 rounded mb-2">
      <p><strong>You:</strong> {entry.user}</p>
      <p><strong>{character.name}:</strong> {entry.character}</p>
    </div>
  ))
) : (
  <p className="text-red-500">Invalid conversation format</p>
)}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}