import { Request, Response } from 'express';
import { z } from 'zod';
import { generateCharacterImage } from '../services/runwareService';

// Validate the image generation request
const GenerateImageSchema = z.object({
  characterData: z.object({
    name: z.string(),
    title: z.string(),
    persona: z.string(),
  }),
  style: z.string().optional(),
});

// Generate an image for a character
export async function generateImage(req: Request, res: Response) {
  try {
    const validationResult = GenerateImageSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input',
        errors: validationResult.error.format()
      });
    }
    
    const { characterData, style } = validationResult.data;
    
    // Create a prompt for the image generation
    const prompt = `Character portrait for "${characterData.name}", ${characterData.title}. ${characterData.persona.substring(0, 200)}`;
    
    // Generate the image
    const imageUrl = await generateCharacterImage(prompt, style || 'realistic portrait');
    
    return res.status(200).json({
      status: 'success',
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate image'
    });
  }
}