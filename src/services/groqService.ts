import Groq from 'groq-sdk';
import { CharacterData } from '../types';

const groq = new Groq({apiKey: process.env.GROQ_API_KEY || ''});

/**
 * character details using Groq's LLM
 */
export async function generateCharacterDetails(description: string, relationship: string): Promise<CharacterData> {
  try {
    const prompt = `
You are an AI character creation assistant for SpicyChat. Based on the description below, create a unique and original character profile. Be creative and avoid using common or stereotypical names and characteristics. Each generation should be different, even for similar descriptions.

Generate the following fields:
- name: Create a unique, original name that fits the character's background (avoid reusing common names)
- title: A short, catchy title for the character
- persona: A detailed description of the character's personality, background, knowledge, and traits
- relationship: "${relationship}" (Use this exact relationship provided by the user)
- greeting: Write a brief, natural greeting that matches the established relationship. Use a casual tone with a simple "Hi", "Hello", or "Hey" that fits how they know each other.
- scenario: The setting or context for the conversation
- exampleConversation: Create a dynamic conversation between the user and the character with at least 3 exchanges. The dialogue should reflect their established relationship and history together. Each exchange MUST include both the user's message and the character's response. The character's responses should reflect their personality and be engaging.

Make sure the character is engaging, detailed, and consistent with the description. Avoid falling into stereotypes or using predictable patterns.

Description: ${description}

Respond in JSON format only, with no additional text before or after. The JSON should have this structure:
{
  "name": "",
  "title": "",
  "persona": "",
  "relationship": "${relationship}",
  "greeting": "",
  "scenario": "",
  "exampleConversation": [
    {"user": "message here", "character": "response here"},
    {"user": "message here", "character": "response here"},
    {"user": "message here", "character": "response here"}
  ]
}

IMPORTANT: 
- Ensure that EVERY exchange in exampleConversation has both a user message AND a character response
- Keep all content appropriate and professional
- The greeting and conversation should match the established relationship
- Avoid suggestive or inappropriate content
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      temperature: 0.9,
      max_tokens: 2048,
      top_p: 0.95,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
    });

    const responseContent = completion.choices[0]?.message?.content || '';
    
    // jSON from the response
    const jsonMatch = responseContent.match(/({[\s\S]*})/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from LLM response');
    }

    // parsing
    const characterData = JSON.parse(jsonMatch[0]) as CharacterData;
    
    const requiredFields = ['name', 'title', 'persona', 'relationship', 'greeting', 'scenario', 'exampleConversation'];
    for (const field of requiredFields) {
      if (!characterData[field as keyof CharacterData]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(characterData.exampleConversation)) {
      throw new Error('Example conversation must be an array');
    }

    for (const exchange of characterData.exampleConversation) {
      if (!exchange.user?.trim() || !exchange.character?.trim()) {
        throw new Error('Example conversation contains empty messages');
      }
    }

    return characterData;
  } catch (error) {
    console.error('Error in Groq service:', error);
    throw new Error('Failed to generate character details');
  }
}