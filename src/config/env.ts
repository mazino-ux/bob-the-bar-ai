import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Export config object
export const config = {
  // Core App
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.APP_NAME || 'Bob the Bar AI',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/bob-the-bar-ai',
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'bob-the-bar-ai',
  
  // AI Services
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  DEEPSEEK_API_URL: process.env.DEEPSEEK_API_URL
};

// Type for our config
export type Config = typeof config;