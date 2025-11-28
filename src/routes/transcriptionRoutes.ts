/**
 * Transcription Routes with Validation and Rate Limiting
 */
import { Router } from 'express';
import { TranscriptionController } from '../controllers/transcriptionController';
import { validateTranscriptionRequest, validateAzureTranscriptionRequest } from '../middlewares/validator';
import { transcriptionRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @swagger
 * /api/transcription:
 *   post:
 *     summary: Create a mock transcription from an audio URL
 *     tags: [Transcription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TranscriptionRequest'
 *           example:
 *             audioUrl: "https://example.com/sample.mp3"
 *     responses:
 *       201:
 *         description: Transcription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TranscriptionResponse'
 *             example:
 *               id: "507f1f77bcf86cd799439011"
 *               audioUrl: "https://example.com/sample.mp3"
 *               transcription: "transcribed text"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/transcription',
  transcriptionRateLimiter.middleware(),
  validateTranscriptionRequest,
  TranscriptionController.createTranscription
);

/**
 * @swagger
 * /api/transcriptions:
 *   get:
 *     summary: Get all transcriptions from the last 30 days
 *     tags: [Transcription]
 *     responses:
 *       200:
 *         description: List of transcriptions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TranscriptionsListResponse'
 *             example:
 *               count: 2
 *               transcriptions:
 *                 - id: "507f1f77bcf86cd799439011"
 *                   audioUrl: "https://example.com/sample1.mp3"
 *                   transcription: "transcribed text"
 *                   source: "mock"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                 - id: "507f1f77bcf86cd799439012"
 *                   audioUrl: "https://example.com/sample2.mp3"
 *                   transcription: "Azure transcribed text"
 *                   source: "azure"
 *                   createdAt: "2024-01-14T09:20:00.000Z"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/transcriptions', TranscriptionController.getTranscriptions);

/**
 * @swagger
 * /api/azure-transcription:
 *   post:
 *     summary: Create a transcription using Azure Speech-to-Text service
 *     tags: [Transcription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AzureTranscriptionRequest'
 *           example:
 *             audioUrl: "https://example.com/sample.mp3"
 *             language: "en-US"
 *     responses:
 *       201:
 *         description: Azure transcription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TranscriptionResponse'
 *             example:
 *               id: "507f1f77bcf86cd799439013"
 *               audioUrl: "https://example.com/sample.mp3"
 *               transcription: "[Mock] Transcribed text from https://example.com/sample.mp3"
 *               source: "azure"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       502:
 *         description: Azure Speech service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/azure-transcription',
  transcriptionRateLimiter.middleware(),
  validateAzureTranscriptionRequest,
  TranscriptionController.createAzureTranscription
);

export default router;

