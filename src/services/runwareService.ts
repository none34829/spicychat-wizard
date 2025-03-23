import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const RUNWARE_API_URL = 'https://api.runware.ai/v1';

export async function generateCharacterImage(prompt: string, style: string): Promise<string> {
  console.log('Starting image generation with Runware API');
  console.log('API Key available:', !!process.env.RUNWARE_API_KEY);
  
  try {
    if (!process.env.RUNWARE_API_KEY) {
      console.error('RUNWARE_API_KEY environment variable is not defined');
      throw new Error('RUNWARE_API_KEY is not configured');
    }

    // If style is provided and not already in the prompt, prepend it
    const finalPrompt = style && !prompt.includes(style) 
      ? `${style} ${prompt}` 
      : prompt;
      
    console.log('Final prompt:', finalPrompt);

    // Build the payload as an array of tasks
    const payload = [
      {
        taskType: "authentication",
        apiKey: process.env.RUNWARE_API_KEY  // or your key as a string
      },
      {
        taskType: "imageInference",
        taskUUID: uuidv4(),
        positivePrompt: finalPrompt,
        negativePrompt: "blurry, deformed, extra limbs, bad anatomy, poorly drawn face",
        width: 512,
        height: 512,
        model: "rundiffusion:130@100", 
        steps: 20,
        CFGScale: 7.5,
        numberResults: 1,
        outputType: "URL",
        outputFormat: "PNG"
      }
    ];
    
    
    
    console.log('Sending request to Runware API:', {
      url: RUNWARE_API_URL,
      payload: JSON.stringify(payload)
    });

    const response = await axios.post(
      RUNWARE_API_URL,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.RUNWARE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000 // 60 seconds timeout
      }
    );
    
    console.log('Runware API response status:', response.status);
    console.log('Runware API response data:', JSON.stringify(response.data, null, 2));
    
    // Handle different possible response formats
    let imageUrl;
    
    // Format 1: response.data.tasks[0].imageURL
    if (response.data?.tasks?.[0]?.imageURL) {
      imageUrl = response.data.tasks[0].imageURL;
    }
    // Format 2: response.data.data[0].imageURL
    else if (response.data?.data?.[0]?.imageURL) {
      imageUrl = response.data.data[0].imageURL;
    }
    // Format 3: response.data.imageURL
    else if (response.data?.imageURL) {
      imageUrl = response.data.imageURL;
    }
    
    if (!imageUrl) {
      console.error('Unexpected API response format:', JSON.stringify(response.data));
      throw new Error('Could not find image URL in API response');
    }
    
    console.log('Extracted image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      console.error("Runware API error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: errorMessage,
        data: error.response?.data ? JSON.stringify(error.response.data) : null,
        headers: error.response?.headers ? JSON.stringify(error.response.headers) : null
      });
      throw new Error(`Runware API error: ${errorMessage}`);
    } else if (error instanceof Error) {
      console.error("Error generating image:", error.message, error.stack);
      throw error;
    } else {
      console.error("Unknown error generating image:", error);
      throw new Error('Failed to generate character image');
    }
  }
}
