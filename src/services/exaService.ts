import axios from 'axios';

// Exa API base URL
const EXA_API_URL = 'https://api.exa.ai/contents';

/**
 * Extract content from a URL using Exa's API
 */
export async function extractContentFromUrl(url: string): Promise<string> {
  try {
    const response = await axios.get(EXA_API_URL, {
      params: {
        url,
        num_results: 1,
      },
      headers: {
        'x-api-key': process.env.EXA_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      throw new Error('No content found at the provided URL');
    }

    // Extract text content from the response
    const content = response.data.results[0].text || '';
    
    // Truncate if too long (to avoid token issues with LLM)
    return content.length > 5000 ? content.substring(0, 5000) + '...' : content;
  } catch (error) {
    console.error('Error in Exa service:', error);
    throw new Error('Failed to extract content from URL');
  }
}