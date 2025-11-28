/**
 * MongoDB Database Configuration with Connection Pooling
 */
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { DatabaseError } from '../utils/errors';
import { env } from './env';

// Get MongoDB URI from environment configuration
const MONGODB_URI = env.MONGODB_URI;

// Log connection URI (without sensitive credentials)
if (env.NODE_ENV === 'development') {
  const uriDisplay = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
  logger.info(`Connecting to MongoDB: ${uriDisplay}`);
}

// Connection pool options for scaling
const connectionOptions = {
  maxPoolSize: env.MONGODB_MAX_POOL_SIZE,
  minPoolSize: env.MONGODB_MIN_POOL_SIZE,
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  socketTimeoutMS: 45000, // How long to wait for a socket to be available
  connectTimeoutMS: 10000, // How long to wait for initial connection
  heartbeatFrequencyMS: 10000, // How often to check server status
};

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, connectionOptions);
    logger.info('MongoDB connected successfully', {
      maxPoolSize: connectionOptions.maxPoolSize,
      minPoolSize: connectionOptions.minPoolSize,
    });

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error as Error);
    throw new DatabaseError(`Connection failed: ${(error as Error).message}`);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection error', error as Error);
  }
};

export const getDatabaseStatus = (): {
  readyState: number;
  isConnected: boolean;
  poolSize?: number;
} => {
  const connection = mongoose.connection;
  return {
    readyState: connection.readyState,
    isConnected: connection.readyState === 1,
    poolSize: (connection as mongoose.Connection & { poolSize?: number }).poolSize,
  };
};

