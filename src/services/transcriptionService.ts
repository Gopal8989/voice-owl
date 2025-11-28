/**
 * Transcription Service - Handles mock transcription
 */
import { AudioService } from './audioService';

export class TranscriptionService {
  /**
   * Mock transcription - returns dummy text
   * In production, this would use actual transcription service
   */
  static async transcribeAudio(audioUrl: string): Promise<string> {
    // Mock: Download audio (with retry)
    await AudioService.downloadAudioWithRetry(audioUrl);

    // Mock: Return dummy transcription
    return 'transcribed text';
  }
}

