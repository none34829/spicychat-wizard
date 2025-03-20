import Groq from 'groq-sdk';
import { CharacterData } from '../types';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Generate character details using Groq's LLM
 */
export async function generateCharacterDetails(description: string): Promise<CharacterData> {
  try {
    const prompt = `
You are an AI character creation assistant for SpicyChat. Based on the description below, create a detailed character profile with the following fields:
- name: The character's name
- title: A short, catchy title for the character
- persona: A detailed description of the character's personality, background, knowledge, and traits
- greeting: The first message the character will send to users
- scenario: The setting or context for the conversation
- exampleConversation: An example dialogue between the user and the character (at least 3 exchanges)

Make sure the character is engaging, detailed, and consistent with the description.

Description: ${description}

Respond in JSON format only, with no additional text before or after. The JSON should have this structure:
{
  "name": "",
  "title": "",
  "persona": "",
  "greeting": "",
  "scenario": "",
  "exampleConversation": ""
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 2048,
    });

    const responseContent = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from the response
    const jsonMatch = responseContent.match(/({[\s\S]*})/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from LLM response');
    }

    // Parse the JSON
    const characterData = JSON.parse(jsonMatch[0]) as CharacterData;
    
    // Validate the response has all required fields
    const requiredFields = ['name', 'title', 'persona', 'greeting', 'scenario', 'exampleConversation'];
    for (const field of requiredFields) {
      if (!characterData[field as keyof CharacterData]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return characterData;
  } catch (error) {
    console.error('Error in Groq service:', error);
    throw new Error('Failed to generate character details');
  }
}