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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800">SpicyChat Character Wizard</h1>
        <p className="text-gray-600 mt-2">Create AI characters with ease</p>
      </header>
      
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8 px-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep >= step 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
            <span className="mt-2 text-sm text-gray-600">
              {step === 1 ? 'Create Character' : step === 2 ? 'Generate Image' : 'Export'}
            </span>
          </div>
        ))}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {activeStep === 1 && (
          <CharacterForm 
            onGenerate={handleCharacterGenerated} 
            setIsGenerating={setIsGenerating}
            setError={setError}
          />
        )}
        
        {activeStep === 2 && characterData && (
          <div>
            <CharacterPreview character={characterData} />
            <ImageGenerator 
              character={characterData}
              onImageGenerated={handleImageGenerated}
              setIsGenerating={setIsGenerating}
              setError={setError}
            />
          </div>
        )}
        
        {activeStep === 3 && characterData && (
          <div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img 
                  src={imageUrl} 
                  alt={characterData.name} 
                  className="w-full h-auto rounded-lg shadow"
                />
              </div>
              <div className="md:w-2/3">
                <CharacterPreview character={characterData} />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Ready to Export!</h3>
              <p className="text-gray-600 mb-4">
                Your character is ready to be exported to SpicyChat. Click the button below to continue.
              </p>
              <button
                onClick={handleExport}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Export to SpicyChat
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {activeStep > 1 ? (
          <button
            onClick={handleBack}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={isGenerating}
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          disabled={isGenerating || activeStep === 1 && !characterData}
        >
          Reset
        </button>
      </div>
      
      {/* Success Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Success!</h3>
          <p className="mb-4">
            Your character has been exported to SpicyChat. You can now complete the character creation process there.
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}