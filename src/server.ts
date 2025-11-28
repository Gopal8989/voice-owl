/**
 * Server Entry Point
 * IMPORTANT: Import env config FIRST to ensure environment variables are loaded
 */
import './config/env'; // Load environment variables first
import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

const PORT = env.PORT;

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`🎤 Transcription API: http://localhost:${PORT}/api/transcription`);
      console.log(`☁️  Azure Transcription API: http://localhost:${PORT}/api/azure-transcription`);
      console.log(`📋 Get Transcriptions: http://localhost:${PORT}/api/transcriptions`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();

