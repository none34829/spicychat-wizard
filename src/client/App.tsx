import React, { useState, useEffect, useRef } from 'react';
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
  const progressLineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (progressLineRef.current && stepRefs.current[activeStep - 1]) {
      const progressLine = progressLineRef.current;
      const activeStepElement = stepRefs.current[activeStep - 1];
      
      if (activeStepElement) {
        const targetWidth = activeStepElement.offsetLeft + activeStepElement.offsetWidth / 2;
        progressLine.style.width = `${targetWidth}px`;
      }
    }
  }, [activeStep]);
  
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
      example_dialogue: JSON.stringify(characterData.exampleConversation),
      image_url: imageUrl,
    });
    
    window.open(`https://spicychat.ai/chatbot/create?${params.toString()}`, '_blank');
    
    // Show success modal
    setShowModal(true);
  };
  
  return (
    <div className="min-h-screen py-8">
      <header className="text-center mb-12">
        <h1 className="gradient-text">SpicyChat Character Wizard</h1>
        <p>Create AI characters with ease and bring them to life</p>
      </header>

      <div className="progress-steps relative">
        <div className="progress-line absolute"></div>
        <div 
          ref={progressLineRef} 
          className="progress-line-fill absolute"
        ></div>
        
        {[1, 2, 3].map((step, index) => (
          <div 
            key={step} 
            className="step-container"
            ref={el => { stepRefs.current[index] = el; }}
          >
            <div 
              className={`step-number ${activeStep === index + 1 ? 'active' : ''}`}
              onClick={() => setActiveStep(index + 1)}
            >
              {index + 1}
            </div>
            <div className="step-label">
              {step === 1 ? 'Create Character' : step === 2 ? 'Generate Image' : 'Export'}
            </div>
          </div>
        ))}
      </div>

      <div className="form-container">
        {error && (
          <div className="info-box bg-red-50 border-red-200 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {activeStep === 1 && (
          <CharacterForm
            onGenerate={handleCharacterGenerated}
            setIsGenerating={setIsGenerating}
            setError={setError}
          />
        )}

        {activeStep === 2 && characterData && (
          <ImageGenerator
            character={characterData}
            onImageGenerated={handleImageGenerated}
            setIsGenerating={setIsGenerating}
            setError={setError}
          />
        )}

        {activeStep === 3 && characterData && (
          <div className="character-preview">
            <h3 className="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Character Preview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label htmlFor="preview-name" className="font-medium text-gray-700">Name</label>
                  <p id="preview-name" className="mt-1">{characterData.name}</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="preview-title" className="font-medium text-gray-700">Title</label>
                  <p id="preview-title" className="mt-1">{characterData.title}</p>
                </div>
                <div>
                  <label htmlFor="preview-persona" className="font-medium text-gray-700">Persona</label>
                  <p id="preview-persona" className="mt-1 whitespace-pre-wrap">{characterData.persona}</p>
                </div>
                <div className="mt-4">
                  <label htmlFor="preview-greeting" className="font-medium text-gray-700">Greeting</label>
                  <p id="preview-greeting" className="mt-1 whitespace-pre-wrap">{characterData.greeting}</p>
                </div>
                <div className="mt-4">
                  <label htmlFor="preview-scenario" className="font-medium text-gray-700">Scenario</label>
                  <p id="preview-scenario" className="mt-1 whitespace-pre-wrap">{characterData.scenario}</p>
                </div>
                <div className="mt-4">
                  <label htmlFor="preview-conversation" className="font-medium text-gray-700">Example Conversation</label>
                  <div id="preview-conversation" className="mt-1">
                    {Array.isArray(characterData.exampleConversation) ? (
                      characterData.exampleConversation.map((exchange, index) => (
                        <div key={index} className="conversation-exchange">
                          <p className="user-message">User: {exchange.user}</p>
                          <p className="character-message">{characterData.name}: {exchange.character}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-red-500">Conversation format not supported</p>
                    )}
                  </div>
                </div>
              </div>
              
              {imageUrl && (
                <div className="image-preview">
                  <img src={imageUrl} alt={characterData.name} className="w-full h-auto rounded-lg" />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="button-group mt-8">
          {activeStep > 1 && (
            <button onClick={handleBack} className="btn btn-back">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}
          
          {activeStep === 3 && (
            <button onClick={handleExport} className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Character
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-content">
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
              className="btn btn-success"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}