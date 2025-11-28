/**
 * Environment Configuration Loader
 * This file ensures environment variables are loaded before any other modules
 */
import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.warn(`⚠️  Warning: Missing environment variables: ${missingVars.join(', ')}`);
  console.warn(`Using default values. Make sure to set these in your .env file.`);
}

// Export environment variables with defaults
export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '7070', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/voiceowl',
  MONGODB_MAX_POOL_SIZE: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
  MONGODB_MIN_POOL_SIZE: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2', 10),

  // Azure Speech
  AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY,
  AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION,

  // Retry Configuration
  MAX_RETRY_ATTEMPTS: parseInt(process.env.MAX_RETRY_ATTEMPTS || '3', 10),
  RETRY_DELAY_MS: parseInt(process.env.RETRY_DELAY_MS || '1000', 10),
};

// Helper to check if running in production
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

