/**
 * Audio Service - Handles audio file download (mocked)
 */
import { AxiosError } from 'axios';

export class AudioService {
  /**
   * Mock download of audio file from URL
   * In production, this would actually download and validate the audio file
   */
  static async downloadAudio(_audioUrl: string): Promise<Buffer> {
    try {
      // Mock: Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      // In production, you would do:
      // const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      // return Buffer.from(response.data);

      // Mock: Return empty buffer (simulating successful download)
      return Buffer.from('mock-audio-data');
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Failed to download audio: ${axiosError.message}`);
    }
  }

  /**
   * Retry logic for audio download
   */
  static async downloadAudioWithRetry(
    audioUrl: string,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ): Promise<Buffer> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.downloadAudio(audioUrl);
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          // Exponential backoff
          const delay = delayMs * Math.pow(2, attempt - 1);
          console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed after ${maxAttempts} attempts: ${lastError?.message}`);
  }
}

