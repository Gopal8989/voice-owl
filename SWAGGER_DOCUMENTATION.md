# Swagger API Documentation Guide

## 📚 Overview

VoiceOwl API now includes comprehensive Swagger/OpenAPI documentation accessible via Swagger UI.

## 🚀 Accessing the Documentation

### Development
```
http://localhost:7070/api-docs
```

### Production
```
https://api.voiceowl.com/api-docs
```

## 📋 Documented Endpoints

### 1. POST `/api/transcription`
- **Summary**: Create a mock transcription from an audio URL
- **Request Body**: `TranscriptionRequest` schema
- **Response**: `TranscriptionResponse` schema
- **Status Codes**: 201, 400, 429, 500
- **Rate Limit**: 10 requests per minute

### 2. GET `/api/transcriptions`
- **Summary**: Get all transcriptions from the last 30 days
- **Response**: `TranscriptionsListResponse` schema
- **Status Codes**: 200, 500

### 3. POST `/api/azure-transcription`
- **Summary**: Create a transcription using Azure Speech-to-Text
- **Request Body**: `AzureTranscriptionRequest` schema
- **Response**: `TranscriptionResponse` schema
- **Status Codes**: 201, 400, 429, 502, 500
- **Rate Limit**: 10 requests per minute

### 4. GET `/health`
- **Summary**: Health check endpoint
- **Response**: `HealthResponse` schema
- **Status Codes**: 200, 503

## 🏗️ Schema Definitions

### TranscriptionRequest
```json
{
  "audioUrl": "https://example.com/sample.mp3"
}
```

### AzureTranscriptionRequest
```json
{
  "audioUrl": "https://example.com/sample.mp3",
  "language": "en-US"
}
```

### TranscriptionResponse
```json
{
  "id": "507f1f77bcf86cd799439011",
  "audioUrl": "https://example.com/sample.mp3",
  "transcription": "transcribed text",
  "source": "mock",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### ErrorResponse
```json
{
  "error": "ValidationError",
  "message": "audioUrl is required",
  "statusCode": 400,
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## 🎯 Features

### Swagger UI Features
- ✅ Interactive API testing
- ✅ Request/response examples
- ✅ Schema validation
- ✅ Error response documentation
- ✅ Try-it-out functionality
- ✅ Tagged endpoints
- ✅ Custom styling

### Documentation Includes
- ✅ Complete endpoint descriptions
- ✅ Request body schemas
- ✅ Response schemas
- ✅ Error responses
- ✅ Example values
- ✅ Rate limiting information
- ✅ Status code documentation

## 🔧 Configuration

### Swagger Configuration File
- **Location**: `src/config/swagger.ts`
- **Format**: OpenAPI 3.0.0
- **Schemas**: Defined in `components.schemas`
- **Responses**: Defined in `components.responses`

### Adding New Endpoints

To document a new endpoint, add Swagger comments:

```typescript
/**
 * @swagger
 * /api/new-endpoint:
 *   get:
 *     summary: Description of endpoint
 *     tags: [TagName]
 *     responses:
 *       200:
 *         description: Success response
 */
router.get('/new-endpoint', handler);
```

## 📊 MongoDB Index Improvements

### Enhanced Indexes

1. **Primary Index**: `createdAt: -1`
   - Optimizes date range queries
   - Used by GET /api/transcriptions

2. **Compound Index**: `createdAt: -1, source: 1`
   - Optimizes filtered queries by date and source
   - Reduces index scan time

3. **AudioUrl Index**: `audioUrl: 1`
   - Fast lookups for deduplication
   - Prevents duplicate transcriptions

4. **Source Index**: `source: 1, createdAt: -1`
   - Optimizes source-specific queries
   - Efficient for filtering by source type

5. **TTL Index** (Optional): `createdAt: 1` with expireAfterSeconds
   - Auto-deletes old records
   - Prevents database bloat
   - Ready to enable (uncomment in code)

### Index Performance

- ✅ Optimized for common query patterns
- ✅ Compound indexes for filtered queries
- ✅ Efficient date range queries
- ✅ Fast lookups by audioUrl
- ✅ Ready for 100M+ records

## 🎨 Customization

### Swagger UI Customization

In `src/app.ts`:
```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VoiceOwl API Documentation',
}));
```

### Adding Custom CSS

Modify the `customCss` option to customize Swagger UI appearance.

## 📝 Best Practices

1. **Keep Documentation Updated**: Update Swagger comments when changing endpoints
2. **Use Examples**: Always include example values in schemas
3. **Document Errors**: Include all possible error responses
4. **Tag Endpoints**: Group related endpoints with tags
5. **Validate Schemas**: Ensure schemas match actual request/response types

## 🔍 Testing with Swagger UI

1. Navigate to `/api-docs`
2. Click on an endpoint
3. Click "Try it out"
4. Fill in request parameters
5. Click "Execute"
6. View response

## 📦 Dependencies

- `swagger-jsdoc`: Generates OpenAPI specification from JSDoc comments
- `swagger-ui-express`: Serves Swagger UI interface
- `@types/swagger-jsdoc`: TypeScript types
- `@types/swagger-ui-express`: TypeScript types

---

**All API endpoints are now fully documented and accessible via Swagger UI!**

