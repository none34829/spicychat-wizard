import { Request, Response } from 'express';
import { z } from 'zod';
import { generateCharacterDetails } from '../services/groqService';
import { extractContentFromUrl } from '../services/exaService';
import { CharacterData } from '../types';

const GenerateCharacterSchema = z.object({
  description: z.string().min(10).max(1000),
  relationship: z.string().min(5).max(200),
  url: z.string().url().optional(),
});

export async function generateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = GenerateCharacterSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid input',
          errors: validationResult.error.format()
        });
        return;
      }
      
      const { description, relationship, url } = validationResult.data;
      
      let enhancedDescription = description;
      if (url) {
        try {
          const extractedContent = await extractContentFromUrl(url);
          enhancedDescription = `${description}\n\nAdditional context from URL: ${extractedContent}`;
        } catch (error) {
          console.error('Error extracting content from URL:', error);
        }
      }
      
      const characterData = await generateCharacterDetails(enhancedDescription, relationship);
      
      const finalCharacterData = {
        ...characterData,
        originalDescription: description
      };
      
      res.status(200).json({
        status: 'success',
        data: finalCharacterData
      });
    } catch (error) {
      console.error('Error generating character:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to generate character'
      });
    }
  }

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
    
    const characterData = await generateCharacterDetails(
      `Create a character based on the following content: ${extractedContent}`,
      "new acquaintance who recently met"
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