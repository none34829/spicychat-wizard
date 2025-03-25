# SpicyChat Character Wizard 🧙‍♂️

A user-friendly wizard interface for creating AI characters and exporting them to SpicyChat. Create detailed character profiles, generate AI images, and bring your characters to life!

## Features

- Character Generation
- AI Image Generation
- Three-step Wizard Interface
- Export to SpicyChat
- Relationship-based Conversations
- Preview Generated Characters

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API Keys for:
  - GROQ API (for character generation)
  - Runware API (for image generation)
  - Exa API (for Content Crawling)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/none34829/spicychat-wizard
cd spicychat-wizard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
RUNWARE_API_KEY=your_runware_api_key_here
EXA_API_KEY=your_exa_api_key_here
```

## Running the Application

1. Start the development server:
```bash
npm run dev:full
# or
yarn dev:full
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

## Using the Wizard

1. **Create Character**
   - Enter a character description
   - Define your relationship with the character
   - Optionally provide a reference URL

2. **Generate Image**
   - Choose an image style
   - Add additional details for the image
   - Generate and preview the character image

3. **Export**
   - Review the character preview
   - Export as JSON file
   - Import into SpicyChat

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure your API keys are correctly set in the `.env` file
   - Check that the keys have sufficient permissions

2. **Image Generation Issues**
   - Verify your Runware API key is active
   - Ensure prompt follows content guidelines

3. **Export Issues**
   - Make sure all required fields are filled
   - Check that the JSON format matches SpicyChat requirements

## Acknowledgments

- GROQ for character generation
- Runware for image generation