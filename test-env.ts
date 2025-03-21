// test-env.ts
import dotenv from 'dotenv';
dotenv.config();

console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);
console.log('PORT:', process.env.PORT);