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
    timestamps: false,
  }
);

TranscriptionSchema.index({ createdAt: -1 });
TranscriptionSchema.index({ createdAt: -1, source: 1 });
TranscriptionSchema.index({ audioUrl: 1 });
TranscriptionSchema.index({ source: 1, createdAt: -1 });

export default mongoose.model<ITranscription>('Transcription', TranscriptionSchema);

