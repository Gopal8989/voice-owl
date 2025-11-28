/**
 * TypeScript interfaces for request/response types
 */

export interface TranscriptionRequest {
  audioUrl: string;
}

export interface AzureTranscriptionRequest {
  audioUrl: string;
  language?: string; // Optional language code (e.g., 'en-US', 'fr-FR')
}

export interface TranscriptionResponse {
  id: string;
  audioUrl: string;
  transcription: string;
  createdAt: Date;
  source?: 'mock' | 'azure';
}

export interface TranscriptionDocument {
  _id: string;
  audioUrl: string;
  transcription: string;
  createdAt: Date;
  source?: 'mock' | 'azure';
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  requestId?: string;
}

