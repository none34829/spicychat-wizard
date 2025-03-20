import axios from 'axios';

// Runware API base URL
const RUNWARE_API_URL = 'https://api.runware.ai/v1/image-generation';

/**
 * Generate a character image using Runware's API
 */
export async function generateCharacterImage(prompt: string, style: string): Promise<string> {
  try {
    const response = await axios.post(
      RUNWARE_API_URL,
      {
        prompt: prompt,
        style: style,
        dimensions: {
          width: 512,
          height: 512
        },
        format: 'png',
        n: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.RUNWARE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data || !response.data.images || response.data.images.length === 0) {
      throw new Error('No image generated');
    }

    // Return the URL of the generated image
    return response.data.images[0].url;
  } catch (error) {
    console.error('Error in Runware service:', error);
    throw new Error('Failed to generate character image');
  }
}