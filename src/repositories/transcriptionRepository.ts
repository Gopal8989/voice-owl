/**
 * Transcription Repository - Data access layer for MongoDB
 */
import Transcription from '../models/Transcription';
import { TranscriptionDocument } from '../types';

export class TranscriptionRepository {
  /**
   * Create a new transcription record
   */
  static async create(
    audioUrl: string,
    transcription: string,
    source: 'mock' | 'azure' = 'mock'
  ): Promise<TranscriptionDocument> {
    const doc = new Transcription({
      audioUrl,
      transcription,
      source,
      createdAt: new Date(),
    });

    const saved = await doc.save();
    return {
      _id: saved._id.toString(),
      audioUrl: saved.audioUrl,
      transcription: saved.transcription,
      createdAt: saved.createdAt,
      source: saved.source,
    };
  }

  /**
   * Get transcriptions created in the last N days
   */
  static async getRecentTranscriptions(days: number = 30): Promise<TranscriptionDocument[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const docs = await Transcription.find({
      createdAt: { $gte: cutoffDate },
    })
      .sort({ createdAt: -1 })
      .exec();

    return docs.map((doc) => ({
      _id: doc._id.toString(),
      audioUrl: doc.audioUrl,
      transcription: doc.transcription,
      createdAt: doc.createdAt,
      source: doc.source,
    }));
  }

  /**
   * Get transcription by ID
   */
  static async getById(id: string): Promise<TranscriptionDocument | null> {
    const doc = await Transcription.findById(id).exec();
    if (!doc) return null;

    return {
      _id: doc._id.toString(),
      audioUrl: doc.audioUrl,
      transcription: doc.transcription,
      createdAt: doc.createdAt,
      source: doc.source,
    };
  }
}

