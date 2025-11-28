/**
 * Transcription Controller - Handles HTTP requests with Enhanced Error Handling
 */
import { Request, Response } from 'express';
import { TranscriptionService } from '../services/transcriptionService';
import { AzureSpeechService } from '../services/azureSpeechService';
import { TranscriptionRepository } from '../repositories/transcriptionRepository';
import { TranscriptionRequest, AzureTranscriptionRequest } from '../types';
import { DatabaseError, ExternalServiceError } from '../utils/errors';
import { logger } from '../utils/logger';
import { RequestWithId } from '../middlewares/requestId';

export class TranscriptionController {
  private static azureSpeechService = new AzureSpeechService();

  /**
   * POST /transcription - Mock transcription endpoint
   */
  static async createTranscription(req: Request, res: Response): Promise<void> {
    const requestId = (req as RequestWithId).requestId;
    const { audioUrl }: TranscriptionRequest = req.body;

    try {
      logger.request(req, 'Creating transcription', { audioUrl });

      // Transcribe audio (mock)
      const transcription = await TranscriptionService.transcribeAudio(audioUrl);

      // Save to MongoDB
      const saved = await TranscriptionRepository.create(audioUrl, transcription, 'mock');

      logger.info('Transcription created successfully', { requestId, transcriptionId: saved._id });

      // Return the MongoDB record's _id
      res.status(201).json({
        success: true,
        message: 'Transcription created successfully',
        data: {
          id: saved._id,
          audioUrl: saved.audioUrl,
          transcription: saved.transcription,
          createdAt: saved.createdAt,
        },
      });
    } catch (error) {
      logger.error('Error creating transcription', error as Error, { requestId, audioUrl });
      
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(`Failed to create transcription: ${(error as Error).message}`);
    }
  }

  /**
   * GET /transcriptions - Get transcriptions from last 30 days
   */
  static async getTranscriptions(req: Request, res: Response): Promise<void> {
    const requestId = (req as RequestWithId).requestId;

    try {
      logger.request(req, 'Fetching transcriptions');

      const transcriptions = await TranscriptionRepository.getRecentTranscriptions(30);

      logger.info('Transcriptions fetched successfully', {
        requestId,
        count: transcriptions.length,
      });

      res.status(200).json({
        success: true,
        message: 'Transcriptions fetched successfully',
        data: {
          count: transcriptions.length,
          transcriptions,
        },
      });
    } catch (error) {
      logger.error('Error fetching transcriptions', error as Error, { requestId });
      throw new DatabaseError(`Failed to fetch transcriptions: ${(error as Error).message}`);
    }
  }

  /**
   * POST /azure-transcription - Azure Speech-to-Text endpoint
   */
  static async createAzureTranscription(req: Request, res: Response): Promise<void> {
    const requestId = (req as RequestWithId).requestId;
    const { audioUrl, language = 'en-US' }: AzureTranscriptionRequest = req.body;

    try {
      logger.request(req, 'Creating Azure transcription', { audioUrl, language });

      // Transcribe using Azure Speech Service (with retry)
      const transcription = await TranscriptionController.azureSpeechService.transcribeAudioWithRetry(
        audioUrl,
        language
      );

      // Save to MongoDB with source='azure'
      const saved = await TranscriptionRepository.create(audioUrl, transcription, 'azure');

      logger.info('Azure transcription created successfully', {
        requestId,
        transcriptionId: saved._id,
        language,
      });

      // Return the MongoDB record
      res.status(201).json({
        success: true,
        message: 'Azure transcription created successfully',
        data: {
          id: saved._id,
          audioUrl: saved.audioUrl,
          transcription: saved.transcription,
          source: saved.source,
          createdAt: saved.createdAt,
        },
      });
    } catch (error) {
      logger.error('Error creating Azure transcription', error as Error, {
        requestId,
        audioUrl,
        language,
      });

      if (error instanceof DatabaseError) {
        throw error;
      }
      
      if (error instanceof ExternalServiceError) {
        throw error;
      }

      throw new ExternalServiceError(
        `Azure Speech service failed: ${(error as Error).message}`,
        'Azure Speech-to-Text'
      );
    }
  }
}

