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
  console.log('Image generation request received:', req.method, req.path);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    const validationResult = GenerateImageSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.format());
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input',
        errors: validationResult.error.format()
      });
    }
    
    const { characterData, style = 'realistic portrait' } = validationResult.data;
    
    // Create a prompt that includes the style
    const prompt = `${style} of "${characterData.name}", ${characterData.title}. ${characterData.persona.substring(0, 200)}`;
    console.log('Generated prompt:', prompt);
    
    // Generate the image - pass empty string for style since it's already in the prompt
    console.log('Calling Runware API with prompt that includes style');
    const imageUrl = await generateCharacterImage(prompt, '');
    
    console.log('Image URL received:', imageUrl);
    return res.status(200).json({
      status: 'success',
      data: { imageUrl }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating image:', {
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error('Unknown error generating image:', error);
    }
  
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate image'
    });
  }
}