import express from 'express';
import { generateCharacter, getCharacterFromUrl } from '../controllers/characterController';
import { generateImage } from '../controllers/imageController';
import { Request, Response } from 'express';

const router = express.Router();

router.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

router.post('/character/generate', generateCharacter as unknown as express.RequestHandler);
router.post('/character/extract', getCharacterFromUrl as unknown as express.RequestHandler);

router.post('/image/generate', generateImage as unknown as express.RequestHandler);

router.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

router.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.status(200).json({ message: 'API is working' });
});

export default router;