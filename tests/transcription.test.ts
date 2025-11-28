/**
 * Transcription API Tests
 */
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import Transcription from '../src/models/Transcription';

describe('Transcription API', () => {
  beforeAll(async () => {
    // Connect to test database (MongoMemoryServer or test MongoDB)
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voiceowl_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up
    await Transcription.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear transcriptions before each test
    await Transcription.deleteMany({});
  });

  describe('POST /api/transcription', () => {
    it('should create a transcription successfully', async () => {
      const response = await request(app)
        .post('/api/transcription')
        .send({ audioUrl: 'https://example.com/sample.mp3' })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Transcription created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('audioUrl', 'https://example.com/sample.mp3');
      expect(response.body.data).toHaveProperty('transcription', 'transcribed text');
      expect(response.body.data).toHaveProperty('createdAt');
    });

    it('should return 400 if audioUrl is missing', async () => {
      const response = await request(app)
        .post('/api/transcription')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('audioUrl');
    });

    it('should return 400 if audioUrl is not a valid URL', async () => {
      const response = await request(app)
        .post('/api/transcription')
        .send({ audioUrl: 'not-a-valid-url' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/transcriptions', () => {
    it('should return transcriptions from last 30 days', async () => {
      // Create a recent transcription
      await Transcription.create({
        audioUrl: 'https://example.com/test1.mp3',
        transcription: 'test transcription 1',
        createdAt: new Date(),
      });

      // Create an old transcription (31 days ago)
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);
      await Transcription.create({
        audioUrl: 'https://example.com/test2.mp3',
        transcription: 'test transcription 2',
        createdAt: oldDate,
      });

      const response = await request(app)
        .get('/api/transcriptions')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Transcriptions fetched successfully');
      expect(response.body.data).toHaveProperty('count', 1);
      expect(response.body.data).toHaveProperty('transcriptions');
      expect(response.body.data.transcriptions).toHaveLength(1);
      expect(response.body.data.transcriptions[0].audioUrl).toBe('https://example.com/test1.mp3');
    });

    it('should return empty array if no transcriptions exist', async () => {
      const response = await request(app)
        .get('/api/transcriptions')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Transcriptions fetched successfully');
      expect(response.body.data).toHaveProperty('count', 0);
      expect(response.body.data.transcriptions).toHaveLength(0);
    });
  });

  describe('POST /api/azure-transcription', () => {
    it('should create an Azure transcription successfully', async () => {
      const response = await request(app)
        .post('/api/azure-transcription')
        .send({ audioUrl: 'https://example.com/sample.mp3' })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Azure transcription created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('audioUrl', 'https://example.com/sample.mp3');
      expect(response.body.data).toHaveProperty('transcription');
      expect(response.body.data).toHaveProperty('source', 'azure');
      expect(response.body.data).toHaveProperty('createdAt');
    });

    it('should accept language parameter', async () => {
      const response = await request(app)
        .post('/api/azure-transcription')
        .send({ audioUrl: 'https://example.com/sample.mp3', language: 'fr-FR' })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
    });
  });
});

