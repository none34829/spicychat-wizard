import express from 'express';
import { generateCharacter, getCharacterFromUrl } from '../controllers/characterController';
import { generateImage } from '../controllers/imageController';
import { Request, Response } from 'express';

const router = express.Router();

// Character generation endpoints
router.post('/character/generate', generateCharacter as unknown as express.RequestHandler);
router.post('/character/extract', getCharacterFromUrl as unknown as express.RequestHandler);

// Image generation endpoint
router.post('/image/generate', generateImage as unknown as express.RequestHandler);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

export default router;



// In your api.ts routes file
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API is working' });
  });