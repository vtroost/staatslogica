import OpenAI from 'openai';

// Controleer of de API-key aanwezig is
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key - Make sure OPENAI_API_KEY is set in your .env.local');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}); 