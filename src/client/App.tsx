import React, { useState } from 'react';
import CharacterForm from './components/CharacterForm';
import CharacterPreview from './components/CharacterPreview';
import ImageGenerator from './components/ImageGenerator';
import Modal from './components/Modal';
import { CharacterData } from '../types';

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  
  // Handle completion of character generation
  const handleCharacterGenerated = (data: CharacterData) => {
    setCharacterData(data);
    setActiveStep(2);
    setError('');
  };
  
  // Handle image generation
  const handleImageGenerated = (url: string) => {
    setImageUrl(url);
    setActiveStep(3);
    setError('');
  };
  
  // Go back to previous step
  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };
  
  // Reset the wizard
  const handleReset = () => {
    setCharacterData(null);
    setImageUrl('');
    setActiveStep(1);
    setError('');
  };
  
  // Handle export to SpicyChat
  const handleExport = () => {
    if (!characterData) return;
    
    // Open SpicyChat in a new tab with query parameters
    const params = new URLSearchParams({
      name: characterData.name,
      title: characterData.title,
      persona: characterData.persona,
      greeting: characterData.greeting,
      scenario: characterData.scenario,
      example_dialogue: characterData.exampleConversation,
      image_url: imageUrl,
    });
    
    window.open(`https://spicychat.ai/chatbot/create?${params.toString()}`, '_blank');
    
    // Show success modal
    setShowModal(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Beta
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2">
            SpicyChat Character Wizard
          </h1>
          <p className="text-xl text-gray-600">
            Create AI characters with ease and bring them to life
          </p>
        </header>
        
        {/* Progress Steps */}
        <div className="relative mb-12">
          <div className="absolute w-full h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2"></div>
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    activeStep >= step 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  {step}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">
                  {step === 1 ? 'Create Character' : step === 2 ? 'Generate Image' : 'Export'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {activeStep === 1 && (
            <CharacterForm 
              onGenerate={handleCharacterGenerated} 
              setIsGenerating={setIsGenerating}
              setError={setError}
              className="space-y-6"
            />
          )}
          
          {activeStep === 2 && characterData && (
            <div>
              <CharacterPreview character={characterData} className="mb-8" />
              <ImageGenerator 
                character={characterData}
                onImageGenerated={handleImageGenerated}
                setIsGenerating={setIsGenerating}
                setError={setError}
                className="space-y-6"
              />
            </div>
          )}
          
          {activeStep === 3 && characterData && (
            <div>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3">
                  <div className="relative h-96">
                    <img 
                      src={imageUrl} 
                      alt={characterData.name} 
                      className="w-full h-full object-cover rounded-xl shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <CharacterPreview character={characterData} />
                </div>
              </div>
              
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Export!</h3>
                <p className="text-gray-600 mb-6">
                  Your character is ready to be exported to SpicyChat. Click the button below to continue.
                </p>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Export to SpicyChat
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          {activeStep > 1 ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center px-5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isGenerating}
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            onClick={handleReset}
            className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isGenerating || activeStep === 1 && !characterData}
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
        
        {/* Success Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="p-8 text-center bg-white rounded-2xl">
            <div className="mb-8">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Success!
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  Your character has been exported to SpicyChat. You can now complete the character creation process there.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}