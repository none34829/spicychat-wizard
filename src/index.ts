import dotenv from 'dotenv';
dotenv.config();

import { createServer } from './server';

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = createServer();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});