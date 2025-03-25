import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api';

export function createServer() {
  const app = express();

  // middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '25'), // limit each IP to 25 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  app.use('/api', limiter, apiRoutes);
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });
  }
  
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body
    });
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
  
  return app;
}

const app = createServer();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  console.log(`Image generation endpoint: http://localhost:${PORT}/api/image/generate`);
});