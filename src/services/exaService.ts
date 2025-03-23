import axios from 'axios';

// Exa API base URL
const EXA_API_URL = 'https://api.exa.ai/contents';

interface ExaContentParams {
  urls: string[];
  text?: boolean;
  highlights?: {
    enabled?: boolean;
    count?: number;
    maxLength?: number;
  };
  summary?: {
    enabled?: boolean;
    maxLength?: number;
  };
  livecrawl?: 'never' | 'fallback' | 'always' | 'auto';
  livecrawlTimeout?: number;
  subpages?: number;
  subpageTarget?: string;
}

interface ExaContentResult {
  title: string;
  url: string;
  publishedDate: string | null;
  author: string | null;
  text: string;
  highlights?: string[];
  highlightScores?: number[];
  summary?: string;
}

/**
 * Extract content from a URL using Exa's API
 */
export async function extractContentFromUrl(url: string): Promise<string> {
  try {
    const params: ExaContentParams = {
      urls: [url],
      text: true,
      livecrawl: 'fallback',
      summary: {
        enabled: true,
        maxLength: 1000
      },
      highlights: {
        enabled: true,
        count: 5
      }
    };

    const response = await axios.post(EXA_API_URL, params, {
      headers: {
        'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      throw new Error('No content found at the provided URL');
    }

    const result: ExaContentResult = response.data.results[0];
    
    // Extract text content from the response
    const content = result.text || '';
    
    // Add summary if available
    const summary = result.summary ? `\n\nSummary: ${result.summary}` : '';
    
    // Add highlights if available
    const highlights = result.highlights?.length 
      ? `\n\nKey points: ${result.highlights.join('\n- ')}` 
      : '';
    
    const fullContent = content + summary + highlights;
    
    // Truncate if too long (to avoid token issues with LLM)
    return fullContent.length > 5000 ? fullContent.substring(0, 5000) + '...' : fullContent;
  } catch (error) {
    console.error('Error in Exa service:', error);
    throw new Error('Failed to extract content from URL');
  }
}

/**
 * Extract content from multiple URLs using Exa's API
 */
export async function extractContentFromUrls(urls: string[]): Promise<ExaContentResult[]> {
  try {
    const params: ExaContentParams = {
      urls: urls,
      text: true,
      livecrawl: 'fallback',
      summary: {
        enabled: true
      },
      highlights: {
        enabled: true
      }
    };

    const response = await axios.post(EXA_API_URL, params, {
      headers: {
        'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      throw new Error('No content found at the provided URLs');
    }

    return response.data.results;
  } catch (error) {
    console.error('Error in Exa service:', error);
    throw new Error('Failed to extract content from URLs');
  }
}