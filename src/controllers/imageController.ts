import { Request, Response } from 'express';
import { z } from 'zod';
import { generateCharacterImage } from '../services/runwareService';

const GenerateImageSchema = z.object({
  characterData: z.object({
    name: z.string(),
    title: z.string(),
    persona: z.string(),
    originalDescription: z.string(),
  }),
  style: z.string().optional(),
});

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
    
    const prompt = `${style} of ${characterData.name}, ${characterData.title}. ${characterData.originalDescription}. A detailed, high-quality image showing ${characterData.persona}`;
    console.log('Generated prompt:', prompt);
    
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