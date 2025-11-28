/**
 * MongoDB Schema for Transcription
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface ITranscription extends Document {
  audioUrl: string;
  transcription: string;
  createdAt: Date;
  source?: 'mock' | 'azure';
}

const TranscriptionSchema: Schema = new Schema(
  {
    audioUrl: {
      type: String,
      required: true,
    },
    transcription: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ['mock', 'azure'],
      default: 'mock',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We're using createdAt manually
  }
);

// Indexes for optimal query performance

// 1. Primary index on createdAt (descending) for date range queries
TranscriptionSchema.index({ createdAt: -1 });

// 2. Compound index on createdAt + source for filtered date queries
// Useful for: "Get all Azure transcriptions from last 30 days"
TranscriptionSchema.index({ createdAt: -1, source: 1 });

// 3. Index on audioUrl for deduplication and lookups
TranscriptionSchema.index({ audioUrl: 1 });

// 4. Compound index on source + createdAt for source-specific queries
TranscriptionSchema.index({ source: 1, createdAt: -1 });

// 5. TTL Index (optional - uncomment for auto-deletion after 90 days)
// TranscriptionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Export the model
export default mongoose.model<ITranscription>('Transcription', TranscriptionSchema);

