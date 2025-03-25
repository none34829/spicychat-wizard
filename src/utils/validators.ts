import { z } from 'zod';

// URL validation
export const urlValidator = z.string().url('Must be a valid URL');

// character data validation
export const characterDataValidator = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  persona: z.string().min(20, 'Persona must be at least 20 characters'),
  greeting: z.string().min(10, 'Greeting must be at least 10 characters'),
  scenario: z.string().min(20, 'Scenario must be at least 20 characters'),
  exampleConversation: z.string().min(50, 'Example conversation must be at least 50 characters'),
});

// image generation validation
export const imageGenerationValidator = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  style: z.string().optional(),
});