import { Request, Response } from 'express';
import { z } from 'zod';
import { generateCharacterDetails } from '../services/groqService';
import { extractContentFromUrl } from '../services/exaService';
import { CharacterData } from '../types';

// Validate the character generation request
const GenerateCharacterSchema = z.object({
  description: z.string().min(10).max(1000),
  url: z.string().url().optional(),
});

// Generate a character based on text description
export async function generateCharacter(req: Request, res: Response) {
  try {
    const validationResult = GenerateCharacterSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input',
        errors: validationResult.error.format()
      });
    }
    
    const { description, url } = validationResult.data;
    
    // If URL is provided, extract content first
    let enhancedDescription = description;
    if (url) {
      try {
        const extractedContent = await extractContentFromUrl(url);
        enhancedDescription = `${description}\n\nAdditional context from URL: ${extractedContent}`;
      } catch (error) {
        console.error('Error extracting content from URL:', error);
        // Continue with original description if URL extraction fails
      }
    }
    
    // Generate character details using Groq
    const characterData = await generateCharacterDetails(enhancedDescription);
    
    return res.status(200).json({
      status: 'success',
      data: characterData
    });
  } catch (error) {
    console.error('Error generating character:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate character'
    });
  }
}

// Extract character details from a URL
export async function getCharacterFromUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Valid URL is required'
      });
    }
    
    const extractedContent = await extractContentFromUrl(url);
    
    // Generate character based on extracted content
    const characterData = await generateCharacterDetails(
      `Create a character based on the following content: ${extractedContent}`
    );
    
    return res.status(200).json({
      status: 'success',
      data: characterData
    });
  } catch (error) {
    console.error('Error extracting character from URL:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to extract character from URL'
    });
  }
}