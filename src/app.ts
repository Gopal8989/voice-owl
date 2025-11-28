import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import transcriptionRoutes from './routes/transcriptionRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { requestIdMiddleware } from './middlewares/requestId';
import { apiRateLimiter } from './middlewares/rateLimiter';
import { getDatabaseStatus } from './config/database';
import { swaggerSpec } from './config/swagger';
import { getBaseUrl, getSwaggerUrl } from './utils/swaggerHelpers';

const app: Application = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestIdMiddleware);
app.use('/api', apiRateLimiter.middleware());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns server status, database connection, memory usage, and API endpoints including Swagger URL
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "ok"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               uptime: 3600.5
 *               database:
 *                 connected: true
 *                 readyState: 1
 *               memory:
 *                 used: 45.23
 *                 total: 128.5
 *               api:
 *                 swagger: "http://localhost:7070/api-docs"
 *                 health: "http://localhost:7070/health"
 *                 transcription: "http://localhost:7070/api/transcription"
 *                 transcriptions: "http://localhost:7070/api/transcriptions"
 *                 azureTranscription: "http://localhost:7070/api/azure-transcription"
 *       503:
 *         description: Service unavailable (database disconnected)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
  const dbStatus = getDatabaseStatus();
  const baseUrl = getBaseUrl(req);
  
  const health = {
    success: true,
    message: dbStatus.isConnected ? 'Server is healthy' : 'Server is running but database is disconnected',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbStatus.isConnected,
        readyState: dbStatus.readyState,
      },
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      },
      api: {
        swagger: getSwaggerUrl(req),
        health: `${baseUrl}/health`,
        transcription: `${baseUrl}/api/transcription`,
        transcriptions: `${baseUrl}/api/transcriptions`,
        azureTranscription: `${baseUrl}/api/azure-transcription`,
      },
    },
  };

  const statusCode = dbStatus.isConnected ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * @swagger
 * /api/info:
 *   get:
 *     summary: Get API information and available endpoints
 *     description: Returns API name, version, description, Swagger URL, and all available endpoints with their methods and descriptions
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information including Swagger URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiInfoResponse'
 *             example:
 *               name: "VoiceOwl API"
 *               version: "1.0.0"
 *               description: "Audio Transcription API Service"
 *               swagger: "http://localhost:7070/api-docs"
 *               endpoints:
 *                 health: "http://localhost:7070/health"
 *                 transcription:
 *                   create: "http://localhost:7070/api/transcription"
 *                   method: "POST"
 *                   description: "Create a mock transcription"
 *                 transcriptions:
 *                   list: "http://localhost:7070/api/transcriptions"
 *                   method: "GET"
 *                   description: "Get transcriptions from last 30 days"
 *                 azureTranscription:
 *                   create: "http://localhost:7070/api/azure-transcription"
 *                   method: "POST"
 *                   description: "Create transcription using Azure Speech-to-Text"
 */
app.get('/api/info', (req, res) => {
  const baseUrl = getBaseUrl(req);
  
  res.status(200).json({
    success: true,
    message: 'API information retrieved successfully',
    data: {
      name: 'VoiceOwl API',
      version: '1.0.0',
      description: 'Audio Transcription API Service',
      swagger: getSwaggerUrl(req),
      endpoints: {
        health: `${baseUrl}/health`,
        transcription: {
          create: `${baseUrl}/api/transcription`,
          method: 'POST',
          description: 'Create a mock transcription',
        },
        transcriptions: {
          list: `${baseUrl}/api/transcriptions`,
          method: 'GET',
          description: 'Get transcriptions from last 30 days',
        },
        azureTranscription: {
          create: `${baseUrl}/api/azure-transcription`,
          method: 'POST',
          description: 'Create transcription using Azure Speech-to-Text',
        },
      },
    },
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VoiceOwl API Documentation',
}));

app.use('/api', transcriptionRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

