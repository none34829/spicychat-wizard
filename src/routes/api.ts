import express from 'express';
import { generateCharacter, getCharacterFromUrl } from '../controllers/characterController';
import { generateImage } from '../controllers/imageController';

const router = express.Router();

// Character generation endpoints
router.post('/character/generate', generateCharacter);
router.post('/character/extract', getCharacterFromUrl);

// Image generation endpoint
router.post('/image/generate', generateImage);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

export default router;